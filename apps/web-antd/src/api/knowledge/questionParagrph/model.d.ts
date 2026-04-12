import type { BaseEntity, PageQuery } from '#/api/common';

export interface QuestionParagraphVO {
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
   * 段落Id
   */
  paragraphId: number;

  /**
   * 问题Id
   */
  questionId: number;

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

export interface QuestionParagraphForm extends BaseEntity {
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
   * 段落Id
   */
  paragraphId?: number;

  /**
   * 问题Id
   */
  questionId?: number;
}

export interface QuestionParagraphQuery extends PageQuery {
  /**
   * 知识库Id
   */
  datasetId?: number;

  /**
   * 文档Id
   */
  documentId?: number;

  /**
   * 段落Id
   */
  paragraphId?: number;

  /**
   * 问题Id
   */
  questionId?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
