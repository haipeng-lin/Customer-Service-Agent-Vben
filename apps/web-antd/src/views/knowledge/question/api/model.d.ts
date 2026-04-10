import type { BaseEntity, PageQuery } from '#/api/common';

export interface QuestionVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 知识库Id
   */
  datasetId: number;

  /**
   * 内容
   */
  content: string;

  /**
   * 命中次数
   */
  hitNum: number;

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
  createTime: ${ column.tsType };

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
updateTime: ${ column.tsType };

}

export interface QuestionForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 知识库Id
   */
  datasetId?: number;

  /**
   * 内容
   */
  content?: string;

  /**
   * 命中次数
   */
  hitNum?: number;

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

  /**
   * 创建时间
   */
  createTime?: ${ column.tsType };

/**
 * 修改部门
 */
updateDept ?: number;

/**
 * 修改人
 */
updateBy ?: number;

/**
 * 修改时间
 */
updateTime ?: ${ column.tsType };

}

export interface QuestionQuery extends PageQuery {
  /**
   * 知识库Id
   */
  datasetId?: number;

  /**
   * 内容
   */
  content?: string;

  /**
   * 命中次数
   */
  hitNum?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
