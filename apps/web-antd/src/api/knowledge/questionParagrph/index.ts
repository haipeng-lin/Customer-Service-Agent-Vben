import type { QuestionParagraphForm, QuestionParagraphQuery, QuestionParagraphVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询问题段落列表
 * @param params
 * @returns 问题段落列表
 */
export function questionParagraphList(params?: QuestionParagraphQuery) {
  return alovaInstance.get<PageResult<QuestionParagraphVO>>('/knowledge/questionParagraph/list', {
    params,
  });
}

/**
 * 导出问题段落列表
 * @param params
 * @returns void
 */
export function questionParagraphExport(params?: QuestionParagraphQuery) {
  return commonExport('/knowledge/questionParagraph/export', params ?? {});
}

/**
 * 查询问题段落详情
 * @param id 主键ID
 * @returns 问题段落详情
 */
export function questionParagraphInfo(id: ID) {
  return alovaInstance.get<QuestionParagraphVO>(`/knowledge/questionParagraph/${id}`);
}

/**
 * 新增问题段落
 * @param data
 * @returns void
 */
export function questionParagraphAdd(data: QuestionParagraphForm) {
  return alovaInstance.postWithMsg<void>('/knowledge/questionParagraph', data);
}

/**
 * 更新问题段落
 * @param data
 * @returns void
 */
export function questionParagraphUpdate(data: QuestionParagraphForm) {
  return alovaInstance.putWithMsg<void>('/knowledge/questionParagraph', data);
}

/**
 * 删除问题段落
 * @param id 主键ID或ID数组
 * @returns void
 */
export function questionParagraphRemove(id: ID | IDS) {
  return alovaInstance.deleteWithMsg<void>(`/knowledge/questionParagraph/${id}`);
}
