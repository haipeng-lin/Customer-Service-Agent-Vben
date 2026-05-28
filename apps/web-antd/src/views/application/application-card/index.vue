<script setup lang="ts">
import { onMounted, ref } from "vue";

import { MdiTrayUpload, MdiLightSettings, MdiDelete } from '@vben/icons';

import { useAccess } from "@vben/access";
import { Page, useVbenModal } from "@vben/common-ui";
import { getPopupContainer } from "@vben/utils";
import { Popconfirm } from "antdv-next";
import { useRouter } from "vue-router";

import {
  applicationListAll,
  applicationRemove,
} from "#/api/application/application";
import { VbenIcon } from "@vben/icons";

import ApplicationModal from "../application/application-modal.vue"
import type { ApplicationVO } from "#/api/application/application/model";

const { hasAccessByCodes } = useAccess();
const router = useRouter();

// 应用列表数据
const applicationList = ref<ApplicationVO[]>([]);

// 加载数据
async function loadData() {
  applicationList.value = await applicationListAll();
}

onMounted(() => {
  loadData();
});

// 新增弹窗
const [AddModal, addModalApi] = useVbenModal({
  connectedComponent: ApplicationModal,
});

function handleAdd() {
  addModalApi.setData({});
  addModalApi.open();
}

// 编辑弹窗
const [EditModal, editModalApi] = useVbenModal({
  connectedComponent: ApplicationModal,
});

function handleEdit(record: ApplicationVO) {
  editModalApi.setData({ id: record.id });
  editModalApi.open();
}

// 删除
async function handleDelete(record: ApplicationVO) {
  await applicationRemove(record.id);
  await loadData();
}

// 跳转到详情页
function handleCardClick(item: ApplicationVO) {
  router.push(`/application-chat/${item.id}`);
}

// 跳转到聊天页面
function handleChat(item: ApplicationVO) {
  router.push(`/application-chat/${item.id}`);
}
</script>

<template>
  <Page :auto-content-height="true" class="bg-[#f1f3f6]">
    <!-- 白色内容区 -->
    <div class="min-h-full bg-white p-4">
      <!-- 页面标题 -->
      <div class="mb-4 flex items-center justify-between">
        <span class="text-lg font-semibold">应用</span>
        <a-button v-access:code="['application:application:add']" type="primary" @click="handleAdd">
          新增应用
        </a-button>
      </div>

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <!-- 应用卡片 -->
        <div v-for="item in applicationList" :key="item.id"
          class="flex h-[200px] flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer"
          @click="handleCardClick(item)">
          <!-- 顶部：图标 + 标题 + 创建人 -->
          <div class="flex items-start gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white text-xl font-bold overflow-hidden">
              <img v-if="item.icon" :src="item.icon" class="h-full w-full object-cover" />
              <span v-else>{{ item.name?.charAt(0) || "?" }}</span>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <span class="truncate text-lg font-semibold" :title="item.name">{{ item.name }}</span>
                <span :class="item.status === '1' ? 'text-green-500' : 'text-gray-400'">
                  {{ item.status === '1' ? '已发布' : '待发布' }}
                </span>
              </div>
              <span class="text-sm text-gray-400 truncate" :title="item.modelName || ''">
                {{ item.modelName || "未知模型" }}
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <div class="flex-1 overflow-hidden text-sm text-gray-400 mt-2" :title="item.description">
            {{ item.description || "暂无描述" }}
          </div>

          <!-- 底部：操作按钮 -->
          <div class="flex items-center justify-between gap-2 border-t border-gray-100 pt-2 mt-auto">
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>{{ item.isRelateDataset === '1' ? '已关联知识库' : '未关联知识库' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <a-button v-access:code="['application:application:chat']" size="small" type="link"
                @click.stop="handleChat(item)">
                <template #icon>
                  <MdiTrayUpload />
                </template>
                聊天
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <a-empty v-if="applicationList.length === 0" class="mt-8" description="暂无应用数据" />
    </div>

    <!-- 弹窗 -->
    <AddModal @reload="loadData" />
    <EditModal @reload="loadData" />
  </Page>
</template>
