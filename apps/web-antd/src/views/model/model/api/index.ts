import type { ModelForm, ModelQuery, ModelVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询模型列表
 * @param params
 * @returns 模型列表
 */
export function modelList(params?: ModelQuery) {
    return alovaInstance.get<PageResult<ModelVO>>(
        '/model/model/list',
        { params },
    );
}

/**
 * 导出模型列表
 * @param params
 * @returns void
 */
export function modelExport(params?: ModelQuery) {
    return commonExport('/model/model/export', params ?? {});
}

/**
 * 查询模型详情
 * @param id 主键ID
 * @returns 模型详情
 */
export function modelInfo(id: ID) {
    return alovaInstance.get<ModelVO>(`/model/model/${id}`);
}

/**
 * 新增模型
 * @param data
 * @returns void
 */
export function modelAdd(data: ModelForm) {
    return alovaInstance.postWithMsg<void>('/model/model', data);
}

/**
 * 更新模型
 * @param data
 * @returns void
 */
export function modelUpdate(data: ModelForm) {
    return alovaInstance.putWithMsg<void>('/model/model', data);
}

/**
 * 删除模型
 * @param id 主键ID或ID数组
 * @returns void
 */
export function modelRemove(id: ID | IDS) {
    return alovaInstance.deleteWithMsg<void>(`/model/model/\${id}`);
}
