import type { ModelTokenForm, ModelTokenQuery, ModelTokenVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询模型token列表
 * @param params
 * @returns 模型token列表
 */
export function modelTokenList(params?: ModelTokenQuery) {
  return alovaInstance.get<PageResult<ModelTokenVO>>(
    '/model/modelToken/list',
    { params },
  );
}

/**
 * 导出模型token列表
 * @param params
 * @returns void
 */
export function modelTokenExport(params?: ModelTokenQuery) {
  return commonExport('/model/modelToken/export', params ?? {});
}

/**
 * 查询模型token详情
 * @param id 主键ID
 * @returns 模型token详情
 */
export function modelTokenInfo(id: ID) {
  return alovaInstance.get<ModelTokenVO>(`/model/modelToken/${id}`);
}

/**
 * 新增模型token
 * @param data
 * @returns void
 */
export function modelTokenAdd(data: ModelTokenForm) {
  return alovaInstance.postWithMsg<void>('/model/modelToken', data);
}

/**
 * 更新模型token
 * @param data
 * @returns void
 */
export function modelTokenUpdate(data: ModelTokenForm) {
  return alovaInstance.putWithMsg<void>('/model/modelToken', data);
}

/**
 * 删除模型token
 * @param id 主键ID或ID数组
 * @returns void
 */
export function modelTokenRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/model/modelToken/\${id}`);
}
