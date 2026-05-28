import { alovaInstance } from '#/utils/http';

/**
 * 向量化文档
 * @param documentIds 文档ID，多个用逗号分隔
 * @returns void
 */
export function embeddingDocument(documentIds: string) {
  return alovaInstance.postWithMsg<void>('/api/v1/application/embeddingDocument', undefined, {
    params: { documentIds },
  });
}

/**
 * 向量化知识库
 * @param datasetId 知识库ID
 * @returns void
 */
export function embeddingDatasetId(datasetId: number | string) {
  return alovaInstance.postWithMsg<void>('/api/v1/application/embeddingDatasetId', undefined, {
    params: { datasetId },
  });
}

/**
 * 预览文档
 * @param data FormData
 * @returns 文档预览结果
 */
export function previewDocument(data: FormData) {
  return alovaInstance.post<any[]>('/api/v1/application/previewDocument', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 保存文档
 * @param data
 * @returns void
 */
export function saveDocument(data: Record<string, unknown>) {
  return alovaInstance.postWithMsg<void>('/api/v1/application/saveDocument', data);
}

/**
 * 命中测试
 * @param data
 * @returns 搜索结果列表
 */
export function hitTest(data: {
  datasetIds: number | string;
  question?: string;
  searchType?: string;
  similarity?: number;
  topRank?: number;
}) {
  return alovaInstance.post<any[]>('/api/v1/application/hitTest', data);
}

/**
 * 生成问题
 * @param data
 * @returns void
 */
export function generateQuestion(data: {
  datasetId: number | string;
  documentIds?: string;
  modelId?: string;
  prompt?: string;
  questionNum?: number;
}) {
  return alovaInstance.postWithMsg<void>('/api/v1/application/generateQuestion', data);
}

/**
 * 获取问题关联的段落列表
 * @param data
 * @returns 关联数据列表
 */
export function getQuestionRelation(data: { questionIds: string; datasetId: number | string }) {
  return alovaInstance.get<any[]>('/api/v1/application/getQuestionRelation', {
    params: data,
  });
}

/**
 * 操作问题关联（新增/删除）
 * @param data
 * @returns void
 */
export function doQuestionRelation(data: {
  datasetId: number | string;
  questionIds: string;
  documentId: number | string;
  paragraphId: number | string;
  type: number; // 1:新增 2:删除
}) {
  return alovaInstance.postWithMsg<void>('/api/v1/application/doQuestionRelation', data);
}
