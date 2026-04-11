import type { VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { h } from 'vue';
import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';
import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

import { datasetListAll } from './../dataset/api/index';

/**
 * 搜索表单配置
 */
export const querySchema = (): VbenFormSchema[] => [
  {
    fieldName: 'datasetId',
    label: '知识库',
    component: 'ApiSelect',
    componentProps: {
      allowClear: true,
      api: datasetListAll,
      afterFetch: (data: { title: string; id: number }[]) => {
        return data.map((item: any) => ({
          label: item.title,
          value: item.id,
        }));
      },
    },
  },
  {
    fieldName: 'type',
    label: '类型',
    component: 'Input',
  },
  {
    fieldName: 'title',
    label: '文档标题',
    component: 'Input',
  },
  {
    fieldName: 'embeddingStatus',
    label: '向量状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.KB_EMBEDDING_STATUS),
      allowClear: true,
    },
  },

  {
    fieldName: 'questionStatus',
    label: '问题状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.KB_QUESTION_STATUS),
      allowClear: true,
    },
  },
  {
    fieldName: 'answerType',
    label: '命中处理方式',
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
  { field: 'type', title: '类型' },
  { field: 'title', title: '文档标题' },
  { field: 'content', title: '文档内容' },
  { field: 'fileSize', title: '文件大小（MB）' },
  { field: 'segmentCount', title: '分段数' },
  {
    field: 'embeddingStatus',
    title: '向量状态',
    slots: {
      default: ({ row }) => {
        return renderDict(row.embeddingStatus, DictEnum.KB_EMBEDDING_STATUS);
      },
    },
  },
  { field: 'embeddingTime', title: '向量时间' },
  {
    field: 'questionStatus',
    title: '问题状态',
    slots: {
      default: ({ row }) => {
        return renderDict(row.questionStatus, DictEnum.KB_QUESTION_STATUS);
      },
    },
  },
  { field: 'questionTime', title: '生成问题时间' },
  { field: 'answerType', title: '命中处理方式' },
  { field: 'redirectSimilar', title: '返回相似度' },
  {
    field: 'status',
    title: '状态',
    slots: { default: 'status' },
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
    label: '知识库',
    component: 'ApiSelect',
    componentProps: {
      allowClear: true,
      api: datasetListAll,
      afterFetch: (data: { title: string; id: number }[]) => {
        return data.map((item: any) => ({
          label: item.title,
          value: item.id,
        }));
      },
    },
  },
  {
    fieldName: 'type',
    label: '类型',
    component: 'Input',
  },
  {
    fieldName: 'title',
    label: '文档标题',
    component: 'Input',
  },
  {
    fieldName: 'content',
    label: '文档内容',
    component: 'Input',
  },
  {
    fieldName: 'answerType',
    label: '命中处理方式',
    component: 'Input',
  },
  {
    fieldName: 'redirectSimilar',
    label: '返回相似度',
    component: 'Input',
  },
];
