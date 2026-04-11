import type { DocumentForm, DocumentQuery, DocumentVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询文档列表
 * @param params
 * @returns 文档列表
 */
export function documentList(params?: DocumentQuery) {
  return alovaInstance.get<PageResult<DocumentVO>>(
    '/knowledge/document/list',
    { params },
  );
}

/**
 * 导出文档列表
 * @param params
 * @returns void
 */
export function documentExport(params?: DocumentQuery) {
  return commonExport('/knowledge/document/export', params ?? {});
}

/**
 * 查询文档详情
 * @param id 主键ID
 * @returns 文档详情
 */
export function documentInfo(id: ID) {
  return alovaInstance.get<DocumentVO>(`/knowledge/document/${id}`);
}

/**
 * 新增文档
 * @param data
 * @returns void
 */
export function documentAdd(data: DocumentForm) {
  return alovaInstance.postWithMsg<void>('/knowledge/document', data);
}

/**
 * 更新文档
 * @param data
 * @returns void
 */
export function documentUpdate(data: DocumentForm) {
  return alovaInstance.putWithMsg<void>('/knowledge/document', data);
}

/**
 * 删除文档
 * @param id 主键ID或ID数组
 * @returns void
 */
export function documentRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/knowledge/document/\${id}`);
}

/**
 * 更新文档状态
 * @param data data
 * @returns void
 */
export function documentStatusChange(data: Partial<DocumentForm>) {
  const requestData = {
    id: data.id,
    status: data.status,
  };
  return alovaInstance.putWithMsg<void>(
    '/knowledge/document/changeStatus',
    requestData,
  );
}

/**
 * 查询文档全部
 * @param params
 * @returns 文档全部列表
 */
export function documentListAll(params?: DocumentQuery) {
  return alovaInstance.get<DocumentVO[]>(
    '/knowledge/document/listAll',
    { params },
  );
}