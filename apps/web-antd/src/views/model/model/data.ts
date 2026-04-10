import type { VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { Ref } from 'vue';
import { h } from 'vue';

import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

/**
 * 处理回车添加模型
 */
export function handleModelInputKeydown(
  e: KeyboardEvent,
  modelInputValue: Ref<string>,
  modelTags: Ref<string[]>,
  formApiRef: Ref<any>
) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const value = target.value?.trim() || '';
    if (value && !modelTags.value.includes(value)) {
      modelTags.value.push(value);
      formApiRef.value?.setFieldValue('models', modelTags.value.join(','));
      // 清空输入框
      target.value = '';
      modelInputValue.value = '';
    }
  }
}

/**
 * 搜索表单配置
 */
export const querySchema = (): VbenFormSchema[] => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '模型名称',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.MD_MODEL_TYPE),
      allowClear: true,
    },
    fieldName: 'type',
    label: '模型类型',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
      allowClear: true,
    },
    fieldName: 'status',
    label: '状态',
  },
];

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { field: 'id', title: 'Id', width: 100 },
  {
    field: 'name',
    title: '模型名称',
  },
  {
    field: 'type',
    title: '模型类型',
    slots: {
      default: ({ row }) => {
        return renderDict(row.type, DictEnum.MD_MODEL_TYPE);
      },
    },
  },
  {
    field: 'flag',
    title: '模型标志',
  },
  {
    field: 'address',
    title: '模型地址',
  },
  {
    field: 'key',
    title: '模型key',
  },
  {
    field: 'models',
    title: '可用模型',
    slots: {
      default: ({ row }) => {
        if (!row.models) return '-';
        const tags = row.models.split(',');
        return tags.map((tag: string) =>
          h(
            'span',
            {
              class:
                'inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 mr-1 mb-1',
            },
            tag
          )
        );
      },
    },
    width: 200,
  },
  // {
  //   field: 'icon',
  //   title: '模型图标',
  // },
  {
    field: 'status',
    title: '状态',
    slots: { default: 'status' },
    minWidth: 40,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 160,
  },
];

/**
 * 弹窗表单配置 (新增/修改)
 */
export const modalSchema = (
  modelInputValue: Ref<string>,
  modelTags: Ref<string[]>,
  formApiRef: Ref<any>
): VbenFormSchema[] => [
  {
    fieldName: 'id',
    label: 'Id',
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
  },
  {
    fieldName: 'name',
    label: '模型名称',
    component: 'Input',
    rules: 'required',
  },
  {
    fieldName: 'type',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.MD_MODEL_TYPE),
    },
    label: '模型类型',
    component: 'Select',
    rules: 'required',
  },
  {
    fieldName: 'flag',
    label: '模型标志',
    component: 'Input',
    rules: 'required',
  },
  {
    fieldName: 'address',
    label: '模型地址',
    component: 'Input',
  },
  {
    fieldName: 'key',
    label: '模型key',
    component: 'Input',
  },
  {
    fieldName: 'modelInputValue',
    label: '可用模型',
    component: 'Input',
    componentProps: {
      onKeydown: (e: KeyboardEvent) => {
        handleModelInputKeydown(e, modelInputValue, modelTags, formApiRef);
      },
    },
  },
  {
    fieldName: 'models',
    label: 'models',
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
  },
];
