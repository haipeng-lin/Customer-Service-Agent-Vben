import type { BaseEntity, PageQuery } from '#/api/common';

/**
 * 会话信息
 */
export interface AppChatSessionVO {
  /**
   * Id
   */
  id: number;

  /**
   * 用户Id
   */
  userId: number;

  /**
   * 应用Id
   */
  applicationId: number;

  /**
   * 标题
   */
  title: string;

  /**
   * 来源（0-网页 1-APP）
   */
  source: string;

  /**
   * 状态（0-AI 1-人工 2-结束）
   */
  status: string;

  /**
   * 更新者
   */
  updateBy: number;

  /**
   * 更新时间
   */
  updateTime: string;
}

export interface AppChatSessionForm extends BaseEntity {
  /**
   * Id
   */
  id?: string;

  /**
   * 用户Id
   */
  userId?: number;

  /**
   * 应用Id
   */
  applicationId?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 来源（0-网页 1-APP）
   */
  source?: string;

  /**
   * 状态（0-AI 1-人工 2-结束）
   */
  status?: string;
}

/**
 * 聊天消息
 */
export interface AppChatMessageVo {
  /**
   * Id
   */
  id: number;

  /**
   * 用户Id
   */
  userId: number;

  /**
   * 应用Id
   */
  applicationId: number;

  /**
   * 会话Id
   */
  sessionId: number;

  /**
   * 角色（user、agent）
   */
  role: string;

  /**
   * 内容
   */
  content: string;

  /**
   * 消耗Token
   */
  token: number;

  /**
   * 耗时（毫秒）
   */
  latencyMs: number;

  /**
   * 评价（0-未评价 1-赞 2-踩）
   */
  feedback: string;

  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 应用聊天
 */
export interface AppApplicationChat {
  /**
   * 会话Id
   */
  sessionId: string;

  /**
   * 应用Id
   */
  applicationId: string;

  /**
   * 用户输入内容
   */
  content: string;

  /**
   * 知识库列表
   */
  datasetList?: any[];

  /**
   * 运行时上下文id
   */
  contextId?: number;

  /**
   * 运行节点id
   */
  cell?: string;
}

/**
 * 评价对话
 */
export interface AppAppraise {
  /**
   * 消息Id
   */
  messageId: string;

  /**
   * 评价类型（1-赞 2-踩）
   */
  feedback: string;
}
