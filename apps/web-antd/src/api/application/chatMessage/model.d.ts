import type { BaseEntity, PageQuery } from '#/api/common';

export interface ChatMessageVO {
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
     * 会话Id
     */
                sessionId: number;

    /**
     * 角色（user、agent）
     */
                role: string;

    /**
     * 内容
     */
                content: string;

    /**
     * 消耗Token
     */
                token: number;

    /**
     * 耗时（毫秒）
     */
                latencyMs: number;

    /**
     * 评价（0-未评价 1-赞 2-踩）
     */
                feedback: string;

    /**
     * 租户Id
     */
                tenantId: string;

    /**
     * 创建部门
     */
                createDept: number;

    /**
     * 创建时间
     */
                createTime: ${column.tsType};

    /**
     * 修改时间
     */
                updateTime: ${column.tsType};

}

export interface ChatMessageForm extends BaseEntity {
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
     * 会话Id
     */
                sessionId?: number;

    /**
     * 角色（user、agent）
     */
                role?: string;

    /**
     * 内容
     */
                content?: string;

    /**
     * 消耗Token
     */
                token?: number;

    /**
     * 耗时（毫秒）
     */
                latencyMs?: number;

    /**
     * 评价（0-未评价 1-赞 2-踩）
     */
                feedback?: string;

    /**
     * 租户Id
     */
                tenantId?: string;

    /**
     * 创建部门
     */
                createDept?: number;

    /**
     * 创建时间
     */
                createTime?: ${column.tsType};

    /**
     * 修改时间
     */
                updateTime?: ${column.tsType};

}

export interface ChatMessageQuery extends PageQuery {
        /**
         * 用户Id
         */
                    userId?: number;

        /**
         * 应用Id
         */
                    applicationId?: number;

        /**
         * 会话Id
         */
                    sessionId?: number;

        /**
         * 角色（user、agent）
         */
                role?: string;

        /**
         * 评价（0-未评价 1-赞 2-踩）
         */
                feedback?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}
