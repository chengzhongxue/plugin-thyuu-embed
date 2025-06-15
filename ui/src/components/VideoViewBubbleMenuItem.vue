<script lang="ts" setup>
import type { Editor } from '@halo-dev/richtext-editor';
import { Dropdown as VDropdown } from 'floating-vue';
import type { Component } from 'vue';
import MdiMenuDown from '~icons/mdi/menu-down';
import type {VideoViewType} from "@/editor/video-view-type";
import VideoViewMenu from "@/components/VideoViewMenu.vue";

const props = withDefaults(
  defineProps<{
    editor: Editor;
    isActive?: ({ editor }: { editor: Editor }) => boolean;
    visible?: ({ editor }: { editor: Editor }) => boolean;
    action?: ({ editor }: { editor: Editor }) => Component | void;
    type: ({ editor }: { editor: Editor }) => VideoViewType;
  }>(),
  {
    isActive: () => false,
    visible: () => true,
    action: undefined,
    type: undefined,
  }
);
</script>

<template>
  <VDropdown class=":uno: inline-flex" :triggers="['click']" :popper-triggers="['click']">
    <button
      :class="{ ':uno: bg-gray-200 !text-black': isActive({ editor }) }"
      class=":uno: inline-flex h-full items-center gap-x-1 rounded-md p-2 text-base text-gray-600 hover:bg-gray-100"
    >
      <span>{{ type?.({ editor }).title }}</span>
      <MdiMenuDown />
    </button>
    <template #popper>
      <div
        class=":uno: relative max-h-96 w-56 overflow-hidden overflow-y-auto rounded-md bg-white p-1 drop-shadow"
      >
        <KeepAlive>
          <VideoViewMenu v-bind="props"></VideoViewMenu>
        </KeepAlive>
      </div>
    </template>
  </VDropdown>
</template>
<style lang="scss">
.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  transform: scale(0.9);
}

.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  transform: none;
  transition: transform 0.1s;
}
</style>
