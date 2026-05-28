<script setup lang="ts">
import { computed, ref } from "vue";

import { useVbenModal } from "@vben/common-ui";
import { $t } from "@vben/locales";
import { cloneDeep } from "@vben/utils";

import { useVbenForm } from "#/adapter/form";

import { datasetInfo, datasetUpdate } from "#/api/knowledge/dataset";
import type { DatasetForm } from "#/api/knowledge/dataset/model";

const emit = defineEmits<{ reload: [] }>();

const datasetId = ref<number | string>();
const title = computed(() => {
  return "编辑知识库";
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: "col-span-2",
    labelWidth: 80,
    componentProps: {
      class: "w-full",
    },
  },
  schema: [
    {
      fieldName: "title",
      label: "标题",
      component: "Input",
      componentProps: {
        placeholder: "请输入标题",
        maxlength: 255,
        showCount: true,
      },
    },
    {
      fieldName: "description",
      label: "描述",
      component: "Input",
      componentProps: {
        placeholder: "请输入描述",
        maxlength: 500,
        showCount: true,
        rows: 3,
      },
    },
  ],
  showDefaultActions: false,
  wrapperClass: "grid-cols-1",
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

    datasetId.value = modalApi.getData().id;

    if (datasetId.value) {
      const record = await datasetInfo(datasetId.value);
      await formApi.setValues({
        title: record.title,
        description: record.description,
      });
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

    const data = cloneDeep(await formApi.getValues()) as DatasetForm;
    data.id = datasetId.value;

    await datasetUpdate(data);

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
  <BasicModal :title="title" class="w-[500px]">
    <BasicForm />
  </BasicModal>
</template>