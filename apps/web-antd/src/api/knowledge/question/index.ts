import type { QuestionForm, QuestionQuery, QuestionVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询问题列表
 * @param params
 * @returns 问题列表
 */
export function questionList(params?: QuestionQuery) {
  return alovaInstance.get<PageResult<QuestionVO>>('/knowledge/question/list', { params });
}

/**
 * 导出问题列表
 * @param params
 * @returns void
 */
export function questionExport(params?: QuestionQuery) {
  return commonExport('/knowledge/question/export', params ?? {});
}

/**
 * 查询问题详情
 * @param id 主键ID
 * @returns 问题详情
 */
export function questionInfo(id: ID) {
  return alovaInstance.get<QuestionVO>(`/knowledge/question/${id}`);
}

/**
 * 新增问题
 * @param data
 * @returns void
 */
export function questionAdd(data: QuestionForm) {
  return alovaInstance.postWithMsg<void>('/knowledge/question', data);
}

/**
 * 更新问题
 * @param data
 * @returns void
 */
export function questionUpdate(data: QuestionForm) {
  return alovaInstance.putWithMsg<void>('/knowledge/question', data);
}

/**
 * 删除问题
 * @param id 主键ID或ID数组
 * @returns void
 */
export function questionRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/knowledge/question/${id}`);
}
