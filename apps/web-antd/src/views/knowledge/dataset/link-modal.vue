<script setup lang="ts">
import { computed, ref } from "vue";

import { useVbenModal } from "@vben/common-ui";

import { documentListAll } from "#/api/knowledge/document";
import { paragraphListAll } from "#/api/knowledge/paragraph";
import { getQuestionRelation, doQuestionRelation } from "#/api/agent/agent";

const emit = defineEmits<{ linkComplete: [] }>();

const title = computed(() => "关联段落");

// 基础变量
const documentList = ref<any[]>([]);
const paragraphList = ref<any[]>([]);
const selectedDocumentId = ref("");
const nowDocumentIndex = ref(0);
const loading = ref(false);
const questionIds = ref("");
const datasetId = ref("");

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) return null;
    modalApi.modalLoading(true);

    const data = modalApi.getData() as {
      questionIds: string;
      datasetId: string | number;
    };
    questionIds.value = data.questionIds;
    datasetId.value = data.datasetId;

    await getDocumentList();
    modalApi.modalLoading(false);
  },
});

async function getDocumentList() {
  const res = await documentListAll({
    datasetId: datasetId.value,
    name: "",
    page: 1,
    limit: 2000,
  });
  console.log('获取全部文档：', res)
  documentList.value = res || [];
  if (documentList.value.length > 0) {
    selectedDocumentId.value = documentList.value[0].id;
    nowDocumentIndex.value = 0;
    await getParagraphList();
  }
}

async function getParagraphList() {
  loading.value = true;
  const res = await paragraphListAll({
    documentId: selectedDocumentId.value,
    page: 1,
    limit: 2000,
  });
  paragraphList.value = res || [];
  await getRelationList();
  loading.value = false;
}

async function getRelationList() {
  const res = await getQuestionRelation({
    questionIds: questionIds.value,
    datasetId: datasetId.value,
  });
  const relationData = res;

  // 构建 Map：documentId -> [paragraphId数组]
  const document2Map = new Map<string, string[]>();
  relationData.forEach((item: any) => {
    if (!document2Map.has(item.documentId)) {
      document2Map.set(item.documentId, []);
    }
    document2Map.get(item.documentId)!.push(item.paragraphId);
  });

  // 设置每个文档的关联段落数量
  documentList.value.forEach((item, index) => {
    const linkedArr = document2Map.get(item.id);
    documentList.value[index].linkNum = linkedArr ? linkedArr.length : 0;
  });

  // 标记当前选中文档的段落是否为已关联状态
  const currentSelectedParagraphIds = document2Map.get(selectedDocumentId.value) || [];
  paragraphList.value.forEach((item, index) => {
    paragraphList.value[index].relationed = currentSelectedParagraphIds.includes(item.id);
  });
}

async function linkParagraph(row: any, index: number) {
  const isRelationed = paragraphList.value[index].relationed;
  const type = isRelationed ? 2 : 1; // 1:新增 2:删除

  loading.value = true;
  try {
    await doQuestionRelation({
      datasetId: datasetId.value,
      questionIds: questionIds.value,
      documentId: selectedDocumentId.value,
      paragraphId: row.id,
      type,
    });
    // 前端逻辑快速响应，更新UI状态
    paragraphList.value[index].relationed = !isRelationed;

    // 更新文档上的数字统计
    const currentDoc = documentList.value[nowDocumentIndex.value];
    if (currentDoc) {
      currentDoc.linkNum += type === 1 ? 1 : -1;
    }
    emit("linkComplete");
  } finally {
    loading.value = false;
  }
}

async function selectDocument(row: any, index: number) {
  nowDocumentIndex.value = index;
  selectedDocumentId.value = row.id;
  await getParagraphList();
}

async function handleConfirm() {
  modalApi.close();
}

async function handleCancel() {
  modalApi.close();
}
</script>

<template>
  <BasicModal :title="title" class="w-[900px]">
    <div class="flex h-[500px]">
      <!-- 左侧文档列表 -->
      <div class="w-[280px] border-r border-gray-200 pr-3">
        <div class="text-sm text-gray-600 mb-2">文档列表</div>
        <div class="flex-1 overflow-auto">
          <div v-for="(item, index) in documentList" :key="item.id"
            class="flex items-center justify-between px-3 py-2 cursor-pointer rounded hover:bg-gray-100"
            :class="{ 'bg-blue-50 text-blue-600': item.id === selectedDocumentId }"
            @click="selectDocument(item, index)">
            <span class="truncate flex-1">{{ item.name || item.title }}</span>
            <span v-if="item.linkNum > 0" class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
              {{ item.linkNum }} 段
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧段落列表 -->
      <div class="flex-1 pl-3">
        <div class="text-sm text-gray-600 mb-2">段落列表</div>
        <div v-loading="loading" class="flex-1 overflow-auto">
          <div v-for="(item, index) in paragraphList" :key="item.id"
            class="mb-2 p-3 border rounded cursor-pointer transition-colors"
            :class="item.relationed ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            @click="linkParagraph(item, index)">
            <div class="text-sm font-medium mb-1">{{ item.title || '--' }}</div>
            <div class="text-xs text-gray-500 line-clamp-10">{{ item.content }}</div>
          </div>
          <div v-if="paragraphList.length === 0" class="text-center text-gray-400 py-8">
            暂无段落
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
