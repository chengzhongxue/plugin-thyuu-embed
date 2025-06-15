<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, onMounted, ref, watch} from "vue";
import IconVideo from "@/icon/IconVideo.vue";
import {thyuuShortcodeVideo} from "@kunkunyu/thyuu-embed";
import IconInfo from "@/icon/IconInfo.vue";



const props = defineProps<NodeViewProps>();

const video = ref<string>();

const src = computed({
  get: () => {
    return props.node?.attrs.src;
  },
  set: (src: string) => {
    props.updateAttributes({ src: src });
  },
});

const size = computed({
  get: () => {
    return props.node?.attrs.size;
  },
  set: (size: string) => {
    props.updateAttributes({ size: size });
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
    getVideo(src.value);
  }
});

function getVideo(url: string) {
  video.value = thyuuShortcodeVideo(url,size.value);
}

watch(
  () => props.node.attrs.src,
  (value) => {
    if (value) {
      getVideo(value);
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
          <h5><i><IconVideo/></i>THYUU / 多平台嵌入视频</h5>
          <i>
            <IconInfo/>
          </i>
        </summary>
        <h6>支持平台及链接示例</h6>
        <ul>
          <li>bilibili - https://www.bilibili.com/video/<i>BV1Ec411z7j2</i></li>
          <li>bilibili直播 - https://live.bilibili.com/<i>00000000</i></li>
          <li>抖音视频 - https://www.douyin.com/video/<i>7446330035725749564</i></li>
          <li>腾讯视频 - https://v.qq.com/x/cover/mzc002001f5d4ic/<i>s0955xkheix</i>.html</li>
          <li>优酷视频 - https://v.youku.com/v_show/id_<i>XNDY5MjcyNTcy</i>.html</li>
        </ul>
        <p>考虑数据整洁，建议按格式复制并删除多余参数，标记颜色为必要参数</p>
        <h6>视频方向说明</h6>
        <ul>
          <li>固定横屏(16 × 9) - 无论是在大屏和小屏时都固定横屏，适合横版的视频</li>
          <li>适应竖屏(9 × 18) - 大屏时适应横屏，小屏时适应竖屏，适合竖版的视频</li>
        </ul>
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
      <div v-html="video"></div>
    </div>
  </node-view-wrapper>
</template>
