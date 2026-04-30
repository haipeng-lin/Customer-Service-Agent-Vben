<script setup lang="ts">
import type { Recordable } from "@vben/types";

import { ref, watch } from "vue";

import { useAccess } from "@vben/access";
import { EnableStatus } from "@vben/constants";
import { $t } from "@vben/locales";
import { getPopupContainer } from "@vben/utils";
import { cloneDeep } from "@vben/utils";
import { Empty, Pagination, Popconfirm, Space } from "antdv-next";

import { useVbenModal } from "@vben/common-ui";
import { useVbenForm } from "#/adapter/form";

import {
  paragraphAdd,
  paragraphInfo,
  paragraphList as getParagraphList,
  paragraphRemove,
  paragraphStatusChange,
  paragraphUpdate,
} from "#/api/knowledge/paragraph/index";
import ApiSwitch from "#/components/global/api-switch.vue";
import type { ParagraphForm, ParagraphVO } from "#/api/knowledge/paragraph/model";

const props = defineProps<{
  documentId: string | number;
  datasetId?: string | number;
}>();

const emit = defineEmits<{ refresh: [] }>();

const { hasAccessByCodes } = useAccess();

const paragraphList = ref<ParagraphVO[]>([]);
const loading = ref(false);
const isUpdate = ref(false);
const hiddenData = ref<{ id?: number | string; datasetId?: number | string; documentId?: number | string }>({});

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
      label: "段落标题",
      component: "Input",
      componentProps: {
        placeholder: "请输入段落标题",
        maxlength: 255,
        showCount: true,
      },
    },
    {
      fieldName: "content",
      label: "段落内容",
      component: "Textarea",
      componentProps: {
        placeholder: "请输入段落内容",
        maxlength: 2000,
        showCount: true,
        rows: 12,
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
    if (!isOpen) return null;
    modalApi.modalLoading(true);

    if (isUpdate.value) {
      const { id, datasetId, documentId } = modalApi.getData() as { id?: number | string; datasetId?: number | string; documentId?: number | string };
      hiddenData.value = { id, datasetId, documentId };
      if (id) {
        const record = await paragraphInfo(id);
        await formApi.setValues(record);
      }
    } else {
      hiddenData.value = {
        documentId: props.documentId,
        datasetId: props.datasetId,
      };
      await formApi.resetForm();
    }

    modalApi.modalLoading(false);
  },
});

const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const queryParams: {
  pageNum: number;
  pageSize: number;
  documentId: number | string;
} = {
  pageNum: 1,
  pageSize: 10,
  documentId: 0 as number | string,
};

async function fetchList() {
  if (!props.documentId) return;
  loading.value = true;
  try {
    queryParams.documentId = props.documentId as number | string;
    const response = await getParagraphList(queryParams);
    paragraphList.value = response.rows;
    total.value = response.total;
  } finally {
    loading.value = false;
  }
}

function handlePageChange(page: number, size: number) {
  current.value = page;
  pageSize.value = size;
  queryParams.pageNum = page;
  queryParams.pageSize = size;
  fetchList();
}

watch(
  () => props.documentId,
  (val) => {
    if (val) {
      current.value = 1;
      queryParams.pageNum = 1;
      fetchList();
    }
  },
  { immediate: true },
);

function handleAdd() {
  isUpdate.value = false;
  modalApi.setData({});
  modalApi.open();
}

async function handleEdit(row: ParagraphVO) {
  console.log('11：', row)
  isUpdate.value = true;
  modalApi.setData({ id: row.id, datasetId: row.datasetId, documentId: row.documentId });
  modalApi.open();
}

async function handleDelete(row: ParagraphVO) {
  await paragraphRemove(row.id);
  await fetchList();
  emit("refresh");
}

async function handleStatusChange(checked: any, row: ParagraphVO) {
  await paragraphStatusChange({
    id: row.id,
    status: checked ? EnableStatus.Enable : EnableStatus.Disable,
  });
}

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) return;

    const data = cloneDeep(await formApi.getValues());

    if (isUpdate.value) {
      data.id = hiddenData.value.id;
      data.datasetId = hiddenData.value.datasetId;
      data.documentId = hiddenData.value.documentId;
      await paragraphUpdate(data);
    } else {
      data.documentId = hiddenData.value.documentId;
      data.datasetId = hiddenData.value.datasetId;
      await paragraphAdd(data);
    }

    emit("refresh");
    await fetchList();
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

defineExpose({
  fetchList,
});
</script>

<template>
  <div class="paragraph-list" v-loading="loading">
    <div class="paragraph-item" v-for="item in paragraphList" :key="item.id">
      <div class="paragraph-title">
        <div class="title-left line1" :title="item.title">
          {{ item.title || "无标题" }}
        </div>
        <ApiSwitch :value="item.status === EnableStatus.Enable" :api="(val) => handleStatusChange(val, item)"
          :disabled="!hasAccessByCodes(['knowledge:paragraph:edit'])" />
      </div>

      <div class="paragraph-doc cursor-pointer" @click="handleEdit(item)">
        {{ item.content }}
      </div>

      <div class="paragraph-bottom">
        <div class="bottom-info">
          <span>{{ item.content?.length || 0 }} 字符</span>
        </div>
        <Space>
          <a-button size="small" type="text" v-access:code="['knowledge:paragraph:edit']"
            @click.stop="handleEdit(item)">
            {{ $t("pages.common.edit") }}
          </a-button>
          <Popconfirm :get-popup-container="getPopupContainer" placement="left" title="确认删除？"
            @confirm="handleDelete(item)">
            <a-button size="small" type="text" danger v-access:code="['knowledge:paragraph:remove']" @click.stop="">
              {{ $t("pages.common.delete") }}
            </a-button>
          </Popconfirm>
        </Space>
      </div>
    </div>

    <Empty v-if="paragraphList.length === 0" :description="loading ? '' : '暂无段落数据'" style="width: 100%" />
  </div>

  <div class="flex justify-between items-center mt-4 px-1">
    <Pagination
      v-model:current="current"
      v-model:page-size="pageSize"
      :total="total"
      :show-size-changer="true"
      :show-quick-jumper="true"
      :show-total="(total: number) => `共 ${total} 条`"
      :page-size-options="['10', '20', '50', '100']"
      @change="handlePageChange"
    />
    <Space>
      <a-button size="small" type="primary" v-access:code="['knowledge:paragraph:add']" @click="handleAdd">
        添加分段
      </a-button>
      <a-button size="small" @click="fetchList">刷新</a-button>
    </Space>
  </div>

  <BasicModal :title="isUpdate ? $t('pages.common.edit') : $t('pages.common.add')" class="w-[700px]">
    <BasicForm />
  </BasicModal>
</template>

<style scoped>
.paragraph-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

.paragraph-item {
  background: #fff;
  height: 220px;
  width: calc(50% - 8px);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.paragraph-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.paragraph-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f6fc;
}

.title-left {
  font-weight: bold;
  font-size: 15px;
  color: #303133;
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paragraph-doc {
  flex: 1;
  margin-top: 12px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  cursor: pointer;
  overflow: hidden;
}

.paragraph-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f2f6fc;
  color: #909399;
  font-size: 12px;
}

.bottom-info {
  display: flex;
  align-items: center;
}
</style>
