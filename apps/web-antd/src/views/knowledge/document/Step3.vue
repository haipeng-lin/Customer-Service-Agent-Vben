<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Button, message } from 'antdv-next';

import { VbenIcon } from '@vben/icons';
import { useRouter } from 'vue-router';

import { saveDocument } from '#/api/agent/agent';

const props = defineProps<{
  initialData: {
    fileList: any[];
    fileType: string;
    diyForm: any;
    documentList: any[];
    datasetId?: number | string;
  };
  loading: boolean;
}>();

const emit = defineEmits<{
  redo: [];
  'set-loading': [value: boolean];
}>();

const [messageApi, ContextHolder] = message.useMessage();

const router = useRouter();
const loading = ref(false);
const success = ref(false);
const errorMsg = ref('');

async function handleSubmit() {
  if (!props.initialData.datasetId) {
    messageApi.error('缺少知识库ID');
    return;
  }

  loading.value = true;
  emit('set-loading', true);

  try {
    await saveDocument({
      documentList: props.initialData.documentList,
      datasetId: props.initialData.datasetId,
    });
    success.value = true;
    messageApi.success('上传成功');
  } catch (err: any) {
    errorMsg.value = err?.message || '保存失败';
    messageApi.error(err?.message || '保存失败');
  } finally {
    loading.value = false;
    emit('set-loading', false);
  }
}

function handleGoToList() {
  router.push('/datasetDetail/' + props.initialData.datasetId);
}

onMounted(() => {
  // 自动提交
  if (props.initialData.documentList?.length > 0) {
    handleSubmit();
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8">
    <ContextHolder />

    <!-- 加载中状态 -->
    <div v-if="loading" class="flex flex-col items-center">
      <VbenIcon icon="icon-[lucide--loader-2]" class="mb-4 text-5xl text-blue-500 animate-spin" />
      <p class="text-lg text-gray-600">正在上传文档...</p>
    </div>

    <!-- 成功状态 -->
    <div v-else-if="success" class="flex flex-col items-center">
      <VbenIcon icon="icon-[lucide--check-circle-2]" class="mb-4 text-5xl text-green-500" />
      <p class="mb-2 text-lg font-medium text-gray-800">上传成功</p>
      <p class="mb-6 text-sm text-gray-500">
        已成功上传 {{ initialData.documentList?.length || 0 }} 个文档片段
      </p>
      <div class="flex gap-3">
        <Button type="primary" @click="handleGoToList">
          返回文档列表
        </Button>
        <Button @click="emit('redo')">
          继续上传
        </Button>
      </div>
    </div>

    <!-- 失败状态 -->
    <div v-else class="flex flex-col items-center">
      <VbenIcon icon="icon-[lucide--x-circle]" class="mb-4 text-5xl text-red-500" />
      <p class="mb-2 text-lg font-medium text-gray-800">上传失败</p>
      <p class="mb-6 text-sm text-gray-500">{{ errorMsg }}</p>
      <div class="flex gap-3">
        <Button @click="handleGoToList">
          返回文档列表
        </Button>
        <Button type="primary" @click="handleSubmit">
          重新上传
        </Button>
      </div>
    </div>
  </div>
</template>
