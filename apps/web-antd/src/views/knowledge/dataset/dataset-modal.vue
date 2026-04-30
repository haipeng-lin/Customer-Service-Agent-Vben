<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

import { useVbenModal } from "@vben/common-ui";
import { $t } from "@vben/locales";
import { cloneDeep } from "@vben/utils";

import { useVbenForm } from "#/adapter/form";

import { modalSchema } from "./data";
import {
  datasetAdd,
  datasetInfo,
  datasetUpdate,
} from '#/api/knowledge/dataset/index';
import { modelListAll } from "#/api/model/model/index";
import type { ModelVO } from "#/api/model/model/model.d";

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t("pages.common.edit") : $t("pages.common.add");
});

// 全部向量模型列表
const allModels = ref<ModelVO[]>([]);

// 将所有模型平铺为级联选项列表
// 第一级为厂家名称，第二级为该厂家的模型列表
const modelOptions = computed(() => {
  const options: { label: string; value: string; children?: { label: string; value: string }[] }[] = [];
  for (const m of allModels.value) {
    if (m.models) {
      const modelNames = m.models.split(",");
      const children = modelNames.map((name) => ({
        label: name.trim(),
        value: `${m.id}:${name.trim()}`,
      }));
      options.push({
        label: m.name,
        value: String(m.id),
        children,
      });
    }
  }
  return options;
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: "col-span-2",
    labelWidth: 80,
    componentProps: {
      class: "w-full",
    },
  },
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: "grid-cols-2",
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    // 获取向量模型列表
    const models = await modelListAll({ type: "1" });
    allModels.value = models;

    // 更新 schema 中的向量模型选项
    await formApi.updateSchema([
      {
        fieldName: "embeddingModelId",
        componentProps: {
          options: modelOptions.value,
        },
      },
    ]);

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await datasetInfo(id);
      // 回显向量模型选择 - Cascader需要数组格式 [vendorId, "vendorId:modelName"]
      if (record.embeddingModelId && record.embeddingModelName) {
        record.embeddingModelId = [String(record.embeddingModelId), `${record.embeddingModelId}:${record.embeddingModelName}`];
      }
      await formApi.setValues(record);
    } else {
      await formApi.resetForm();
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const data = cloneDeep(await formApi.getValues());

    // 解析向量模型字段 - Cascader返回数组格式 [vendorId, "vendorId:modelName"]
    const modelValue = data.embeddingModelId;
    if (Array.isArray(modelValue) && modelValue.length >= 2) {
      const fullValue = modelValue[modelValue.length - 1];
      if (fullValue && typeof fullValue === "string" && fullValue.includes(":")) {
        const [modelId, modelName] = fullValue.split(":");
        data.embeddingModelId = modelId;
        data.embeddingModelName = modelName;
      }
    }

    await (isUpdate.value ? datasetUpdate(data) : datasetAdd(data));

    emit("reload");
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal :title="title" class="w-[600px]">
    <BasicForm />
  </BasicModal>
</template>
