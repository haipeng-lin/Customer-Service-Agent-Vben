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
    fieldName: 'datasetId',
    label: '知识库Id',
    component: 'Input',
  },
  {
    fieldName: 'documentId',
    label: '文档Id',
    component: 'Input',
  },
  {
    fieldName: 'title',
    label: '段落标题',
    component: 'Input',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
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
  { field: 'datasetId', title: '知识库Id' },
  { field: 'documentId', title: '文档Id' },
  { field: 'title', title: '段落标题' },
  { field: 'content', title: '段落内容' },
  {
    field: 'status',
    title: '状态',
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, DictEnum.SYS_NORMAL_DISABLE);
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
    fieldName: 'datasetId',
    label: '知识库Id',
    component: 'Input',
  },
  {
    fieldName: 'documentId',
    label: '文档Id',
    component: 'Input',
  },
  {
    fieldName: 'title',
    label: '段落标题',
    component: 'Input',
  },
  {
    fieldName: 'content',
    label: '段落内容',
    component: 'Input',
  },

];
