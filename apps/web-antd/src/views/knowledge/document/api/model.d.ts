import type { BaseEntity, PageQuery } from '#/api/common';

export interface DocumentVO {
    /**
     * Id
     */
            id: number | string;

    /**
     * 知识库Id
     */
                datasetId: number;

    /**
     * 类型（0-文档 1-文本）
     */
                type: string;

    /**
     * 文档标题
     */
                title: string;

    /**
     * 文档内容
     */
                content: string;

    /**
     * 文件大小（MB）
     */
                fileSize: number;

    /**
     * 分段数
     */
                segmentCount: number;

    /**
     * 向量状态（0-待向量 1-向量中 2-完成）
     */
                embeddingStatus: string;

    /**
     * 向量时间
     */
                embeddingTime: ${column.tsType};

    /**
     * 生成问题状态（0-待生成 1-生成中 2-完成）
     */
                questionStatus: string;

    /**
     * 生成问题时间
     */
                questionTime: ${column.tsType};

    /**
     * 命中处理方式
     */
                answerType: string;

    /**
     * 返回相似度
     */
                redirectSimilar: number;

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
                createTime: ${column.tsType};

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
                updateTime: ${column.tsType};

}

export interface DocumentForm extends BaseEntity {
    /**
     * Id
     */
            id?: number | string;

    /**
     * 知识库Id
     */
                datasetId?: number;

    /**
     * 类型（0-文档 1-文本）
     */
                type?: string;

    /**
     * 文档标题
     */
                title?: string;

    /**
     * 文档内容
     */
                content?: string;

    /**
     * 文件大小（MB）
     */
                fileSize?: number;

    /**
     * 分段数
     */
                segmentCount?: number;

    /**
     * 向量状态（0-待向量 1-向量中 2-完成）
     */
                embeddingStatus?: string;

    /**
     * 向量时间
     */
                embeddingTime?: ${column.tsType};

    /**
     * 生成问题状态（0-待生成 1-生成中 2-完成）
     */
                questionStatus?: string;

    /**
     * 生成问题时间
     */
                questionTime?: ${column.tsType};

    /**
     * 命中处理方式
     */
                answerType?: string;

    /**
     * 返回相似度
     */
                redirectSimilar?: number;

    /**
     * 状态（0-启用 1-禁用）
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

    /**
     * 创建人
     */
                createBy?: number;

    /**
     * 创建时间
     */
                createTime?: ${column.tsType};

    /**
     * 修改部门
     */
                updateDept?: number;

    /**
     * 修改人
     */
                updateBy?: number;

    /**
     * 修改时间
     */
                updateTime?: ${column.tsType};

}

export interface DocumentQuery extends PageQuery {
        /**
         * 知识库Id
         */
                    datasetId?: number;

        /**
         * 类型（0-文档 1-文本）
         */
                type?: string;

        /**
         * 文档标题
         */
                title?: string;

        /**
         * 文档内容
         */
                content?: string;

        /**
         * 文件大小（MB）
         */
                    fileSize?: number;

        /**
         * 分段数
         */
                    segmentCount?: number;

        /**
         * 向量状态（0-待向量 1-向量中 2-完成）
         */
                embeddingStatus?: string;

        /**
         * 向量时间
         */
                    embeddingTime?: ${column.tsType};

        /**
         * 生成问题状态（0-待生成 1-生成中 2-完成）
         */
                questionStatus?: string;

        /**
         * 生成问题时间
         */
                    questionTime?: ${column.tsType};

        /**
         * 命中处理方式
         */
                answerType?: string;

        /**
         * 返回相似度
         */
                    redirectSimilar?: number;

        /**
         * 状态（0-启用 1-禁用）
         */
                status?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}
