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
    fieldName: 'name',
    label: '应用名称',
    component: 'Input',
  },
  {
    fieldName: 'modelId',
    label: '模型Id',
    component: 'Input',
  },
  {
    fieldName: 'modelName',
    label: '模型名称',
    component: 'Input',
  },
  {
    fieldName: 'isRelateDataset',
    label: '是否关联知识库',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
      allowClear: true,
    },
  },
  {
    fieldName: 'searchMode',
    label: '检索模式',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SEARCH_TYPE),
      allowClear: true,
    },
  },
  {
    fieldName: 'rerankModelId',
    label: '重排索引模型',
    component: 'Input',
  },
  {
    fieldName: 'isShowRelation',
    label: '是否显示引用',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
      allowClear: true,
    },
  },
  {
    fieldName: 'isShowTime',
    label: '是否显示时间',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
      allowClear: true,
    },
  },
  {
    fieldName: 'isShowToken',
    label: '是否显示token',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
      allowClear: true,
    },
  },
  {
    fieldName: 'isShowAppraise',
    label: '是否显示评价',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.KB_APPLICATION_TYPE),
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
  { field: 'name', title: '应用名称' },
  { field: 'description', title: '应用描述' },
  { field: 'icon', title: '应用头像' },
  { field: 'modelId', title: '模型Id' },
  { field: 'modelName', title: '模型名称' },
  { field: 'prompt', title: '提示词' },
  {
    field: 'isRelateDataset',
    title: '是否关联知识库',
    slots: {
      default: ({ row }) => {
        return renderDict(row.isRelateDataset, DictEnum.SYS_COMMON_YES_NO);
      },
    },
  },
  { field: 'prologueTitle', title: '开场白标题' },
  { field: 'prologueQuestion', title: '开场白问题' },
  {
    field: 'searchMode',
    title: '检索模式',
    slots: {
      default: ({ row }) => {
        return renderDict(row.searchMode, DictEnum.APP_SEARCH_TYPE);
      },
    },
  },
  { field: 'similarity', title: '相似度' },
  { field: 'topRank', title: '召回数量' },
  { field: 'rerankModelId', title: '重排索引模型' },
  { field: 'memoryNum', title: '记忆条数' },
  { field: 'maxReplyToken', title: '回复上限' },
  { field: 'temperature', title: '温度' },
  {
    field: 'isShowRelation',
    title: '是否显示引用',
    slots: {
      default: ({ row }) => {
        return renderDict(row.isShowRelation, DictEnum.SYS_COMMON_YES_NO);
      },
    },
  },
  {
    field: 'isShowTime',
    title: '是否显示时间',
    slots: {
      default: ({ row }) => {
        return renderDict(row.isShowTime, DictEnum.SYS_COMMON_YES_NO);
      },
    },
  },
  {
    field: 'isShowToken',
    title: '是否显示token',
    slots: {
      default: ({ row }) => {
        return renderDict(row.isShowToken, DictEnum.SYS_COMMON_YES_NO);
      },
    },
  },
  {
    field: 'isShowAppraise',
    title: '是否显示评价',
    slots: {
      default: ({ row }) => {
        return renderDict(row.isShowAppraise, DictEnum.SYS_COMMON_YES_NO);
      },
    },
  },
  {
    field: 'status',
    title: '状态',
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, DictEnum.KB_APPLICATION_TYPE);
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
    fieldName: 'name',
    label: '应用名称',
    component: 'Input',
  },
  {
    fieldName: 'description',
    label: '应用描述',
    component: 'Input',
  },
  {
    fieldName: 'icon',
    label: '应用头像',
    component: 'Input',
  },
  {
    fieldName: 'modelId',
    label: '模型Id',
    component: 'Input',
  },
  {
    fieldName: 'modelName',
    label: '模型名称',
    component: 'Input',
  },
  {
    fieldName: 'prompt',
    label: '提示词',
    component: 'Input',
  },
  {
    fieldName: 'isRelateDataset',
    label: '是否关联知识库',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
    },
  },
  {
    fieldName: 'prologueTitle',
    label: '开场白标题',
    component: 'Input',
  },
  {
    fieldName: 'prologueQuestion',
    label: '开场白问题',
    component: 'Input',
    componentProps: {
      type: 'textarea',
    },
  },
  {
    fieldName: 'searchMode',
    label: '检索模式',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.APP_SEARCH_TYPE),
    },
  },
  {
    fieldName: 'similarity',
    label: '相似度',
    component: 'Input',
  },
  {
    fieldName: 'topRank',
    label: '召回数量',
    component: 'Input',
  },
  {
    fieldName: 'rerankModelId',
    label: '重排索引模型',
    component: 'Input',
  },
  {
    fieldName: 'memoryNum',
    label: '记忆条数',
    component: 'Input',
  },
  {
    fieldName: 'maxReplyToken',
    label: '回复上限',
    component: 'Input',
  },
  {
    fieldName: 'temperature',
    label: '温度',
    component: 'Input',
  },
  {
    fieldName: 'isShowRelation',
    label: '是否显示引用',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
    },
  },
  {
    fieldName: 'isShowTime',
    label: '是否显示时间',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
    },
  },
  {
    fieldName: 'isShowToken',
    label: '是否显示token',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
    },
  },
  {
    fieldName: 'isShowAppraise',
    label: '是否显示评价',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_COMMON_YES_NO),
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.KB_APPLICATION_TYPE),
    },
  },
];
