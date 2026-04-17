<script setup lang="ts">
import type { Recordable } from "@vben/types";

import { reactive, ref, watch } from "vue";

import { useAccess } from "@vben/access";
import { $t } from "@vben/locales";
import { getPopupContainer } from "@vben/utils";
import { Popconfirm, Space, Switch } from "antdv-next";

import {
  paragraphAdd,
  paragraphInfo,
  paragraphList as getParagraphList,
  paragraphRemove,
  paragraphStatusChange,
  paragraphUpdate,
} from "#/api/knowledge/paragraph/index";
import type { ParagraphForm, ParagraphVO } from "#/api/knowledge/paragraph/model";

const props = defineProps<{
  documentId: string | number;
}>();

const emit = defineEmits<{ refresh: [] }>();

const { hasAccessByCodes } = useAccess();

const paragraphList = ref<ParagraphVO[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const open = ref(false);
const dialogTitle = ref("");

const data = reactive<{
  form: ParagraphForm;
  rules: Recordable<any>;
}>({
  form: {},
  rules: {
    title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
    content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  },
});

const { form, rules } = data;

const total = ref(0);
const queryParams: {
  pageNum: number;
  pageSize: number;
  documentId: number | string;
} = reactive({
  pageNum: 1,
  pageSize: 10,
  documentId: 0 as number | string,
});

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

watch(
  () => props.documentId,
  (val) => {
    if (val) fetchList();
  },
  { immediate: true },
);

function resetForm() {
  form.id = undefined;
  form.datasetId = undefined;
  form.documentId = props.documentId as number | string;
  form.title = undefined;
  form.content = undefined;
  form.indexStatus = "0";
  form.status = "0";
}

function handleAdd() {
  resetForm();
  open.value = true;
  dialogTitle.value = "添加段落";
}

async function handleUpdate(row: ParagraphVO) {
  const response = await paragraphInfo(row.id);
  Object.assign(form, response);
  open.value = true;
  dialogTitle.value = "编辑段落";
}

async function handleDelete(row: ParagraphVO) {
  await paragraphRemove(row.id);
  await fetchList();
  emit("refresh");
}

async function handleStatusChange(checked: boolean, row: ParagraphVO) {
  await paragraphStatusChange({
    id: row.id,
    status: checked ? "0" : "1",
  });
}

async function submitForm() {
  try {
    submitLoading.value = true;
    if (form.id) {
      await paragraphUpdate(form as ParagraphForm);
    } else {
      await paragraphAdd(form as ParagraphForm);
    }
    open.value = false;
    await fetchList();
    emit("refresh");
  } finally {
    submitLoading.value = false;
  }
}

function cancel() {
  open.value = false;
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
        <Switch v-model="item.status" active-value="0" inactive-value="1"
          :disabled="!hasAccessByCodes(['knowledge:paragraph:edit'])" checked-children="启用" un-checked-children="禁用"
          @change="() => handleStatusChange(item.status === '0', item)" />
      </div>

      <el-scrollbar class="paragraph-doc cursor-pointer" @click="handleUpdate(item)">
        {{ item.content }}
      </el-scrollbar>

      <div class="paragraph-bottom">
        <div class="bottom-info">
          <span>{{ item.content?.length || 0 }} 字符</span>
        </div>
        <Space>
          <a-button size="small" type="text" v-access:code="['knowledge:paragraph:edit']"
            @click.stop="handleUpdate(item)">
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

    <el-empty v-if="paragraphList.length === 0" :description="loading ? '' : '暂无段落数据'" style="width: 100%" />
  </div>

  <div class="flex justify-between items-center mt-4 px-1">
    <span class="text-sm text-gray-500">共 {{ total }} 条</span>
    <Space>
      <a-button size="small" type="primary" v-access:code="['knowledge:paragraph:add']" @click="handleAdd">
        添加分段
      </a-button>
      <a-button size="small" @click="fetchList">刷新</a-button>
    </Space>
  </div>

  <el-dialog v-model:open="open" :title="dialogTitle" width="700px" append-to-body draggable destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="段落标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入段落标题" maxlength="255" show-word-limit />
      </el-form-item>
      <el-form-item label="段落内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="12" placeholder="请输入段落内容" maxlength="2000"
          show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
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
