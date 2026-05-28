import type { AppAppraise, AppApplicationChat, AppChatMessageVo, AppChatSessionForm } from './model';
import type { ID } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 开启会话
 * @param data
 * @returns 会话Id
 */
export function startSession(data: AppChatSessionForm) {
  return alovaInstance.post<number>('/api/v1/chat/startSession', data);
}

/**
 * 获取对话日志
 * @param sessionId 会话Id
 * @returns 聊天消息列表
 */
export function listChatLog(sessionId: ID) {
  return alovaInstance.get<AppChatMessageVo[]>('/api/v1/chat/listChatLog', {
    params: { sessionId },
  });
}

/**
 * 应用聊天
 * @param data
 * @returns SseEmitter
 */
export function sseChat(data: AppApplicationChat) {
  return alovaInstance.post<any>('/api/v1/chat/sseChat', data);
}

/**
 * 评价对话
 * @param data
 * @returns void
 */
export function appraise(data: AppAppraise) {
  return alovaInstance.postWithMsg<void>('/api/v1/chat/appraise', data);
}