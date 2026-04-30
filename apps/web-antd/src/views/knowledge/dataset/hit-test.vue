<script setup lang="ts">
import { reactive, ref } from "vue";

import { Page } from "@vben/common-ui";

import {
  Button,
  Card,
  Input,
  InputNumber,
  Select,
  Spin,
  Tag,
  Empty,
} from "antdv-next";
import { message } from "antdv-next";

import { hitTest } from "#/api/agent/agent/index";

const props = defineProps<{
  datasetId: string;
}>();

interface HitResult {
  paragraphId: string | number;
  content: string;
  similarity?: number;
  documentName?: string;
}

const searchForm = reactive({
  question: "",
  searchType: "embedding",
  similarity: 0.3,
  topRank: 5,
});

const results = ref<HitResult[]>([]);
const loading = ref(false);

const query = async () => {
  if (!searchForm.question) {
    return message.warning("请输入测试问题");
  }

  loading.value = true;
  try {
    const response = await hitTest({
      datasetIds: props.datasetId,
      question: searchForm.question,
      searchType: searchForm.searchType,
      similarity: searchForm.similarity,
      topRank: searchForm.topRank,
    });
    console.log("命中测试响应：", response);
    results.value = response || [];
  } catch (error) {
    console.error("命中测试异常：", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Page :auto-content-height="true" class="bg-white">
    <div class="p-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-4">
        <span class="text-sm text-gray-500">检索模式</span>
        <Select v-model:value="searchForm.searchType" style="width: 120px" :options="[
          { label: '向量检索', value: 'embedding' },
          { label: '全文检索', value: 'text' },
        ]" />

        <span class="text-sm text-gray-500">最低相似度</span>
        <InputNumber v-model:value="searchForm.similarity" :min="0" :max="1" :precision="2" :step="0.1"
          style="width: 100px" />

        <span class="text-sm text-gray-500">召回</span>
        <InputNumber v-model:value="searchForm.topRank" :min="1" :max="20" style="width: 100px" />

        <Input v-model:value="searchForm.question" placeholder="请输入测试问题" style="width: 300px" @keyup.enter="query" />
        <Button type="primary" :loading="loading" @click="query">
          开始测试
        </Button>
      </div>

      <!-- 结果列表 -->
      <Spin v-model:spinning="loading" class="mt-4">
        <div v-if="results.length > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card v-for="(item, index) in results" :key="index" class="mb-3 h-[420px]" :body-style="{ padding: '12px' }">
            <template #title>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">ID: {{ item?.paragraphId }}</span>
                <Tag color="success">
                  {{ ((item?.similarity || 0) * 100).toFixed(2) }}%
                </Tag>
              </div>
            </template>
            <template #extra>
              <span class="text-xs text-gray-400">来源: {{ item?.documentName || '未知文档' }}</span>
            </template>
            <p class="line-clamp-15 whitespace-pre-wrap text-sm text-gray-700">
              {{ item?.content }}
            </p>
          </Card>
        </div>
        <Empty v-else description="无命中段落" class="py-20" />
      </Spin>
    </div>
  </Page>
</template>
