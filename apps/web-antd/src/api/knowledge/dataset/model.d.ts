import type { BaseEntity, PageQuery } from '#/api/common';

export interface DatasetVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 向量模型Id
   */
  embeddingModelId: number;

  /**
   * 向量模型名称
   */
  embeddingModelName: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;

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

export interface DatasetForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 向量模型Id
   */
  embeddingModelId?: number;

  /**
   * 向量模型名称
   */
  embeddingModelName?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;
}

export interface DatasetQuery extends PageQuery {
  /**
   * 向量模型Id
   */
  embeddingModelId?: number;

  /**
   * 向量模型名称
   */
  embeddingModelName?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
