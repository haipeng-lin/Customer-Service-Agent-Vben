import type { ChatMessageForm, ChatMessageQuery, ChatMessageVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询对话消息列表
 * @param params
 * @returns 对话消息列表
 */
export function chatMessageList(params?: ChatMessageQuery) {
  return alovaInstance.get<PageResult<ChatMessageVO>>('/application/chatMessage/list', { params });
}

/**
 * 导出对话消息列表
 * @param params
 * @returns void
 */
export function chatMessageExport(params?: ChatMessageQuery) {
  return commonExport('/application/chatMessage/export', params ?? {});
}

/**
 * 查询对话消息详情
 * @param id 主键ID
 * @returns 对话消息详情
 */
export function chatMessageInfo(id: ID) {
  return alovaInstance.get<ChatMessageVO>(`/application/chatMessage/${id}`);
}

/**
 * 新增对话消息
 * @param data
 * @returns void
 */
export function chatMessageAdd(data: ChatMessageForm) {
  return alovaInstance.postWithMsg<void>('/application/chatMessage', data);
}

/**
 * 更新对话消息
 * @param data
 * @returns void
 */
export function chatMessageUpdate(data: ChatMessageForm) {
  return alovaInstance.putWithMsg<void>('/application/chatMessage', data);
}

/**
 * 删除对话消息
 * @param id 主键ID或ID数组
 * @returns void
 */
export function chatMessageRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/application/chatMessage/${id}`);
}
