<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, onMounted, ref, watch} from "vue";
import IconMusic from "@/icon/IconMusic.vue";
import {thyuuShortcodeMusic} from "@kunkunyu/thyuu-embed";
import IconInfo from "@/icon/IconInfo.vue";

const props = defineProps<NodeViewProps>();

const music = ref<string>();

const src = computed({
  get: () => {
    return props.node?.attrs.src;
  },
  set: (src: string) => {
    props.updateAttributes({ src: src });
  },
});

function handleSetFocus() {
  props.editor.commands.setNodeSelection(props.getPos());
}
const inputRef = ref();

onMounted(() => {
  if (!src.value) {
    inputRef.value.focus();
  }else {
    getMusic(src.value);
  }
});

function getMusic(url: string) {
  music.value = thyuuShortcodeMusic(url);

}

watch(
  () => props.node.attrs.src,
  (value) => {
    if (value) {
      getMusic(value);
    }
  }
);

</script>

<template>
  <node-view-wrapper as="div" class="contact-thyuu-embed-container"
                     :class="{
        'contact-thyuu-embed-container--selected': selected,
      }">
    <div class="thyuu-embed-block">
      <details class="thyuu-embed-refer">
        <summary>
          <h5><i><IconMusic/></i>THYUU / 嵌入音乐</h5>
          <i>
            <IconInfo/>
          </i>
        </summary>
        <h6>支持平台及链接示例</h6>
        <ul>
          <li>QQ音乐 | 单曲 - https://y.qq.com/n/ryqq/songDetail/<i>001z3SOQ1SSvLQ</i></li>
          <li>网易云音乐 | 单曲 - https://music.163.com/#/song?id=<i>2630864179</i></li>
          <li>网易云音乐 | 歌单 - https://music.163.com/#/playlist?id=<i>2630864179</i></li>
          <li>网易云音乐 | 专辑 - https://music.163.com/#/album?id=<i>2630864179</i></li>
        </ul>
        <p>考虑数据整洁，建议按格式复制并删除多余参数，标记颜色为必要参数</p>
      </details>
      <input
        ref="inputRef"
        type="url"
        v-model.lazy="src"
        class=":uno: block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="输入链接，按回车确定"
        tabindex="-1"
        @focus="handleSetFocus"
      />
      <div v-html="music"></div>
    </div>
  </node-view-wrapper>
</template>
