<script setup lang="ts">
import { computed, ref } from "vue";

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
import { modelListAll } from "#/views/model/model/api/index";
import type { ModelVO } from "#/api/knowledge/dataset/model";

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t("pages.common.edit") : $t("pages.common.add");
});

// 全部向量模型列表
const allModels = ref<ModelVO[]>([]);

// 将所有模型平铺为选项列表
// 使用 "vendorId:modelName" 作为 value 以区分同一厂家的多个模型
const modelOptions = computed(() => {
  const options: { label: string; value: string }[] = [];
  for (const m of allModels.value) {
    if (m.models) {
      const modelNames = m.models.split(",");
      for (const name of modelNames) {
        options.push({
          label: `${m.name} - ${name.trim()}`,
          value: `${m.id}:${name.trim()}`,
        });
      }
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
      // 回显向量模型选择 - 将存储的值转换为选择框格式
      if (record.embeddingModelName) {
        const parts = record.embeddingModelName.split(",");
        const modelName = parts[1] || "";
        record.embeddingModelId = `${record.embeddingModelId}:${modelName}`;
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

    // 解析向量模型字段
    const modelValue = data.embeddingModelId;
    if (
      modelValue &&
      typeof modelValue === "string" &&
      modelValue.includes(":")
    ) {
      const [modelId, modelName] = modelValue.split(":");
      data.embeddingModelId = modelId;
      // 查找对应的厂家标识
      const model = allModels.value.find((m) => m.id == modelId);
      if (model) {
        data.embeddingModelName = `${modelName}`;
      } else {
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
