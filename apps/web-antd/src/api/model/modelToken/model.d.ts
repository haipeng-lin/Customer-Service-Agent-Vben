import type { BaseEntity, PageQuery } from '#/api/common';

export interface ModelTokenVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 模型Id
   */
  modelId: number;

  /**
   * 消耗来源（0-网页 1-APP）
   */
  source: string;

  /**
   * 输入token数
   */
  inputToken: number;

  /**
   * 输出token数
   */
  outputToken: number;

  /**
   * 消耗总token
   */
  totalToken: number;

  /**
   * 租户Id
   */
  tenantId: string;

  /**
   * 用户Id
   */
  userId: number;

  /**
   * 应用Id
   */
  applicationId: number;

  /**
   * 消息Id
   */
  messageId: number;

  /**
   * 创建部门
   */
  createDept: number;

  /**
   * 创建人
   */
  createBy: number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改部门
   */
  updateDept: number;

  /**
   * 修改人
   */
  updateBy: number;

  /**
   * 修改时间
   */
  updateTime: string;

}

export interface ModelTokenForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 模型Id
   */
  modelId?: number;

  /**
   * 消耗来源（0-网页 1-APP）
   */
  source?: string;

  /**
   * 输入token数
   */
  inputToken?: number;

  /**
   * 输出token数
   */
  outputToken?: number;

  /**
   * 消耗总token
   */
  totalToken?: number;

  /**
   * 租户Id
   */
  tenantId?: string;

  /**
   * 用户Id
   */
  userId?: number;

  /**
   * 应用Id
   */
  applicationId?: number;

  /**
   * 消息Id
   */
  messageId?: number;

  /**
   * 创建部门
   */
  createDept?: number;

  /**
   * 创建人
   */
  createBy?: number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 修改部门
   */
  updateDept?: string;

  /**
   * 修改人
   */
  updateBy?: string;

  /**
   * 修改时间
   */
  updateTime?: string;

}

export interface ModelTokenQuery extends PageQuery {
  /**
   * 模型Id
   */
  modelId?: number;

  /**
   * 消耗来源（0-网页 1-APP）
   */
  source?: string;

  /**
   * 用户Id
   */
  userId?: number;

  /**
   * 应用Id
   */
  applicationId?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
