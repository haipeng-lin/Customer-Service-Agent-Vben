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

/**
 * 表格列配置
 */
export const columns: VxeGridProps['columns'] = [
    { type: 'checkbox', width: 50 },
                { field: 'id', title: 'Id', width: 100 },
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
                label: '知识库Id',
                    component: 'Input',
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
