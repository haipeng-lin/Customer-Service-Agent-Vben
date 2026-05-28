<script setup lang="ts">
import type { SwitchProps } from "antdv-next";
import type { VbenFormProps } from "@vben/common-ui";
import type { Recordable } from "@vben/types";
import type { VxeGridProps } from "#/adapter/vxe-table";

import { computed, ref } from "vue";

import { useAccess } from "@vben/access";
import { Page, useVbenDrawer, useVbenModal } from "@vben/common-ui";
import type { VbenFormSchema } from "@vben/common-ui";
import { EnableStatus } from "@vben/constants";
import { getPopupContainer } from "@vben/utils";
import { Popconfirm, Space } from "antdv-next";

import { useVbenVxeGrid, vxeCheckboxChecked } from "#/adapter/vxe-table";
import { useVbenForm } from "#/adapter/form";

import {
  documentList,
  documentRemove,
  documentStatusChange,
} from "#/api/knowledge/document";
import { embeddingDocument, generateQuestion } from "#/api/agent/agent/index";
import { modelListAll } from "#/api/model/model/index";
import ApiSwitch from "#/components/global/api-switch.vue";
import { columns, querySchema } from "../document/data";

import DocumentModal from "../document/document-modal.vue";
import type { DocumentForm } from "#/api/knowledge/document/model";

import ParagraphDrawerComp from "#/components/paragraph/paragraph-drawer.vue";

const props = defineProps<{
  datasetId: string;
}>();

const { hasAccessByCodes } = useAccess();

// 过滤掉 datasetId 字段的搜索 schema
const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: computed(() => {
    const schema = querySchema();
    // 移除 datasetId 搜索字段
    return schema.filter((s) => s.fieldName !== "datasetId");
  }),
  wrapperClass: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

// 表格列配置
const gridColumns: VxeGridProps["columns"] = columns.filter(
  (col) => col.field !== "datasetId"
);

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  columns: gridColumns,
  height: "auto",
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await documentList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          datasetId: props.datasetId,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
    keyField: "id",
  },
};

const checked = ref(false);
const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [FormModal, modalApi] = useVbenModal({
  connectedComponent: DocumentModal,
});

const [ParagraphDrawer, paragraphDrawerApi] = useVbenDrawer({
  connectedComponent: ParagraphDrawerComp,
});

// 语言模型列表
const allModels = ref<any[]>([]);

// 生成问题弹窗
const [GenerateQuestionModal, generateQuestionModalApi] = useVbenModal({
  fullscreenButton: false,
  title: "生成问题",
  onCancel: () => generateQuestionModalApi.close(),
  onConfirm: async () => {
    const { valid } = await generateQuestionFormApi.validate();
    if (!valid) return;
    const values = await generateQuestionFormApi.getValues();
    const rows = tableApi.grid.getCheckboxRecords();
    const documentIds = rows.map((row: any) => row.id).join(",");
    await generateQuestion({
      datasetId: props.datasetId,
      documentIds,
      modelId: values.modelId,
      prompt: values.prompt,
    });
    generateQuestionModalApi.close();
  },
  onOpenChange: async (isOpen) => {
    if (!isOpen) return null;
    generateQuestionModalApi.modalLoading(true);
    const models = await modelListAll({ type: "0" }); // type 2 表示语言模型
    allModels.value = models;
    await generateQuestionFormApi.resetForm();
    generateQuestionModalApi.modalLoading(false);
  },
});

// 生成问题表单
const generateQuestionSchema: VbenFormSchema[] = [
  {
    fieldName: "modelId",
    label: "模型",
    component: "Select",
    required: true,
    componentProps: {
      placeholder: "请选择模型",
      options: computed(() =>
        allModels.value.map((m) => ({
          label: m.name,
          value: m.id,
        }))
      ),
    },
  },
  {
    fieldName: "prompt",
    label: "提示词",
    component: "Textarea",
    required: true,
    defaultValue: "内容：{data} \n请总结上面的内容，并根据内容总结生成 2 个问题。\n回答要求：请只输出问题； 请将每个问题放置<question></question>标签中",
    componentProps: {
      placeholder: "请输入提示词",
      rows: 4,
    },
  },
];

const [GenerateQuestionForm, generateQuestionFormApi] = useVbenForm({
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      class: "w-full",
    },
  },
  schema: generateQuestionSchema,
  showDefaultActions: false,
});

function handleGenerateQuestion() {
  generateQuestionModalApi.open();
}

function handleParagraph(row: Recordable<any>) {
  paragraphDrawerApi.setData({ id: row.id, datasetId: props.datasetId });
  paragraphDrawerApi.open();
}

function handleAdd() {
  modalApi.setData({ datasetId: props.datasetId });
  modalApi.open();
}

async function handleEdit(record: Recordable<any>) {
  modalApi.setData({ id: record.id });
  modalApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await documentRemove(row.id);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.id);
  window.modal.confirm({
    title: "提示",
    okType: "danger",
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await documentRemove(ids);
      await tableApi.query();
      checked.value = false;
    },
  });
}

async function handleChangeStatus(
  checked: SwitchProps["checked"],
  row: DocumentForm
) {
  await documentStatusChange({
    id: row.id,
    status: checked ? EnableStatus.Enable : EnableStatus.Disable,
  });
}

function handleEmbedding() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: any) => row.id);
  window.modal.confirm({
    title: "提示",
    okType: "primary",
    content: "是否启动向量文档程序？",
    onOk: async () => {
      await embeddingDocument(ids.join(","));
    },
  });
}
</script>

<template>
  <Page :auto-content-height="true" class="bg-white">
    <BasicTable>
      <template #toolbar-actions>
        <span class="pl-[7px] text-[16px]">文档列表</span>
      </template>
      <template #status="{ row }">
        <ApiSwitch :value="row.status === EnableStatus.Enable" :api="(val) => handleChangeStatus(val, row)"
          :disabled="!hasAccessByCodes(['knowledge:document:edit'])" @reload="() => tableApi.query()" />
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button color="cyan" variant="solid" :disabled="!vxeCheckboxChecked(tableApi)"
            @click="handleGenerateQuestion">
            生成问题
          </a-button>
          <a-button color="purple" variant="solid" :disabled="!vxeCheckboxChecked(tableApi)" @click="handleEmbedding">
            向量
          </a-button>
          <a-button :disabled="!vxeCheckboxChecked(tableApi)" danger type="primary"
            v-access:code="['knowledge:document:remove']" @click="handleMultiDelete">
            {{ $t("pages.common.delete") }}
          </a-button>
          <a-button type="primary" v-access:code="['knowledge:document:add']" @click="handleAdd">
            {{ $t("pages.common.add") }}
          </a-button>

        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button v-access:code="['knowledge:paragraph:list']" @click.stop="handleParagraph(row)">
            分段
          </action-button>
          <action-button v-access:code="['knowledge:document:edit']" @click.stop="handleEdit(row)">
            {{ $t("pages.common.edit") }}
          </action-button>
          <Popconfirm :get-popup-container="getPopupContainer" placement="left" title="确认删除？"
            @confirm="handleDelete(row)">
            <action-button danger v-access:code="['knowledge:document:remove']" @click.stop="">
              {{ $t("pages.common.delete") }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <FormModal @reload="tableApi.query()" />
    <ParagraphDrawer @reload="tableApi.query()" />
    <GenerateQuestionModal class="w-[600px]">
      <GenerateQuestionForm />
    </GenerateQuestionModal>
  </Page>
</template>
