import type { VbenFormSchema } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { h } from 'vue';
import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';
import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

import { datasetListAll } from '#/api/knowledge/dataset/index';

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
  }
];

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50 },
  { field: 'id', title: 'Id', width: 180 },
  { field: 'datasetId', title: '知识库Id' },
  { field: 'content', title: '内容' },
  { field: 'hitNum', title: '命中次数' },
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
    fieldName: 'content',
    label: '内容',
    component: 'Input',
  },
  {
    fieldName: 'hitNum',
    label: '命中次数',
    component: 'Input',
  },
];
