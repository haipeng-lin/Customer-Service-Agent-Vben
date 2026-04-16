<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

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
  prev: [];
  next: [values: { documentList: any[] }];
}>();

const diyForm = reactive({
  splitType: props.initialData.diyForm?.splitType || 1,
  pattern: props.initialData.diyForm?.pattern || '',
  splitLen: props.initialData.diyForm?.splitLen || 512,
  autoClean: props.initialData.diyForm?.autoClean || 1,
});

const nowFileIndex = ref(0);
const segmentTitle = ref<string[]>([]);
const segmentData = ref<any[]>([]);
const nowSegmentData = ref<any[]>([]);
const documentList = ref<any[]>(props.initialData.documentList || []);
const editorVisible = ref(false);
const nowSegementIndex = ref(0);
const editForm = reactive({ title: '', content: '' });
const loading = ref(false);

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 120,
    componentProps: {
      class: 'w-full',
    },
  },
  schema: computed(() => [
    {
      fieldName: 'splitType',
      label: '分段规则',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '默认分段', value: 1 },
          { label: '自定义分段', value: 2 },
        ],
      },
    },
    ...(diyForm.splitType === 2
      ? [
          {
            fieldName: 'pattern',
            label: '自定义分隔符',
            component: 'Input',
            componentProps: {
              placeholder: '例如: ==SPLIT==',
            },
          },
          {
            fieldName: 'splitLen',
            label: '分段长度',
            component: 'InputNumber',
            componentProps: {
              min: 100,
              max: 8000,
            },
          },
          {
            fieldName: 'autoClean',
            label: '自动清洗',
            component: 'RadioGroup',
            componentProps: {
              options: [
                { label: '是', value: 1 },
                { label: '否', value: 2 },
              ],
            },
          },
        ]
      : []),
  ]),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

async function handlePreview() {
  loading.value = true;
  try {
    const formData = new FormData();
    props.initialData.fileList.forEach((file: any) => {
      formData.append('files', file.raw);
    });
    formData.append('pattern', diyForm.pattern);
    formData.append('splitLen', diyForm.splitLen);
    formData.append('splitType', diyForm.splitType);
    formData.append('autoClean', diyForm.autoClean);
    formData.append('fileType', props.initialData.fileType);

    const res = await previewDocument(formData);
    documentList.value = res.data || [];

    nowFileIndex.value = 0;
    segmentTitle.value = [];
    segmentData.value = [];

    documentList.value.forEach((doc: any) => {
      segmentTitle.value.push(doc.name);
      segmentData.value.push(doc.content);
    });

    nowSegmentData.value = segmentData.value[0] || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function handleFileSwitch(index: number) {
  nowFileIndex.value = index;
  nowSegmentData.value = segmentData.value[index] || [];
}

function editSegment(index: number) {
  const target = segmentData.value[nowFileIndex.value][index];
  editForm.title = target.title || '';
  editForm.content = target.content || '';
  nowSegementIndex.value = index;
  editorVisible.value = true;
}

function confirmEdit() {
  segmentData.value[nowFileIndex.value][nowSegementIndex.value] = { ...editForm };
  editorVisible.value = false;
}

function delSegment(index: number) {
  segmentData.value[nowFileIndex.value].splice(index, 1);
  nowSegmentData.value = segmentData.value[nowFileIndex.value] || [];
}

function handleNext() {
  emit('next', { documentList: documentList.value });
}
</script>

<template>
  <div>
    <div class="mb-4 flex gap-6">
      <!-- 左侧：分段设置 -->
      <div class="w-1/2">
        <div class="mb-4 border-l-4 border-blue-500 pl-3 text-base font-medium">
          分段设置
        </div>

        <BasicForm />

        <div class="mt-4 flex justify-end">
          <el-button type="primary" :loading="loading" @click="handlePreview">
            重新预览
          </el-button>
        </div>
      </div>

      <!-- 右侧：分段预览 -->
      <div class="w-1/2">
        <div class="mb-4 border-l-4 border-blue-500 pl-3 text-base font-medium">
          分段预览
        </div>

        <!-- 文件标签列表 -->
        <div v-if="segmentTitle.length > 0" class="mb-4 flex flex-wrap gap-2">
          <div
            v-for="(item, index) in segmentTitle"
            :key="index"
            :class="[
              'flex cursor-pointer items-center gap-1 rounded border px-2 py-1 text-sm',
              index === nowFileIndex
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 hover:border-blue-500',
            ]"
            @click="handleFileSwitch(index)"
          >
            <VbenIcon icon="icon-[lucide--file-text]" />
            <span class="max-w-24 truncate">{{ item }}</span>
          </div>
        </div>

        <div v-if="nowSegmentData.length > 0" class="text-sm text-gray-500">
          共 {{ nowSegmentData.length }} 个片段
        </div>

        <!-- 片段列表 -->
        <div class="mt-3 max-h-[400px] overflow-y-auto">
          <div
            v-for="(item, index) in nowSegmentData"
            :key="index"
            class="mb-3 rounded bg-gray-50 p-4"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="font-medium text-blue-500">#{{ index + 1 }}</span>
              <div class="flex gap-2">
                <VbenIcon icon="icon-[lucide--pencil]" class="cursor-pointer text-gray-400 hover:text-blue-500" @click="editSegment(index)" />
                <VbenIcon icon="icon-[lucide--trash2]" class="cursor-pointer text-gray-400 hover:text-red-500" @click="delSegment(index)" />
              </div>
            </div>
            <div class="mb-2">
              <span class="text-sm font-medium text-gray-600">分段标题：</span>
              <span class="text-sm">{{ item.title || '-' }}</span>
            </div>
            <div class="text-sm text-gray-700">{{ item.content }}</div>
            <div class="mt-2 text-xs text-gray-400">
              {{ item.content?.length || 0 }} 字符
            </div>
          </div>

          <div v-if="nowSegmentData.length === 0" class="py-8 text-center text-gray-400">
            暂无预览数据
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <el-button @click="emit('prev')">上一步</el-button>
      <el-button type="primary" :loading="loading" @click="handleNext">
        提交上传
      </el-button>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editorVisible" title="修改段落" width="800px">
      <el-form :model="editForm" label-width="80">
        <el-form-item label="段落标题">
          <el-input v-model="editForm.title" placeholder="标题" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="段落内容">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="12"
            maxlength="8000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>
