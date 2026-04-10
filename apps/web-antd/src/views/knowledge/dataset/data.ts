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
                fieldName: 'embeddingModelId',
                label: '向量模型Id',
                    component: 'Input',
            },
            {
                fieldName: 'embeddingModelName',
                label: '向量模型名称',
                    component: 'Input',
            },
            {
                fieldName: 'title',
                label: '标题',
                    component: 'Input',
            },
            {
                fieldName: 'description',
                label: '描述',
                    component: 'Input',
            },
            {
                fieldName: 'status',
                label: '状态（0-启用 1-禁用）',
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
                { field: 'embeddingModelId', title: '向量模型Id' },
                { field: 'embeddingModelName', title: '向量模型名称' },
                { field: 'title', title: '标题' },
                { field: 'description', title: '描述' },
                {
                    field: 'status',
                    title: '状态（0-启用 1-禁用）',
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
                fieldName: 'embeddingModelId',
                label: '向量模型Id',
                    component: 'Input',
            },
            {
                fieldName: 'embeddingModelName',
                label: '向量模型名称',
                    component: 'Input',
            },
            {
                fieldName: 'title',
                label: '标题',
                    component: 'Input',
            },
            {
                fieldName: 'description',
                label: '描述',
                    component: 'Input',
            },
            {
                fieldName: 'status',
                label: '状态（0-启用 1-禁用）',
                    component: 'Select',
                    componentProps: {
                        getPopupContainer,
                        options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
                    },
            },
];
