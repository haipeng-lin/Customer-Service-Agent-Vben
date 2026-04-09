import type { BaseEntity, PageQuery } from '#/api/common';

export interface ModelVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 模型名称
   */
  name: string;

  /**
   * 模型类型（0-语言 1-向量 2-重排）
   */
  type: string;

  /**
   * 模型标志
   */
  flag: string;

  /**
   * 模型地址
   */
  address: string;

  /**
   * 模型key
   */
  key: string;

  /**
   * 可用模型
   */
  models: string;

  /**
   * 模型图标
   */
  icon: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status: string;

  /**
   * 租户Id
   */
  tenantId: string;

  /**
   * 创建部门
   */
  createDept: number;

  /**
   * 创建人
   */
  createBy: number;
}

export interface ModelForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 模型名称
   */
  name?: string;

  /**
   * 模型类型（0-语言 1-向量 2-重排）
   */
  type?: string;

  /**
   * 模型标志
   */
  flag?: string;

  /**
   * 模型地址
   */
  address?: string;

  /**
   * 模型key
   */
  key?: string;

  /**
   * 可用模型
   */
  models?: string;

  /**
   * 模型图标
   */
  icon?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;

  /**
   * 租户Id
   */
  tenantId?: string;

  /**
   * 创建部门
   */
  createDept?: number;

  /**
   * 创建人
   */
  createBy?: number;
}

export interface ModelQuery extends PageQuery {
  /**
   * 模型名称
   */
  name?: string;

  /**
   * 模型类型（0-语言 1-向量 2-重排）
   */
  type?: string;

  /**
   * 模型标志
   */
  flag?: string;

  /**
   * 模型地址
   */
  address?: string;

  /**
   * 模型key
   */
  key?: string;

  /**
   * 可用模型
   */
  models?: string;

  /**
   * 模型图标
   */
  icon?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;

  /**
   * 修改部门
   */
  updateDept?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
