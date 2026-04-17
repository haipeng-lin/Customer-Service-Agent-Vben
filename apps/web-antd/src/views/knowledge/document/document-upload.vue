<script setup lang="ts">

import { reactive, ref } from 'vue';

import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Steps } from 'antdv-next';

import Step1 from './Step1.vue';
import Step2 from './Step2.vue';
import Step3 from './Step3.vue';

const route = useRoute();
const current = ref(0);
const loading = ref(false);

// 存储各步骤的数据
const formData = reactive<{
  fileList: any[];
  fileType: string;
  diyForm: {
    splitType: number;
    pattern: string;
    splitLen: number;
    autoClean: number;
  };
  documentList: any[];
  datasetId?: string;
}>({
  fileList: [],
  fileType: 'txt',
  diyForm: {
    splitType: 1,
    pattern: '',
    splitLen: 512,
    autoClean: 1,
  },
  documentList: [],
  datasetId: String(route.query.datasetId) || undefined,
});

function handleStep1Next(step1Values: typeof formData) {
  Object.assign(formData, step1Values);
  current.value++;
}

function handleStepPrev() {
  current.value--;
}

function handleStep2Next(step2Values: { documentList: any[] }) {
  formData.documentList = step2Values.documentList;
  current.value++;
}

function handleRedo() {
  current.value = 0;
  formData.fileList = [];
  formData.documentList = [];
}

function setLoading(value: boolean) {
  loading.value = value;
}


</script>

<template>
  <Page :auto-content-height="true" class="bg-[#f1f3f6]">
    <div class="mx-auto bg-white p-6">
      <Steps :current="current" :items="[
        {
          title: '上传文档'
        },
        {
          title: '清洗数据'
        },
        {
          title: '提交数据'
        },
      ]"></Steps>
      <div class="mt-8">
        <Step1 v-show="current === 0" :initial-data="formData" :loading="loading" @next="handleStep1Next" />
        <Step2 v-show="current === 1" :initial-data="formData" :loading="loading" @prev="handleStepPrev"
          @next="handleStep2Next" />
        <Step3 v-show="current === 2" :initial-data="formData" :loading="loading" @redo="handleRedo"
          @set-loading="setLoading" />
      </div>
    </div>
  </Page>
</template>
