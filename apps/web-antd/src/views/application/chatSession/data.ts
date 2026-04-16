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
    fieldName: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    fieldName: 'source',
    label: '来源',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_SOURCE_TYPE),
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_STATUS),
      allowClear: true,
    },
  },
];

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { field: 'id', title: 'Id', width: 180 },
  { field: 'userId', title: '用户Id' },
  { field: 'applicationId', title: '应用Id' },
  { field: 'title', title: '标题' },
  {
    field: 'source',
    title: '来源',
    slots: {
      default: ({ row }) => {
        return renderDict(row.source, DictEnum.APP_SESSION_SOURCE_TYPE);
      },
    },
  },
  {
    field: 'status',
    title: '状态',
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, DictEnum.APP_SESSION_STATUS);
      },
    },
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
    fieldName: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    fieldName: 'source',
    label: '来源',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_SOURCE_TYPE),
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SESSION_STATUS),
    },
  },
];
