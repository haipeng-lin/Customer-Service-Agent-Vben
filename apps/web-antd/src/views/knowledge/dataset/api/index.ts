import type { DatasetForm, DatasetQuery, DatasetVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询知识库列表
 * @param params
 * @returns 知识库列表
 */
export function datasetList(params?: DatasetQuery) {
    return alovaInstance.get<PageResult<DatasetVO>>(
        '/knowledge/dataset/list',
        { params },
    );
}

/**
 * 导出知识库列表
 * @param params
 * @returns void
 */
export function datasetExport(params?: DatasetQuery) {
    return commonExport('/knowledge/dataset/export', params ?? {});
}

/**
 * 查询知识库详情
 * @param id 主键ID
 * @returns 知识库详情
 */
export function datasetInfo(id: ID) {
    return alovaInstance.get<DatasetVO>(`/knowledge/dataset/${id}`);
}

/**
 * 新增知识库
 * @param data
 * @returns void
 */
export function datasetAdd(data: DatasetForm) {
    return alovaInstance.postWithMsg<void>('/knowledge/dataset', data);
}

/**
 * 更新知识库
 * @param data
 * @returns void
 */
export function datasetUpdate(data: DatasetForm) {
    return alovaInstance.putWithMsg<void>('/knowledge/dataset', data);
}

/**
 * 删除知识库
 * @param id 主键ID或ID数组
 * @returns void
 */
export function datasetRemove(id: ID | IDS) {
    return alovaInstance.deleteWithMsg<void>(`/knowledge/dataset/\${id}`);
}
