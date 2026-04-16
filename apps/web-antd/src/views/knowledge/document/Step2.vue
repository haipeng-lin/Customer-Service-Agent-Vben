<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";

import { Modal } from "antdv-next";
import { Form, FormItem, Input, message } from "antdv-next";
import { VbenIcon } from "@vben/icons";
import { useVbenForm } from "#/adapter/form";
import { previewDocument } from "#/api/agent/agent";

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
  pattern: props.initialData.diyForm?.pattern || "",
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
const editForm = reactive({ title: "", content: "" });
const loading = ref(false);

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 120,
    componentProps: {
      class: "w-full",
    },
  },
  schema: [
    {
      fieldName: "splitType",
      label: "分段规则",
      component: "RadioGroup",
      defaultValue: 1,
      componentProps: {
        options: [
          { label: "默认分段", value: 1 },
          { label: "自定义分段", value: 2 },
        ],
        onChange: (e: any) => {
          diyForm.splitType = e.target.value;
        },
      },
    },
    {
      fieldName: "pattern",
      label: "自定义分隔符",
      component: "Input",
      defaultValue: "",
      componentProps: {
        placeholder: "例如: ==SPLIT==",
        onChange: (e: any) => {
          diyForm.pattern = e.target.value;
        },
      },
      dependencies: {
        show: () => diyForm.splitType === 2,
        triggerFields: ["splitType"],
      },
    },
    {
      fieldName: "splitLen",
      label: "分段长度",
      component: "InputNumber",
      defaultValue: 512,
      componentProps: {
        min: 100,
        max: 8000,
        onChange: (val: any) => {
          diyForm.splitLen = typeof val === "number" ? val : Number(val);
        },
      },
      dependencies: {
        show: () => diyForm.splitType === 2,
        triggerFields: ["splitType"],
      },
    },
    {
      fieldName: "autoClean",
      label: "自动清洗",
      component: "RadioGroup",
      defaultValue: 1,
      componentProps: {
        options: [
          { label: "是", value: 1 },
          { label: "否", value: 2 },
        ],
        onChange: (e: any) => {
          diyForm.autoClean = e.target.value;
        },
      },
      dependencies: {
        show: () => diyForm.splitType === 2,
        triggerFields: ["splitType"],
      },
    },
  ],
  showDefaultActions: false,
  wrapperClass: "grid-cols-1",
});

async function handlePreview() {
  loading.value = true;
  try {
    const formData = new FormData();
    props.initialData.fileList.forEach((file: any) => {
      const fileToUpload = file.originFileObj || file.raw || file;
      console.log("上传文件:", fileToUpload);
      formData.append("files", fileToUpload);
    });
    formData.append("pattern", diyForm.pattern);
    formData.append("splitLen", diyForm.splitLen);
    formData.append("splitType", diyForm.splitType);
    formData.append("autoClean", diyForm.autoClean);
    formData.append("fileType", props.initialData.fileType);

    console.log("diyForm参数:", {
      pattern: diyForm.pattern,
      splitLen: diyForm.splitLen,
      splitType: diyForm.splitType,
      autoClean: diyForm.autoClean,
      fileType: props.initialData.fileType,
      fileList: props.initialData.fileList,
    });

    const res = await previewDocument(formData);
    console.log("预览接口原始返回:", res);
    console.log("res instanceof Blob:", res instanceof Blob);

    // 解析返回的数据
    let parsedData: any[] = [];
    try {
      if (res instanceof Blob) {
        // 如果是Blob，先转换为文本再解析JSON
        const text = await res.text();
        console.log("Blob文本内容:", text);
        const jsonObj = JSON.parse(text);
        console.log("解析后的JSON:", jsonObj);
        parsedData = jsonObj?.data || jsonObj || [];
      } else if (res?.data?.data) {
        // 双重data结构: { data: { code, msg, data: [...] } }
        parsedData = res.data.data || [];
      } else if (res?.data) {
        // 单层data结构: { data: [...] }
        parsedData = Array.isArray(res.data) ? res.data : res.data.data || [];
      } else if (Array.isArray(res)) {
        // 直接是数组
        parsedData = res;
      } else {
        console.error("预览返回数据格式异常:", res);
        message.error("预览返回数据格式异常");
      }
    } catch (e) {
      console.error("解析预览数据失败:", e);
      message.error("解析预览数据失败");
    }

    console.log("解析后的parsedData:", parsedData);

    documentList.value = parsedData;

    nowFileIndex.value = 0;
    segmentTitle.value = [];
    segmentData.value = [];

    documentList.value.forEach((doc: any) => {
      segmentTitle.value.push(doc.name);
      // 支持多种数据格式
      const content = doc.content || doc.segments || doc;
      segmentData.value.push(Array.isArray(content) ? content : [content]);
    });

    console.log("segmentTitle:", segmentTitle.value);
    console.log("segmentData:", segmentData.value);
    console.log("nowSegmentData:", nowSegmentData.value);

    nowSegmentData.value = segmentData.value[0] || [];

    if (documentList.value.length > 0) {
      message.success(`预览成功，共 ${documentList.value.length} 个文档`);
    }
  } catch (err) {
    console.error(err);
    message.error("预览失败");
  } finally {
    loading.value = false;
  }
}

// 初始化表单默认值
onMounted(async () => {
  await formApi.setValues({
    splitType: diyForm.splitType,
    pattern: diyForm.pattern,
    splitLen: diyForm.splitLen,
    autoClean: diyForm.autoClean,
  });
});

// 监听 documentList 变化，初始化分段预览数据
watch(
  () => props.initialData.documentList,
  (newVal) => {
    console.log('123')
    if (newVal && newVal.length > 0) {
      console.log("documentList更新:", newVal);
      documentList.value = newVal;
      segmentTitle.value = [];
      segmentData.value = [];
      newVal.forEach((doc: any) => {
        segmentTitle.value.push(doc.name);
        const content = doc.content || doc.segments || doc;
        segmentData.value.push(Array.isArray(content) ? content : [content]);
      });
      nowSegmentData.value = segmentData.value[0] || [];
    }
  },
  { immediate: true }
);

function handleFileSwitch(index: number) {
  nowFileIndex.value = index;
  nowSegmentData.value = segmentData.value[index] || [];
}

function editSegment(index: number) {
  const target = segmentData.value[nowFileIndex.value][index];
  editForm.title = target?.title || "";
  editForm.content = target?.content || "";
  nowSegementIndex.value = index;
  editorVisible.value = true;
}

function confirmEdit() {
  segmentData.value[nowFileIndex.value][nowSegementIndex.value] = {
    ...editForm,
  };
  editorVisible.value = false;
}

function delSegment(index: number) {
  segmentData.value[nowFileIndex.value].splice(index, 1);
  nowSegmentData.value = segmentData.value[nowFileIndex.value] || [];
}

function handleNext() {
  emit("next", { documentList: documentList.value });
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

        <div class="mt-4 flex justify-center">
          <a-button type="primary" :loading="loading" @click="handlePreview">
            重新预览
          </a-button>
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
                <VbenIcon
                  icon="icon-[lucide--pencil]"
                  class="cursor-pointer text-gray-400 hover:text-blue-500"
                  @click="editSegment(index)"
                />
                <VbenIcon
                  icon="icon-[lucide--trash2]"
                  class="cursor-pointer text-gray-400 hover:text-red-500"
                  @click="delSegment(index)"
                />
              </div>
            </div>
            <div class="mb-2">
              <span class="text-sm font-medium text-gray-600">分段标题：</span>
              <span class="text-sm">{{ item?.title || "-" }}</span>
            </div>
            <div class="text-sm text-gray-700">{{ item?.content }}</div>
            <div class="mt-2 text-xs text-gray-400">
              {{ item?.content?.length || 0 }} 字符
            </div>
          </div>

          <div
            v-if="nowSegmentData.length === 0"
            class="py-8 text-center text-gray-400"
          >
            暂无预览数据
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <a-button @click="emit('prev')">上一步</a-button>
      <a-button type="primary" :loading="loading" @click="handleNext">
        提交上传
      </a-button>
    </div>

    <!-- 编辑弹窗 -->
    <Modal
      :open="editorVisible"
      title="修改段落"
      width="800px"
      @cancel="editorVisible = false"
    >
      <Form :model="editForm" layout="vertical">
        <FormItem label="段落标题">
          <Input
            v-model:value="editForm.title"
            placeholder="标题"
            :maxlength="255"
            show-count
          />
        </FormItem>
        <FormItem label="段落内容">
          <Input
            v-model:value="editForm.content"
            type="textarea"
            :rows="12"
            :maxlength="8000"
            show-count
          />
        </FormItem>
      </Form>
      <template #footer>
        <a-button @click="editorVisible = false">取消</a-button>
        <a-button type="primary" @click="confirmEdit">确认修改</a-button>
      </template>
    </Modal>
  </div>
</template>
