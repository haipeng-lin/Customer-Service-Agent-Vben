import type { ParagraphForm, ParagraphQuery, ParagraphVO } from './model';
import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { alovaInstance } from '#/utils/http';

/**
 * 查询段落列表
 * @param params
 * @returns 段落列表
 */
export function paragraphList(params?: ParagraphQuery) {
    return alovaInstance.get<PageResult<ParagraphVO>>(
        '/knowledge/paragraph/list',
        { params },
    );
}

/**
 * 导出段落列表
 * @param params
 * @returns void
 */
export function paragraphExport(params?: ParagraphQuery) {
    return commonExport('/knowledge/paragraph/export', params ?? {});
}

/**
 * 查询段落详情
 * @param id 主键ID
 * @returns 段落详情
 */
export function paragraphInfo(id: ID) {
    return alovaInstance.get<ParagraphVO>(`/knowledge/paragraph/${id}`);
}

/**
 * 新增段落
 * @param data
 * @returns void
 */
export function paragraphAdd(data: ParagraphForm) {
    return alovaInstance.postWithMsg<void>('/knowledge/paragraph', data);
}

/**
 * 更新段落
 * @param data
 * @returns void
 */
export function paragraphUpdate(data: ParagraphForm) {
    return alovaInstance.putWithMsg<void>('/knowledge/paragraph', data);
}

/**
 * 删除段落
 * @param id 主键ID或ID数组
 * @returns void
 */
export function paragraphRemove(id: ID | IDS) {
    return alovaInstance.deleteWithMsg<void>(`/knowledge/paragraph/\${id}`);
}

/**
 * 更新段落状态
 * @param data data
 * @returns void
 */
export function paragraphStatusChange(data: Partial<ParagraphForm>) {
    const requestData = {
        id: data.id,
        status: data.status,
    };
    return alovaInstance.putWithMsg<void>(
        '/knowledge/paragraph/changeStatus',
        requestData,
    );
}

/**
 * 查询段落全部
 * @param params
 * @returns 段落全部列表
 */
export function paragraphListAll(params?: ParagraphQuery) {
    return alovaInstance.get<ParagraphVO[]>(
        '/knowledge/paragraph/listAll',
        { params },
    );
}
