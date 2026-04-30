<script setup lang="ts">
import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import { Page, useVbenModal } from "@vben/common-ui";

import { VbenIcon } from "@vben/icons";

import { datasetInfo } from "#/api/knowledge/dataset/index";
import type { DatasetVO } from "#/api/knowledge/dataset/model";

import DocumentList from "./detail-document-list.vue";
import QuestionList from "./detail-question-list.vue";
import IndexEditModal from "./index-edit-modal.vue";
import HitTest from "./hit-test.vue";

const route = useRoute();
const router = useRouter();

const datasetId = computed(() => String(route.params.datasetId));

const activeKey = ref("documents");

const [FormModal, modalApi] = useVbenModal({
  connectedComponent: IndexEditModal,
});

function handleEditDataset() {
  modalApi.setData({ id: datasetId.value });
  modalApi.open();
}

const navItems = [
  { key: "documents", label: "文档列表", icon: "mingcute:document-fill" },
  { key: "questions", label: "问题列表", icon: "mingcute:question-fill" },
  { key: "hittest", label: "命中测试", icon: "streamline:target-solid" },
  { key: "edit", label: "编辑知识库", icon: "lucide:edit-2" },
];

// 获取知识库信息用于面包屑
const datasetDetail = ref<DatasetVO | null>(null);
async function loadDatasetInfo() {
  console.log('datasetId：', datasetId)
  if (datasetId.value) {
    const info = await datasetInfo(datasetId.value);
    datasetDetail.value = info;
  }
}

loadDatasetInfo();

function handleNavClick(key: string) {
  if (key === "edit") {
    handleEditDataset();
  } else {
    activeKey.value = key;
  }
}

function goBack() {
  router.push("/dataset/card");
}
</script>

<template>
  <Page :auto-content-height="true">
    <!-- 面包屑 -->
    <div class="mb-4 flex items-center gap-2">
      <span class="cursor-pointer text-blue-500 hover:text-blue-600" @click="goBack">
        知识库
      </span>
      <span class="text-gray-400">/</span>
      <span class="text-gray-500">{{ datasetDetail?.title || "详情" }}</span>
    </div>

    <div class="flex gap-3">
      <!-- 左侧导航 -->
      <div class="w-[170px] flex-shrink-0 bg-white">
        <div v-for="item in navItems" :key="item.key" :class="[
          'flex cursor-pointer items-center gap-2 px-4 py-3 transition-colors',
          activeKey === item.key
            ? 'border-l-2 border-blue-500 bg-blue-50 text-blue-500'
            : 'border-l-2 border-transparent text-gray-600 hover:bg-gray-50',
        ]" @click="handleNavClick(item.key)">
          <VbenIcon :icon="item.icon" class="text-base" />
          <span class="text-sm">{{ item.label }}</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="flex-1 bg-white p-2 overflow-auto">
        <DocumentList v-if="activeKey === 'documents'" :dataset-id="datasetId" />
        <QuestionList v-if="activeKey === 'questions'" :dataset-id="datasetId" />
        <div v-if="activeKey === 'hittest'" class="h-full">
          <HitTest :dataset-id="datasetId" />
        </div>
      </div>
    </div>
  </Page>
  <FormModal @reload="loadDatasetInfo" />
</template>
