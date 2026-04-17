import type { ChatSessionForm, ChatSessionQuery, ChatSessionVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询对话会话列表
 * @param params
 * @returns 对话会话列表
 */
export function chatSessionList(params?: ChatSessionQuery) {
  return alovaInstance.get<PageResult<ChatSessionVO>>('/application/chatSession/list', { params });
}

/**
 * 导出对话会话列表
 * @param params
 * @returns void
 */
export function chatSessionExport(params?: ChatSessionQuery) {
  return commonExport('/application/chatSession/export', params ?? {});
}

/**
 * 查询对话会话详情
 * @param id 主键ID
 * @returns 对话会话详情
 */
export function chatSessionInfo(id: ID) {
  return alovaInstance.get<ChatSessionVO>(`/application/chatSession/${id}`);
}

/**
 * 新增对话会话
 * @param data
 * @returns void
 */
export function chatSessionAdd(data: ChatSessionForm) {
  return alovaInstance.postWithMsg<void>('/application/chatSession', data);
}

/**
 * 更新对话会话
 * @param data
 * @returns void
 */
export function chatSessionUpdate(data: ChatSessionForm) {
  return alovaInstance.putWithMsg<void>('/application/chatSession', data);
}

/**
 * 删除对话会话
 * @param id 主键ID或ID数组
 * @returns void
 */
export function chatSessionRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/application/chatSession/${id}`);
}
