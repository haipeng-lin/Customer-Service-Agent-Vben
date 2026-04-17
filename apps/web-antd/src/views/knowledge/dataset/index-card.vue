<script setup lang="ts">
import type { SwitchProps } from "antdv-next";

import { onMounted, ref } from "vue";

import { MdiTrayUpload } from '@vben/icons';

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
      <div class="mb-4">
        <span class="text-lg font-semibold">知识库</span>
      </div>

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <!-- 新增卡片（第一行第一个位置） -->
        <div
          class="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          @click="handleAdd">
          <div class="text-4xl text-gray-400 hover:text-gray-600">+</div>
          <div class="mt-2 text-sm text-gray-400">新增知识库</div>
        </div>

        <!-- 知识库卡片 -->
        <div v-for="item in datasetList" :key="item.id"
          class="flex h-[200px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer"
          @click="handleCardClick(item)">
          <!-- 顶部：标题 + 状态 -->
          <div class="flex items-start justify-between">
            <div class="flex-1 truncate pr-2 text-lg font-semibold" :title="item.title">
              {{ item.title }}
            </div>
            <ApiSwitch :value="item.status === EnableStatus.Enable" :api="(val) => handleChangeStatus(val, item)"
              :disabled="!hasAccessByCodes(['knowledge:dataset:edit'])" @reload="loadData" />
          </div>

          <!-- 描述 -->
          <div class="flex-1 overflow-hidden text-sm text-gray-400" :title="item.description">
            {{ item.description || "暂无描述" }}
          </div>

          <!-- 底部：操作按钮 -->
          <div class="flex items-center justify-end gap-2 border-t border-gray-100 pt-2 mt-auto">
            <MdiTrayUpload v-access:code="['knowledge:document:add']" @click.stop="handleUpload(item)" />

            <VbenIcon icon="icon-[lucide--pencil]" class="cursor-pointer text-gray-400 hover:text-blue-500"
              v-access:code="['knowledge:dataset:edit']" @click.stop="handleEdit(item)" />
            <Popconfirm :get-popup-container="getPopupContainer" placement="left" title="确认删除？"
              @confirm="handleDelete(item)">
              <VbenIcon icon="icon-[lucide--trash2]" class="cursor-pointer text-gray-400 hover:text-red-500"
                v-access:code="['knowledge:dataset:remove']" @click.stop="" />
            </Popconfirm>
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
