<script setup lang="ts">
import { ref } from "vue";

import { useVbenDrawer } from "@vben/common-ui";

import ParagraphList from "./paragraph-list.vue";

const documentId = ref<string | number>("");

const [BasicDrawer, drawerApi] = useVbenDrawer({
  title: "分段列表",
  class: "w-[800px]",
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = drawerApi.getData() as { id: string | number };
      documentId.value = data.id;
    }
  },
});

defineExpose({ documentId });
</script>

<template>
  <BasicDrawer>
    <ParagraphList :document-id="documentId" />
  </BasicDrawer>
</template>
