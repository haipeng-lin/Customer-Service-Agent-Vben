import type { ApplicationForm, ApplicationQuery, ApplicationVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询应用列表
 * @param params
 * @returns 应用列表
 */
export function applicationList(params?: ApplicationQuery) {
  return alovaInstance.get<PageResult<ApplicationVO>>('/application/application/list', { params });
}

/**
 * 导出应用列表
 * @param params
 * @returns void
 */
export function applicationExport(params?: ApplicationQuery) {
  return commonExport('/application/application/export', params ?? {});
}

/**
 * 查询应用详情
 * @param id 主键ID
 * @returns 应用详情
 */
export function applicationInfo(id: ID) {
  return alovaInstance.get<ApplicationVO>(`/application/application/${id}`);
}

/**
 * 新增应用
 * @param data
 * @returns void
 */
export function applicationAdd(data: ApplicationForm) {
  return alovaInstance.postWithMsg<void>('/application/application', data);
}

/**
 * 更新应用
 * @param data
 * @returns void
 */
export function applicationUpdate(data: ApplicationForm) {
  return alovaInstance.putWithMsg<void>('/application/application', data);
}

/**
 * 删除应用
 * @param id 主键ID或ID数组
 * @returns void
 */
export function applicationRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/application/application/${id}`);
}
