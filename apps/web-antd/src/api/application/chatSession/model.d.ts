import type { BaseEntity, PageQuery } from '#/api/common';

export interface ChatSessionVO {
    /**
     * Id
     */
            id: number | string;

    /**
     * 用户Id
     */
                userId: number;

    /**
     * 应用Id
     */
                applicationId: number;

    /**
     * 标题
     */
                title: string;

    /**
     * 来源（0-网页 1-APP）
     */
                source: string;

    /**
     * 状态（0-AI 1-人工 2-结束）
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

}

export interface ChatSessionForm extends BaseEntity {
    /**
     * Id
     */
            id?: number | string;

    /**
     * 用户Id
     */
                userId?: number;

    /**
     * 应用Id
     */
                applicationId?: number;

    /**
     * 标题
     */
                title?: string;

    /**
     * 来源（0-网页 1-APP）
     */
                source?: string;

    /**
     * 状态（0-AI 1-人工 2-结束）
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

}

export interface ChatSessionQuery extends PageQuery {
        /**
         * 用户Id
         */
                    userId?: number;

        /**
         * 应用Id
         */
                    applicationId?: number;

        /**
         * 标题
         */
                title?: string;

        /**
         * 来源（0-网页 1-APP）
         */
                source?: string;

        /**
         * 状态（0-AI 1-人工 2-结束）
         */
                status?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}
