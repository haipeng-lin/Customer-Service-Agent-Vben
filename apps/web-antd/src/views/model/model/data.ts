import type { VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';

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
    fieldName: 'type',
    label: '模型类型',
  },
  {
    component: 'Input',
    fieldName: 'status',
    label: '状态（0-启用 1-禁用）',
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
    title: '模型类型（0-语言 1-向量 2-重排）',
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
  },
  {
    field: 'icon',
    title: '模型图标',
  },
  {
    field: 'status',
    title: '状态',
  },
  {
    field: 'updateDept',
    title: '修改部门',
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
    fieldName: 'name',
    label: '模型名称',
    component: 'Input',
  },
  {
    fieldName: 'type',
    label: '模型类型',
    component: 'Select',
  },
  {
    fieldName: 'flag',
    label: '模型标志',
    component: 'Input',
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
    fieldName: 'models',
    label: '可用模型',
    component: 'Input',
  },
  {
    fieldName: 'icon',
    label: '模型图标',
    component: 'Input',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Input',
  },
];
