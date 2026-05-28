<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { Page } from "@vben/common-ui";
import { useRoute } from "vue-router";
import { Input, message } from "antdv-next";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {
  LikeOutlined,
  DislikeOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@antdv-next/icons";

import { listChatLog, startSession, appraise } from "#/api/chat";
import type { AppChatSessionForm } from "#/api/chat/model";
import { chatSessionListAll } from "#/api/application/chatSession";
import type { ChatSessionVO } from "#/api/application/chatSession/model";
import { applicationInfo } from "#/api/application/application";
import type { ApplicationVO } from "#/api/application/application/model";
import { useAccessStore } from "@vben/stores";

const route = useRoute();
const applicationId = computed(() => String(route.params.applicationId));
const accessStore = useAccessStore();

// 应用详情
const applicationDetail = ref<ApplicationVO | null>(null);

// 加载应用详情
async function loadApplicationDetail() {
  const detail = await applicationInfo(applicationId.value);
  applicationDetail.value = detail;
}

// 显示控制
const showAppraise = computed(() => applicationDetail.value?.isShowAppraise === '1');
const showTime = computed(() => applicationDetail.value?.isShowTime === '1');

// 左侧会话列表
const sessionList = ref<ChatSessionVO[]>([]);
const currentSession = ref<ChatSessionVO | null>(null);

// 右侧消息列表 (流式消息格式)
interface StreamMessage {
  id?: number;
  role: "user" | "agent";
  content: any;
  createTime?: string;
  answerIng?: number; // 0-思考中, 2-生成中, 3-已完成
  feedback?: string; // 评价状态: 1-赞, 2-踩
  copied?: boolean; // 复制状态
  inputTokens?: number; // 输入token数
  outputTokens?: number; // 输出token数
  totalTokens?: number; // 总token数
  time?: number; // 耗时(秒)
}
const messageList = ref<StreamMessage[]>([]);

// 输入框内容
const inputMessage = ref("");

// SSE 流式状态
const answerIng = ref(0); // 0-未开始, 1-思考中, 2-生成中, 3-已完成
const chatContainer = ref<HTMLElement | null>(null);
let ctrl = new AbortController();

// 加载会话列表
async function loadSessionList() {
  sessionList.value = await chatSessionListAll({ applicationId: applicationId.value });
  if (sessionList.value.length > 0 && !currentSession.value && sessionList.value[0] != undefined) {
    selectSession(sessionList.value[0]);
  }
}

// 加载消息列表
async function loadMessageList(sessionId: number) {
  const list = await listChatLog(sessionId);
  messageList.value = (list as any[]).map((log: any) => {
    const isUser = log.role === 'user';

    // if (!isUser && log.sourceContent) {
    //   try {
    //     parsedSources = JSON.parse(log.sourceContent);
    //   } catch (e) {
    //     console.error("解析历史消息引用内容失败:", e);
    //     parsedSources = [];
    //   }
    // }
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
  console.log(messageList.value[1])
  sliderBottom();
}


// 新增会话
async function handleAddSession() {
  const data: AppChatSessionForm = {
    applicationId: applicationId.value,
  };
  const sessionId = await startSession(data);
  await loadSessionList();
  // 选中新会话
  const newSession = sessionList.value.find((s) => s.id === sessionId);
  if (newSession) {
    selectSession(newSession);
  }
}

// 选择会话
function selectSession(session: ChatSessionVO) {
  currentSession.value = session;
  loadMessageList(session.id as number);
}

// 发送消息
async function handleSend() {
  if (!inputMessage.value.trim() || !currentSession.value || answerIng.value === 2) return;

  const question = inputMessage.value.trim();
  // 添加用户消息
  messageList.value.push({
    role: "user",
    content: question,
  });
  // 添加 AI 思考中占位
  messageList.value.push({
    role: "agent",
    content: "思考中...",
    answerIng: 1,
  });

  inputMessage.value = "";
  answerIng.value = 1;
  await sliderBottom();

  // 执行 SSE
  executeSSE(question, messageList.value.length - 1);
}

// 核心 SSE 执行逻辑
function executeSSE(question: string, nowIndex: number) {
  const requestData = {
    sessionId: currentSession.value?.id,
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
            messageList.value[nowIndex].inputTokens = metaData.inputTokens;
            messageList.value[nowIndex].outputTokens = metaData.outputTokens;
            messageList.value[nowIndex].totalTokens = metaData.totalTokens;
            messageList.value[nowIndex].time = metaData.time;
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
        // 普通消息片段
        try {
          const resData = JSON.parse(data);
          let chunk = resData.content || "";
          // 处理思考标签
          // chunk = chunk
          //   .replace(/&lt;think&gt;/g, "<blockquote>")
          //   .replace(/&lt;\/think&gt;/g, "</blockquote>")
          //   .replace(/<think>/g, "<blockquote>")
          //   .replace(/<\/think>/g, "</blockquote>");
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

// 评价消息 (点赞/拉踩)
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
  // 过滤掉思考标签
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
  loadSessionList();
});
</script>

<template>
  <Page :auto-content-height="true" class="bg-[#f1f3f6]">
    <div class="flex h-[calc(100vh-120px)] gap-4">
      <!-- 左侧会话列表 -->
      <div class="w-1/4 bg-white rounded-lg p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <div class="text-lg font-semibold">会话列表</div>
          <a-button type="primary" size="small" @click="handleAddSession">新增</a-button>
        </div>
        <div v-for="item in sessionList" :key="item.id" class="p-3 mb-2 rounded-lg cursor-pointer transition-all"
          :class="currentSession?.id === item.id
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
            " @click="selectSession(item)">
          <div class="font-medium truncate">{{ item.title }}</div>
        </div>
        <a-empty v-if="sessionList.length === 0" description="暂无会话" />
      </div>

      <!-- 右侧聊天区域 -->
      <div class="flex-1 bg-white rounded-lg p-4 flex flex-col">
        <!-- 消息内容区 -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto mb-4">
          <div v-if="currentSession">
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
                      <a-button v-if="showAppraise" type="text" size="small" @click="handleAppraise(msg, '1')">
                        <template #icon>
                          <LikeOutlined :style="{ color: msg.feedback === '1' ? '#52c41a' : '#999' }" />
                        </template>
                      </a-button>
                      <a-button v-if="showAppraise" type="text" size="small" @click="handleAppraise(msg, '2')">
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
                    <div v-if="showTime" class="text-xs">
                      {{ msg.createTime }}
                    </div>
                  </div>
                  <!-- <div v-else class="text-xs mt-1 opacity-60 text-gray-400">
                    {{ msg.createTime }}
                  </div> -->
                </template>
              </div>
            </div>
          </div>
          <a-empty v-else description="请选择左侧会话" />
        </div>

        <!-- 输入框区域 -->
        <div class="pt-4">
          <div class="flex gap-2">
            <a-button v-if="answerIng === 2" danger @click="stopAnswer">停止生成</a-button>
            <Input v-model:value="inputMessage" :disabled="answerIng === 2" placeholder="聊一聊" @pressEnter="handleSend"
              size="large" />
            <a-button type="primary" :disabled="!inputMessage.trim() || !currentSession || answerIng === 2"
              @click="handleSend">发送</a-button>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
