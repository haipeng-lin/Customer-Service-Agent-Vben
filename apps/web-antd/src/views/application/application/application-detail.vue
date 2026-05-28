<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { Page } from "@vben/common-ui";
import { useRoute, useRouter } from "vue-router";
import { Input, InputNumber, Switch, message } from "antdv-next";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {
  LikeOutlined,
  DislikeOutlined,
  CopyOutlined,
  CheckOutlined,
  SaveOutlined,
} from "@antdv-next/icons";

import { listChatLog, appraise } from "#/api/chat";
import type { ApplicationVO } from "#/api/application/application/model";
import { applicationInfo, applicationUpdate } from "#/api/application/application";
import { useAccessStore } from "@vben/stores";

const route = useRoute();
const router = useRouter();
const applicationId = computed(() => String(route.params.applicationId));
const accessStore = useAccessStore();

// 固定的会话ID
const SESSION_ID = 1;

// 加载状态
const loading = ref(false);

// 应用详情
const applicationDetail = ref<ApplicationVO | null>(null);

// 加载应用详情
async function loadApplicationDetail() {
  loading.value = true;
  try {
    const detail = await applicationInfo(applicationId.value);
    applicationDetail.value = detail;
    console.log("加载应用详情成功:", detail);
  } catch (e) {
    console.error("加载应用详情失败:", e);
    message.error("加载应用详情失败");
  } finally {
    loading.value = false;
  }
}

// 保存应用参数
async function handleSave() {
  if (!applicationDetail.value) return;
  try {
    const data = { ...applicationDetail.value };
    await applicationUpdate(data as any);
    message.success("保存成功");
  } catch (e) {
    message.error("保存失败，请重试");
  }
}

// 返回列表
function handleBack() {
  router.push("/application/application");
}

// 右侧消息列表 (流式消息格式)
interface StreamMessage {
  id?: number;
  role: "user" | "agent";
  content: any;
  createTime?: string;
  answerIng?: number;
  feedback?: string;
  copied?: boolean;
}
const messageList = ref<StreamMessage[]>([]);

// 输入框内容
const inputMessage = ref("");

// SSE 流式状态
const answerIng = ref(0);
const chatContainer = ref<HTMLElement | null>(null);
let ctrl = new AbortController();

// 加载消息列表
async function loadMessageList() {
  const list = await listChatLog(SESSION_ID);
  messageList.value = (list as any[]).map((log: any) => {
    const isUser = log.role === 'user';
    return {
      id: log.id,
      role: log.role,
      content: isUser ? log.content : [
        {
          nodeId: log.id,
          content: log.content.replace(/<think>/g, '<blockquote><think>')
            .replace(/<\/think>/g, '</think></blockquote>'),
        }],
      createTime: log.createTime,
      feedback: log.feedback,
      answerIng: 3
    };
  });
  sliderBottom();
}

// 发送消息
async function handleSend() {
  if (!inputMessage.value.trim() || answerIng.value === 2) return;

  const question = inputMessage.value.trim();
  messageList.value.push({
    role: "user",
    content: question,
  });
  messageList.value.push({
    role: "agent",
    content: "思考中...",
    answerIng: 1,
  });

  inputMessage.value = "";
  answerIng.value = 1;
  await sliderBottom();

  executeSSE(question, messageList.value.length - 1);
}

// 核心 SSE 执行逻辑
function executeSSE(question: string, nowIndex: number) {
  const requestData = {
    sessionId: SESSION_ID,
    applicationId: applicationId.value,
    content: question,
  };

  ctrl = new AbortController();
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  const sseUrl = baseUrl + "/api/api/v1/chat/sseChat";

  fetchEventSource(sseUrl, {
    method: "POST",
    signal: ctrl.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessStore.accessToken,
    },
    body: JSON.stringify(requestData),
    openWhenHidden: true,
    async onmessage(ev) {
      const { event, data } = ev;

      if (event === "[START]") {
        messageList.value[nowIndex] = {
          role: "agent",
          content: "",
          answerIng: 2,
        };
        answerIng.value = 2;
      } else if (event === "[DONE]") {
        answerIng.value = 3;
        messageList.value[nowIndex].answerIng = 3;
        if (data) {
          try {
            const metaData = JSON.parse(data);
            messageList.value[nowIndex].id = metaData.messageId;
          } catch (e) {
            console.error("解析 DONE 失败", e);
          }
        }
      } else if (event === "[ERROR]") {
        answerIng.value = 0;
        messageList.value[nowIndex].answerIng = 3;
        let errorMsg = "请求失败，请重试";
        try {
          const errorData = JSON.parse(data);
          errorMsg = errorData.error?.message || errorMsg;
        } catch (e) { }
        messageList.value[nowIndex].content = errorMsg;
      } else {
        try {
          const resData = JSON.parse(data);
          let chunk = resData.content || "";
          chunk = chunk.replace("<think>", "<blockquote><think>")
            .replace("</think>", "</think></blockquote>")
            .replace("-_-_wrap_-_-", "\n");
          messageList.value[nowIndex].content += chunk;
          sliderBottom();
        } catch (e) {
          console.error("流内容解析失败", e);
        }
      }
    },
    onerror(err) {
      messageList.value[nowIndex].content = "连接中断，请重试";
      stopAnswer();
      throw err;
    },
  });
}

// 滚动到底部
async function sliderBottom() {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

// 停止生成
function stopAnswer() {
  ctrl.abort();
  answerIng.value = 0;
  const lastMsg = messageList.value[messageList.value.length - 1];
  if (lastMsg?.role === "agent") lastMsg.answerIng = 3;
}

// 评价消息
async function handleAppraise(msg: StreamMessage, feedback: string) {
  if (!msg.id) {
    message.warning("消息还未生成完成，无法评价");
    return;
  }
  try {
    await appraise({ messageId: String(msg.id), feedback });
    msg.feedback = feedback;
    message.success(feedback === "1" ? "感谢您的点赞" : "感谢您的反馈");
  } catch (e) {
    message.error("评价失败，请重试");
  }
}

// 复制消息内容
async function handleCopyContent(msg: StreamMessage) {
  let text = Array.isArray(msg.content)
    ? msg.content.map((c) => c.content).join("")
    : msg.content;
  text = text.replace(/<blockquote><think>[\s\S]*?<\/think>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
  try {
    await navigator.clipboard.writeText(text);
    msg.copied = true;
    setTimeout(() => {
      msg.copied = false;
    }, 2000);
  } catch (e) {
    message.error("复制失败，请手动选择复制");
  }
}

onMounted(() => {
  loadApplicationDetail();
  loadMessageList();
});
</script>

<template>
  <Page :auto-content-height="true" class="bg-[#f1f3f6]">
    <div class="flex h-[calc(100vh-120px)] gap-4">
      <!-- 左侧应用参数 -->
      <div class="w-1/3 bg-white rounded-lg p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <div class="text-lg font-semibold">应用参数</div>
          <a-button type="primary" size="small" @click="handleBack">
            返回列表
          </a-button>
        </div>

        <div class="space-y-4" v-if="applicationDetail">
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">应用名称:</div>
            <Input v-model:value="applicationDetail.name" class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">应用描述:</div>
            <Input v-model:value="applicationDetail.description" class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">模型名称:</div>
            <Input v-model:value="applicationDetail.modelName" disabled class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">提示词:</div>
            <Input v-model:value="applicationDetail.prompt" type="textarea" :rows="3" class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">开场白标题:</div>
            <Input v-model:value="applicationDetail.prologueTitle" class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">开场白问题:</div>
            <Input v-model:value="applicationDetail.prologueQuestion" type="textarea" :rows="2" class="flex-1" />
          </div>
          <div class="flex items-center">
            <div class="w-28 text-right mr-2 text-gray-500">检索模式:</div>
            <Input v-model:value="applicationDetail.searchMode" class="flex-1" />
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">相似度:</div>
              <InputNumber v-model:value="applicationDetail.similarity" class="flex-1" />
            </div>
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">召回数量:</div>
              <InputNumber v-model:value="applicationDetail.topRank" class="flex-1" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">记忆条数:</div>
              <InputNumber v-model:value="applicationDetail.memoryNum" class="flex-1" />
            </div>
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">温度:</div>
              <InputNumber v-model:value="applicationDetail.temperature" class="flex-1" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">评价显示:</div>
              <Switch v-model:checked="applicationDetail.isShowAppraise" checkedValue="1" unCheckedValue="0" />
            </div>
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">引用显示:</div>
              <Switch v-model:checked="applicationDetail.isShowRelation" checkedValue="1" unCheckedValue="0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">时间显示:</div>
              <Switch v-model:checked="applicationDetail.isShowTime" checkedValue="1" unCheckedValue="0" />
            </div>
            <div class="flex items-center flex-1">
              <div class="w-20 text-right mr-2 text-gray-500">Token显示:</div>
              <Switch v-model:checked="applicationDetail.isShowToken" checkedValue="1" unCheckedValue="0" />
            </div>
          </div>
          <div class="mt-4">
            <a-button type="primary" @click="handleSave">
              <template #icon>
                <SaveOutlined />
              </template>
              保存参数
            </a-button>
          </div>
        </div>
        <a-spin v-else-if="loading" />
        <a-empty v-else description="加载应用详情失败，请返回重试" />
      </div>

      <!-- 右侧聊天区域 -->
      <div class="flex-1 bg-white rounded-lg p-4 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <div class="text-lg font-semibold">对话</div>
        </div>

        <!-- 消息内容区 -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto mb-4">
          <div v-if="applicationDetail">
            <div v-for="(msg, index) in messageList" :key="index" class="mb-4"
              :class="msg.role === 'user' ? 'text-right' : 'text-left'">
              <div class="inline-block max-w-[80%] p-3 rounded-lg" :class="msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'w-full'
                ">
                <!-- 用户消息直接显示文本 -->
                <div v-if="msg.role === 'user'">{{ msg.content }}</div>
                <!-- AI 消息显示 Markdown 或思考中状态 -->
                <template v-else-if="msg.role === 'agent'">
                  <div v-if="msg.answerIng === 1" class="text-gray-400">{{ msg.content }}</div>
                  <div v-else-if="Array.isArray(msg.content)">
                    <div v-for="(subItem, subIndex) in msg.content" :key="subIndex">
                      <MdPreview :modelValue="subItem.content" />
                    </div>
                  </div>
                  <MdPreview v-else :modelValue="msg.content" />
                  <!-- Agent 消息操作按钮和时间 -->
                  <div v-if="msg.answerIng === 3"
                    class="flex items-center justify-between mt-2 border-t border-gray-100 pt-2">
                    <div class="flex items-center gap-2">
                      <a-button v-if="applicationDetail.isShowAppraise === '1'" type="text" size="small"
                        @click="handleAppraise(msg, '1')">
                        <template #icon>
                          <LikeOutlined :style="{ color: msg.feedback === '1' ? '#52c41a' : '#999' }" />
                        </template>
                      </a-button>
                      <a-button v-if="applicationDetail.isShowAppraise === '1'" type="text" size="small"
                        @click="handleAppraise(msg, '2')">
                        <template #icon>
                          <DislikeOutlined :style="{ color: msg.feedback === '2' ? '#ff7a45' : '#999' }" />
                        </template>
                      </a-button>
                      <a-button type="text" size="small" @click="handleCopyContent(msg)">
                        <template #icon>
                          <CheckOutlined v-if="msg.copied" style="color: #52c41a" />
                          <CopyOutlined v-else style="color: #999" />
                        </template>
                      </a-button>
                    </div>
                    <div v-if="applicationDetail.isShowTime === '1'" class="text-xs">
                      {{ msg.createTime }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框区域 -->
        <div class="pt-4">
          <div class="flex gap-2">
            <a-button v-if="answerIng === 2" danger @click="stopAnswer">停止生成</a-button>
            <Input v-model:value="inputMessage" :disabled="answerIng === 2" placeholder="聊一聊" @pressEnter="handleSend"
              size="large" />
            <a-button type="primary" :disabled="!inputMessage.trim() || answerIng === 2" @click="handleSend">
              发送
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
