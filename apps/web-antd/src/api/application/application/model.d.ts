import type { BaseEntity, PageQuery } from '#/api/common';

export interface ApplicationVO {
  /**
   * Id
   */
  id: number | string;

  /**
   * 应用名称
   */
  name: string;

  /**
   * 应用描述
   */
  description: string;

  /**
   * 应用头像
   */
  icon: string;

  /**
   * 模型Id
   */
  modelId: string;

  /**
   * 模型名称
   */
  modelName: string;

  /**
   * 提示词
   */
  prompt: string;

  /**
   * 是否关联知识库
   */
  isRelateDataset: string;

  /**
   * 开场白标题
   */
  prologueTitle: string;

  /**
   * 开场白问题
   */
  prologueQuestion: string;

  /**
   * 检索模式
   */
  searchMode: string;

  /**
   * 相似度
   */
  similarity: number;

  /**
   * 召回数量
   */
  topRank: number;

  /**
   * 重排索引模型
   */
  rerankModelId: number;

  /**
   * 记忆条数
   */
  memoryNum: number;

  /**
   * 回复上限
   */
  maxReplyToken: number;

  /**
   * 温度
   */
  temperature: number;

  /**
   * 是否显示引用
   */
  isShowRelation: string;

  /**
   * 是否显示时间
   */
  isShowTime: string;

  /**
   * 是否显示token
   */
  isShowToken: string;

  /**
   * 是否显示评价
   */
  isShowAppraise: string;

  /**
   * 状态（0-待发布 1-已发布）
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
   * 修改部门
   */
  updateDept: number;

  /**
   * 修改人
   */
  updateBy: number;



}

export interface ApplicationForm extends BaseEntity {
  /**
   * Id
   */
  id?: number | string;

  /**
   * 应用名称
   */
  name?: string;

  /**
   * 应用描述
   */
  description?: string;

  /**
   * 应用头像
   */
  icon?: string;

  /**
   * 模型Id
   */
  modelId?: string;

  /**
   * 模型名称
   */
  modelName?: string;

  /**
   * 提示词
   */
  prompt?: string;

  /**
   * 是否关联知识库
   */
  isRelateDataset?: string;

  /**
   * 开场白标题
   */
  prologueTitle?: string;

  /**
   * 开场白问题
   */
  prologueQuestion?: string;

  /**
   * 检索模式
   */
  searchMode?: string;

  /**
   * 相似度
   */
  similarity?: number;

  /**
   * 召回数量
   */
  topRank?: number;

  /**
   * 重排索引模型
   */
  rerankModelId?: number;

  /**
   * 记忆条数
   */
  memoryNum?: number;

  /**
   * 回复上限
   */
  maxReplyToken?: number;

  /**
   * 温度
   */
  temperature?: number;

  /**
   * 是否显示引用
   */
  isShowRelation?: string;

  /**
   * 是否显示时间
   */
  isShowTime?: string;

  /**
   * 是否显示token
   */
  isShowToken?: string;

  /**
   * 是否显示评价
   */
  isShowAppraise?: string;

  /**
   * 状态（0-待发布 1-已发布）
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

}

export interface ApplicationQuery extends PageQuery {
  /**
   * 应用名称
   */
  name?: string;

  /**
   * 模型Id
   */
  modelId?: string;

  /**
   * 模型名称
   */
  modelName?: string;

  /**
   * 是否关联知识库
   */
  isRelateDataset?: string;

  /**
   * 检索模式
   */
  searchMode?: string;

  /**
   * 重排索引模型
   */
  rerankModelId?: number;

  /**
   * 是否显示引用
   */
  isShowRelation?: string;

  /**
   * 是否显示时间
   */
  isShowTime?: string;

  /**
   * 是否显示token
   */
  isShowToken?: string;

  /**
   * 是否显示评价
   */
  isShowAppraise?: string;

  /**
   * 状态（0-待发布 1-已发布）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
