export const DictEnum = {
  SYS_COMMON_STATUS: 'sys_common_status',
  SYS_DEVICE_TYPE: 'sys_device_type', // 设备类型
  SYS_GRANT_TYPE: 'sys_grant_type', // 授权类型
  SYS_NORMAL_DISABLE: 'sys_normal_disable',
  SYS_NOTICE_STATUS: 'sys_notice_status', // 通知状态
  SYS_NOTICE_TYPE: 'sys_notice_type', // 通知类型
  SYS_OPER_TYPE: 'sys_oper_type', // 操作类型
  SYS_OSS_ACCESS_POLICY: 'oss_access_policy', // oss权限桶类型
  SYS_SHOW_HIDE: 'sys_show_hide', // 显示状态
  SYS_USER_SEX: 'sys_user_sex', // 性别
  SYS_YES_NO: 'sys_yes_no', // 是否
  WF_BUSINESS_STATUS: 'wf_business_status', // 业务状态
  WF_FORM_TYPE: 'wf_form_type', // 表单类型
  WF_TASK_STATUS: 'wf_task_status', // 任务状态
  MD_MODEL_TYPE: 'md_model_type', // 模型类型
  KB_EMBEDDING_STATUS: 'kb_embedding_status', // 向量状态
  KB_QUESTION_STATUS: 'kb_question_status', // 问题状态
  APP_ROLE_TYPE: 'app_role_type', // 角色类型
  APP_FEEDBACK_TYPE: 'app_feedback_type', //评价类型
  SYS_COMMON_YES_NO: 'sys_common_yes_no', // 通用是否
  KB_APPLICATION_TYPE: 'kb_application_type', // 应用类型
  APP_SEARCH_TYPE: 'app_search_type', // 检索类型
  APP_SESSION_SOURCE_TYPE: 'app_session_source_type', // 会话来源类型
  APP_SESSION_STATUS: 'app_session_status', // 会话状态


} as const;

export type DictEnumKey = keyof typeof DictEnum;
