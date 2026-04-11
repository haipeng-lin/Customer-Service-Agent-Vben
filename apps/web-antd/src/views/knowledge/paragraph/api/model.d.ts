import type { BaseEntity, PageQuery } from '#/api/common';

export interface ParagraphVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 知识库Id
   */
  datasetId: number;

  /**
   * 文档Id
   */
  documentId: number;

  /**
   * 段落标题
   */
  title: string;

  /**
   * 段落内容
   */
  content: string;

  /**
   * 索引状态（0-待索引 1-索引中 2-完成）
   */
  indexStatus: string;

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

export interface ParagraphForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 知识库Id
   */
  datasetId?: number;

  /**
   * 文档Id
   */
  documentId?: number;

  /**
   * 段落标题
   */
  title?: string;

  /**
   * 段落内容
   */
  content?: string;

  /**
   * 索引状态（0-待索引 1-索引中 2-完成）
   */
  indexStatus?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;
}

export interface ParagraphQuery extends PageQuery {
  /**
   * 知识库Id
   */
  datasetId?: number;

  /**
   * 文档Id
   */
  documentId?: number;

  /**
   * 段落标题
   */
  title?: string;

  /**
   * 段落内容
   */
  content?: string;

  /**
   * 索引状态（0-待索引 1-索引中 2-完成）
   */
  indexStatus?: string;

  /**
   * 状态（0-启用 1-禁用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
