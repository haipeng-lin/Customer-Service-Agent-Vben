<script setup lang="ts">
    import type { VbenFormProps } from '@vben/common-ui';
    import type { Recordable } from '@vben/types';
    import type { VxeGridProps } from '#/adapter/vxe-table';

    import { ref } from 'vue';

    import { Page, useVbenModal } from '@vben/common-ui';
    import { getPopupContainer } from '@vben/utils';
    import { Popconfirm, Space } from 'antdv-next';

    import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';

    import { datasetList, datasetRemove } from './api';
    import { columns, querySchema } from './data';

    import DatasetModal from './dataset-modal.vue';

    const formOptions: VbenFormProps = {
        commonConfig: {
            labelWidth: 80,
        },
        schema: querySchema(),
        wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    const gridOptions: VxeGridProps = {
        checkboxConfig: {
            highlight: true,
            reserve: true,
        },
        columns,
        height: 'auto',
        keepSource: true,
        pagerConfig: {},
        proxyConfig: {
            ajax: {
                query: async ({ page }, formValues = {}) => {
                    return await datasetList({
                        pageNum: page.currentPage,
                        pageSize: page.pageSize,
                        ...formValues,
                    });
                },
            },
        },
        rowConfig: {
            isHover: true,
            keyField: 'id',
        },
    };

    const checked = ref(false);
    const [BasicTable, tableApi] = useVbenVxeGrid({
        formOptions,
        gridOptions,
    });

    const [FormModal, modalApi] = useVbenModal({
        connectedComponent: DatasetModal,
    });

    function handleAdd() {
        modalApi.setData({});
        modalApi.open();
    }

    async function handleEdit(record: Recordable<any>) {
        modalApi.setData({ id: record.id });
        modalApi.open();
    }

    async function handleDelete(row: Recordable<any>) {
        await datasetRemove(row.id);
        await tableApi.query();
    }

    function handleMultiDelete() {
        const rows = tableApi.grid.getCheckboxRecords();
        const ids = rows.map((row: any) => row.id);
        // 使用示例中的 window.modal.confirm
        window.modal.confirm({
            title: '提示',
            okType: 'danger',
            content: `确认删除选中的\${ids.length}条记录吗？`,
            onOk: async () => {
                await datasetRemove(ids);
                await tableApi.query();
                checked.value = false;
            },
        });
    }
</script>

<template>
    <Page :auto-content-height="true">
        <BasicTable>
            <template #toolbar-actions>
                <span class="pl-[7px] text-[16px]">知识库列表</span>
            </template>
            <template #toolbar-tools>
                <Space>
                    <a-button
                        :disabled="!vxeCheckboxChecked(tableApi)"
                        danger
                        type="primary"
                        v-access:code="['knowledge:dataset:remove']"
                        @click="handleMultiDelete"
                    >
                        {{ $t('pages.common.delete') }}
                    </a-button>
                    <a-button
                        type="primary"
                        v-access:code="['knowledge:dataset:add']"
                        @click="handleAdd"
                    >
                        {{ $t('pages.common.add') }}
                    </a-button>
                </Space>
            </template>
            <template #action="{ row }">
                <Space>
                    <action-button
                        v-access:code="['knowledge:dataset:edit']"
                        @click.stop="handleEdit(row)"
                    >
                        {{ $t('pages.common.edit') }}
                    </action-button>
                    <Popconfirm
                        :get-popup-container="getPopupContainer"
                        placement="left"
                        title="确认删除？"
                        @confirm="handleDelete(row)"
                    >
                        <action-button
                            danger
                            v-access:code="['knowledge:dataset:remove']"
                            @click.stop=""
                        >
                            {{ $t('pages.common.delete') }}
                        </action-button>
                    </Popconfirm>
                </Space>
            </template>
        </BasicTable>
        <FormModal @reload="tableApi.query()" />
    </Page>
</template>
