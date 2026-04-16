import { alovaInstance } from '#/utils/http';

/**
 * 预览文档
 * @param data FormData
 * @returns 文档预览结果
 */
export function previewDocument(data: FormData) {
  return alovaInstance.post<Blob>('/api/v1/application/previewDocument', data, {
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
