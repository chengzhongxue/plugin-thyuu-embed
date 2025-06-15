<script setup lang="ts">
import type { Editor } from '@halo-dev/richtext-editor';
import type { Component } from 'vue';
import videoViewTypes, {type VideoViewType} from "@/editor/video-view-type";

const props = defineProps<{
  editor: Editor;
  isActive?: ({ editor }: { editor: Editor }) => boolean;
  visible?: ({ editor }: { editor: Editor }) => boolean;
  action?: ({ editor }: { editor: Editor }) => Component | void;
  type: ({ editor }: { editor: Editor }) => VideoViewType;
}>();

const handleSwitchVideoViewType = (item: VideoViewType) => {
  if (isActiveType(item)) {
    return;
  }
  item.action({ editor: props.editor });
};

const isActiveType = (item: VideoViewType) => {
  return props.type?.({ editor: props.editor }).key === item.key || false;
};
</script>
<template>
  <ul class=":uno: flex flex-col space-y-1.5">
    <li
      v-for="item in videoViewTypes"
      :key="item.key"
      class=":uno: group flex cursor-pointer flex-row items-center gap-3 rounded px-1.5 py-1 hover:bg-gray-100"
      :class="{ ':uno: !bg-gray-100': isActiveType(item) }"
      @click="handleSwitchVideoViewType(item)"
    >
      <span
        class=":uno: text-sm text-gray-600 group-hover:font-medium group-hover:text-gray-900"
        :class="{ ':uno: !font-medium !text-gray-900': isActiveType(item) }"
      >
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>
