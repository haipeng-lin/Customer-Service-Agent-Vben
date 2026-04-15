import type { VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { h } from 'vue';
import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';
import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

/**
 * 搜索表单配置
 */
export const querySchema = (): VbenFormSchema[] => [
  {
    fieldName: 'modelId',
    label: '模型Id',
    component: 'Input',
  },
  {
    fieldName: 'source',
    label: '消耗来源',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_SOURCE_TYPE),
      allowClear: true,
    },
  },
  {
    fieldName: 'userId',
    label: '用户Id',
    component: 'Input',
  },
  {
    fieldName: 'applicationId',
    label: '应用Id',
    component: 'Input',
  },
];

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { field: 'id', title: 'Id', width: 200 },
  { field: 'modelId', title: '模型Id' },
  {
    field: 'source',
    title: '消耗来源',
    slots: {
      default: ({ row }) => {
        return renderDict(row.source, DictEnum.APP_SESSION_SOURCE_TYPE);
      },
    },
  },
  { field: 'inputToken', title: '输入token数' },
  { field: 'outputToken', title: '输出token数' },
  { field: 'totalToken', title: '消耗总token' },
  { field: 'userId', title: '用户Id' },
  { field: 'applicationId', title: '应用Id' },
  { field: 'messageId', title: '消息Id' },
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
export const modalSchema = (): VbenFormSchema[] => [
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
    fieldName: 'modelId',
    label: '模型Id',
    component: 'Input',
  },
  {
    fieldName: 'source',
    label: '消耗来源',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_SOURCE_TYPE),
    },
  },
  {
    fieldName: 'inputToken',
    label: '输入token数',
    component: 'Input',
  },
  {
    fieldName: 'outputToken',
    label: '输出token数',
    component: 'Input',
  },
  {
    fieldName: 'totalToken',
    label: '消耗总token',
    component: 'Input',
  },
  {
    fieldName: 'userId',
    label: '用户Id',
    component: 'Input',
  },
  {
    fieldName: 'applicationId',
    label: '应用Id',
    component: 'Input',
  },
  {
    fieldName: 'messageId',
    label: '消息Id',
    component: 'Input',
  },
];
