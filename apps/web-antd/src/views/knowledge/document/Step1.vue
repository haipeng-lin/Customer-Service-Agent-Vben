<script setup lang="ts">
import { ref } from 'vue';

import { Upload } from 'antdv-next';

import { VbenIcon } from '@vben/icons';
import { useVbenForm } from '#/adapter/form';
import { previewDocument } from '#/api/agent/agent';

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
  next: [values: typeof props.initialData];
}>();

const fileList = ref<any[]>([]);
const fileType = ref('txt');
const acceptConfig = ref('.txt,.md,.pdf,.docx,.html,.xls,.xlsx,.csv');
const loading = ref(false);

const excelTpl = '/tpl/excel表格模板.xlsx';
const qaTpl = '/tpl/qa模板.xlsx';

const fileTypeOptions = [
  { label: '文本文件', value: 'txt' },
  { label: 'Excel表格', value: 'excel' },
  { label: 'QA 问答对', value: 'qa' },
];

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 100,
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      fieldName: 'fileType',
      label: '文件类型',
      component: 'Select',
      componentProps: {
        options: fileTypeOptions,
        onChange: (val: string) => {
          fileType.value = val;
          acceptConfig.value = val === 'txt'
            ? '.txt,.md,.pdf,.docx,.html,.xls,.xlsx,.csv'
            : '.xlsx';
        },
      },
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

function getExtByName(name: string) {
  return name.split('.').pop()?.toLowerCase() || '';
}

function delFile(index: number) {
  fileList.value.splice(index, 1);
}

function handleBeforeUpload(file: any) {
  if (file.size / 1024 / 1024 > 100) {
    window.$message.error('上传的文件不得超过100M');
    return false;
  }
  fileList.value.push(file);
  return false; // 阻止自动上传
}

async function handleNext() {
  if (fileList.value.length === 0) {
    window.$message.error('请上传文件');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    fileList.value.forEach((file: any) => {
      formData.append('files', file.originFileObj || file);
    });
    formData.append('pattern', '');
    formData.append('splitLen', 512);
    formData.append('splitType', 1);
    formData.append('autoClean', 1);
    formData.append('fileType', fileType.value);

    if (fileType.value === 'txt') {
      const res = await previewDocument(formData);
      const documentList = res.data || [];

      emit('next', {
        fileList: fileList.value,
        fileType: fileType.value,
        diyForm: {
          splitType: 1,
          pattern: '',
          splitLen: 512,
          autoClean: 1,
        },
        documentList,
        datasetId: props.initialData.datasetId,
      });
    } else {
      window.$message.info('Excel/QA 文件暂不支持预览');
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="mb-4 border-l-4 border-blue-500 pl-3 text-base font-medium">
      上传文档
    </div>

    <div class="mb-4 rounded bg-purple-50 p-4 text-sm">
      <p v-if="fileType === 'txt'" class="mb-2">
        1、文件上传前，建议规范文件的分段标识
      </p>
      <p v-if="fileType === 'txt'" class="mb-2">
        2、每次最多上传 50 个文件，每个文件不超过 50MB
      </p>
      <p v-if="fileType === 'excel'">
        1、下载系统提供的模板：<a :href="excelTpl" class="text-blue-500 hover:text-blue-600" download>下载模板</a>
      </p>
      <p v-if="fileType === 'excel'" class="mt-1">
        2、数据表采用结构化格式，系统将每条记录结合表头处理
      </p>
      <p v-if="fileType === 'qa'">
        1、下载系统提供的模板：<a :href="qaTpl" class="text-blue-500 hover:text-blue-600" download>下载模板</a>
      </p>
      <p v-if="fileType === 'qa'" class="mt-1">
        2、支持多Sheet处理，标题即文档标题
      </p>
    </div>

    <BasicForm />

    <!-- 文件上传区域 -->
    <div class="mt-4">
      <Upload :accept="acceptConfig" :auto-upload="false" :show-upload-list="false" :multiple="true"
        :before-upload="handleBeforeUpload">
        <div
          class="flex flex-col items-center justify-center py-6 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
          <VbenIcon icon="icon-[lucide--upload-cloud]" class="mb-2 text-4xl text-gray-400" />
          <div class="text-sm text-gray-600">
            拖拽文件至此上传或 <em class="text-blue-500">选择文件</em>
          </div>
          <div class="mt-1 text-xs text-gray-400">
            支持格式：{{ fileType === 'txt' ? 'TXT, MD, PDF, DOCX, HTML, XLS, XLSX, CSV' : 'XLSX' }}
          </div>
        </div>
      </Upload>
    </div>

    <!-- 文件列表 -->
    <div class="mt-4">
      <div v-if="fileList.length > 0" class="mb-2 text-sm text-gray-600">
        已上传 {{ fileList.length }} 个文件
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="(item, index) in fileList" :key="index"
          class="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2">
          <img :src="`/img/files_icon/${getExtByName(item.name)}.png`" class="w-6" />
          <span class="max-w-32 truncate text-sm">{{ item.name }}</span>
          <VbenIcon icon="icon-[lucide--trash2]" class="cursor-pointer text-gray-400 hover:text-red-500"
            @click="delFile(index)" />
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <a-button color="primary" variant="solid" @click="() => window.history.back()">取消</a-button>
      <a-button type="cyan" variant="solid" :loading="loading" @click="handleNext">
        下一步></a-button>
    </div>
  </div>
</template>
