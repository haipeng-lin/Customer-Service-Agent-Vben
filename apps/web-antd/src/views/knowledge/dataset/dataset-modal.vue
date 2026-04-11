<script setup lang="ts">
import { computed, ref } from "vue";

import { useVbenModal } from "@vben/common-ui";
import { $t } from "@vben/locales";
import { cloneDeep } from "@vben/utils";

import { useVbenForm } from "#/adapter/form";

import { datasetAdd, datasetInfo, datasetUpdate } from "./api";
import { modalSchema } from "./data";
import { modelListAll } from "../../model/model/api/index";
import type { ModelVO } from "../model/model/api/model";

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t("pages.common.edit") : $t("pages.common.add");
});

// 全部向量模型列表
const allModels = ref<ModelVO[]>([]);

// 当前选中的厂家名称
const selectedFlag = ref("");
// 当前选中的具体模型名称
const selectedModelName = ref("");
// 当前选中的模型ID
const selectedModelId = ref<number | string>("");

// 根据选中的厂家获取可选的具体模型列表
const availableModels = computed(() => {
  if (!selectedFlag.value) return [];
  const model = allModels.value.find((m) => m.flag === selectedFlag.value);
  if (!model?.models) return [];
  return model.models.split(",").map((name) => ({ label: name.trim(), value: name.trim() }));
});

// 厂家列表（去重）
const vendorOptions = computed(() => {
  const vendors = allModels.value.map((m) => ({ label: m.flag, value: m.flag }));
  // 去重
  return vendors.filter(
    (v, idx, arr) => arr.findIndex((item) => item.value === v.value) === idx,
  );
});

// 处理厂家选择变化
function handleVendorChange(flag: string) {
  selectedFlag.value = flag;
  selectedModelName.value = "";
  selectedModelId.value = "";
  // 自动选中该厂家的第一个模型
  const model = allModels.value.find((m) => m.flag === flag);
  if (model?.models) {
    const firstModel = model.models.split(",")[0]?.trim();
    if (firstModel) {
      selectedModelName.value = firstModel;
      selectedModelId.value = model.id;
    }
  }
}

// 处理具体模型选择变化
function handleModelChange(modelName: string) {
  selectedModelName.value = modelName;
  // 通过厂家+模型名找到对应模型记录ID
  const model = allModels.value.find(
    (m) => m.flag === selectedFlag.value && m.models?.split(",").includes(modelName),
  );
  if (model) {
    selectedModelId.value = model.id;
  }
}

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

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await datasetInfo(id);
      await formApi.setValues(record);
      // 回显厂家和模型名称
      if (record.embeddingModelName) {
        const parts = record.embeddingModelName.split(",");
        selectedFlag.value = parts[0] || "";
        selectedModelName.value = parts[1] || "";
        // 尝试匹配模型ID
        selectedModelId.value = record.embeddingModelId || "";
      }
    } else {
      selectedFlag.value = "";
      selectedModelName.value = "";
      selectedModelId.value = "";
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
    // 补充向量模型字段
    data.embeddingModelId = selectedModelId.value;
    data.embeddingModelName = selectedFlag.value
      ? `${selectedFlag.value},${selectedModelName.value}`
      : selectedModelName.value;

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
    <!-- 向量模型选择：左边厂家，右边具体模型 -->
    <div class="mt-2 grid grid-cols-2 gap-2">
      <div>
        <div class="mb-1 text-sm text-gray-dark">向量模型厂家</div>
        <a-select :value="selectedFlag" placeholder="请选择模型厂家" class="w-full" @change="handleVendorChange">
          <a-option v-for="v in vendorOptions" :key="v.value" :value="v.value">
            {{ v.label }}
          </a-option>
        </a-select>
      </div>
      <div>
        <div class="mb-1 text-sm text-gray-dark">具体模型</div>
        <a-select :value="selectedModelName" :disabled="!selectedFlag" placeholder="请选择具体模型" class="w-full"
          @change="handleModelChange">
          <a-option v-for="m in availableModels" :key="m.value" :value="m.value">
            {{ m.label }}
          </a-option>
        </a-select>
      </div>
    </div>
  </BasicModal>
</template>
