<script setup lang="ts">
import type { SwitchProps } from "antdv-next";

import { onMounted, ref } from "vue";

import { MdiTrayUpload, MdiLightSettings, MdiDelete } from '@vben/icons';

import { useAccess } from "@vben/access";
import { Page, useVbenModal } from "@vben/common-ui";
import { EnableStatus } from "@vben/constants";
import { getPopupContainer } from "@vben/utils";
import { Popconfirm } from "antdv-next";
import { useRouter } from "vue-router";

import {
  datasetListAll,
  datasetRemove,
  datasetStatusChange,
} from "#/api/knowledge/dataset/index";
import ApiSwitch from "#/components/global/api-switch.vue";
import { VbenIcon } from "@vben/icons";

import DatasetModal from "./dataset-modal.vue";
import type { DatasetVO } from "#/api/knowledge/dataset/model";

const { hasAccessByCodes } = useAccess();
const router = useRouter();

// 知识库列表数据
const datasetList = ref<DatasetVO[]>([]);

// 加载数据
async function loadData() {
  datasetList.value = await datasetListAll();
}

onMounted(() => {
  loadData();
});

// 新增弹窗
const [AddModal, addModalApi] = useVbenModal({
  connectedComponent: DatasetModal,
});

function handleAdd() {
  addModalApi.setData({});
  addModalApi.open();
}

// 编辑弹窗
const [EditModal, editModalApi] = useVbenModal({
  connectedComponent: DatasetModal,
});

function handleEdit(record: DatasetVO) {
  editModalApi.setData({ id: record.id });
  editModalApi.open();
}

// 删除
async function handleDelete(record: DatasetVO) {
  await datasetRemove(record.id);
  await loadData();
}

// 状态切换
async function handleChangeStatus(
  checked: SwitchProps["checked"],
  row: DatasetVO,
) {
  await datasetStatusChange({
    id: row.id,
    status: checked ? EnableStatus.Enable : EnableStatus.Disable,
  });
  await loadData();
}

// 跳转到详情页
function handleCardClick(item: DatasetVO) {
  router.push(`/datasetDetail/${item.id}`);
}

// 跳转到文档上传页
function handleUpload(item: DatasetVO) {
  router.push(`/dataset/document-upload?datasetId=${item.id}`);
}
</script>

<template>
  <Page :auto-content-height="true" class="bg-[#f1f3f6]">
    <!-- 白色内容区 -->
    <div class="min-h-full bg-white p-4">
      <!-- 页面标题 -->
      <div class="mb-4 flex items-center justify-between">
        <span class="text-lg font-semibold">知识库</span>
        <a-button v-access:code="['knowledge:dataset:add']" type="primary" @click="handleAdd">
          新增知识库
        </a-button>
      </div>

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <!-- 知识库卡片 -->
        <div v-for="item in datasetList" :key="item.id"
          class="flex h-[200px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer"
          @click="handleCardClick(item)">
          <!-- 顶部：图标 + 标题 + 创建人 -->
          <div class="flex items-start gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white text-xl font-bold">
              {{ item.title?.charAt(0) || "?" }}
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <span class="truncate text-lg font-semibold" :title="item.title">{{ item.title }}</span>
                <ApiSwitch :value="item.status === EnableStatus.Enable" :api="(val) => handleChangeStatus(val, item)"
                  :disabled="!hasAccessByCodes(['knowledge:dataset:edit'])" @reload="loadData" />
              </div>
              <span class="text-sm text-gray-400 truncate" :title="item.createByName || ''">
                {{ item.createByName || "未知创建人" }}
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <div class="flex-1 overflow-hidden text-sm text-gray-400 mt-2" :title="item.description">
            {{ item.description || "暂无描述" }}
          </div>

          <!-- 底部：操作按钮 + 文档数和应用数 -->
          <div class="flex items-center justify-between gap-2 border-t border-gray-100 pt-2 mt-auto">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>{{ item.documentCount }} 文档数</span>
              <span>{{ item.applicationCount }} 应用数</span>
            </div>
            <div class="flex items-center gap-2">
              <a-button v-access:code="['knowledge:document:add']" size="small" type="link"
                @click.stop="handleUpload(item)">
                <template #icon>
                  <MdiTrayUpload />
                </template>
                上传
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <a-empty v-if="datasetList.length === 0" class="mt-8" description="暂无知识库数据" />
    </div>

    <!-- 弹窗 -->
    <AddModal @reload="loadData" />
    <EditModal @reload="loadData" />
  </Page>
</template>
