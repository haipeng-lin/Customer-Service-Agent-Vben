<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';

import { modelAdd, modelInfo, modelUpdate } from './api';
import { modalSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

// 已添加的模型标签
const modelTags = ref<string[]>([]);
// 绑定输入框的值
const modelInputValue = ref('');
// formApi 用 ref 包装，避免在 modalSchema 调用时提前访问
const formApiRef = ref<any>(null);

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认占满两列
    formItemClass: 'col-span-2',
    // 默认label宽度 px
    labelWidth: 80,
    // 通用配置项 会影响到所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 对应 data.ts 中的 modalSchema
  schema: modalSchema(modelInputValue, modelTags, formApiRef),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});
// formApi 赋值给 ref，避免 modalSchema 调用时提前访问
formApiRef.value = formApi;

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    // 获取从主页面传递过来的 id
    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await modelInfo(id);

      // 注意：拦截器已处理 R 对象，直接传 record 即可
      await formApi.setValues(record);
      // 初始化模型标签
      modelTags.value = record.models ? record.models.split(',') : [];
      // 清空输入框显示
      modelInputValue.value = '';
      // 设置 hidden 的 models 字段值
      formApi.setFieldValue('models', record.models || '');
    } else {
      modelTags.value = [];
      modelInputValue.value = '';
      formApi.setFieldValue('models', '');
    }

    modalApi.modalLoading(false);
  },
});

// 移除模型标签
function handleRemoveModel(index: number) {
  modelTags.value.splice(index, 1);
  formApi.setFieldValue('models', modelTags.value.join(','));
}

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    // getValues 获取为一个 readonly 的对象，需要修改必须先深拷贝一次
    const data = cloneDeep(await formApi.getValues());

    // 根据 isUpdate 状态决定调用新增还是修改接口
    await (isUpdate.value ? modelUpdate(data) : modelAdd(data));

    // 通知主页面刷新列表
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal :title="title" class="w-[550px]">
    <BasicForm />
    <!-- 可用模型输入区域 -->
    <div class="mt-2 px-1">
      <div v-if="modelTags.length > 0" class="mt-2 flex flex-wrap gap-2">
        <span v-for="(tag, index) in modelTags" :key="index"
          class="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700">
          {{ tag }}
          <button type="button" class="hover:text-blue-900" @click="handleRemoveModel(index)">
            ×
          </button>
        </span>
      </div>
    </div>
  </BasicModal>
</template>
