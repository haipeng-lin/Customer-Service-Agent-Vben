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
    fieldName: 'applicationId',
    label: '应用Id',
    component: 'Input',
  },
  {
    fieldName: 'sessionId',
    label: '会话Id',
    component: 'Input',
  },
  {
    fieldName: 'role',
    label: '角色',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_ROLE_TYPE),
      allowClear: true,
    },
  },
  {
    fieldName: 'feedback',
    label: '评价',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_FEEDBACK_TYPE),
      allowClear: true,
    },
  },
];

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { field: 'id', title: 'Id', width: 100 },
  { field: 'userId', title: '用户Id' },
  { field: 'applicationId', title: '应用Id' },
  { field: 'sessionId', title: '会话Id' },
  {
    field: 'role',
    title: '角色',
    slots: {
      default: ({ row }) => {
        return renderDict(row.role, DictEnum.APP_ROLE_TYPE);
      },
    },
  },
  { field: 'content', title: '内容' },
  { field: 'token', title: '消耗Token' },
  { field: 'latencyMs', title: '耗时（毫秒）' },
  {
    field: 'feedback',
    title: '评价',
    slots: {
      default: ({ row }) => {
        return renderDict(row.feedback, DictEnum.APP_FEEDBACK_TYPE);
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
    fieldName: 'sessionId',
    label: '会话Id',
    component: 'Input',
  },
  {
    fieldName: 'role',
    label: '角色',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_ROLE_TYPE),
    },
  },
  {
    fieldName: 'content',
    label: '内容',
    component: 'Input',
  },
  {
    fieldName: 'token',
    label: '消耗Token',
    component: 'Input',
  },
  {
    fieldName: 'latencyMs',
    label: '耗时（毫秒）',
    component: 'Input',
  },
  {
    fieldName: 'feedback',
    label: '评价',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_FEEDBACK_TYPE),
    },
  },
];
