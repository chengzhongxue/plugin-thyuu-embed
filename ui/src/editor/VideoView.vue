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

onMounted(() => {
  if (!src.value) {
    video.value = '';
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
        <h6>方式一：支持平台及链接示例</h6>
        <ul>
          <li>bilibili - https://www.bilibili.com/video/<i>BV1Ec411z7j2</i></li>
          <li>bilibili直播 - https://live.bilibili.com/<i>00000000</i></li>
          <li>抖音视频 - https://www.douyin.com/video/<i>7446330035725749564</i></li>
          <li>腾讯视频 - https://v.qq.com/x/cover/mzc002001f5d4ic/<i>s0955xkheix</i>.html</li>
          <li>优酷视频 - https://v.youku.com/v_show/id_<i>XNDY5MjcyNTcy</i>.html</li>
        </ul>
        <p>考虑数据整洁，建议按格式复制并删除多余参数，标记颜色为必要参数</p>
        <h6>方式二：直接嵌入平台iframe</h6>
        <ul>
          <li>若视频链接无法在上述解析，可直接嵌入平台提供的带 iframe 闭合标签的代码，即可自动解析成THYUU/区块格式。</li>
        </ul>
        <h6>视频方向说明</h6>
        <ul>
          <li>固定横屏(16 × 9)</li>
          <li>适应竖屏(9 × 18)</li>
        </ul>
      </details>
      <div class="thyuu-embed-panel thyuu-basic-setin">
        <input
          type="url"
          v-model="src"
          class=":uno: block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="视频链接或 iframe代码"
          tabindex="-1"
        />
        <select v-model="size">
          <option value="">选择视频方向</option>
          <option value="lr">固定横屏</option>
          <option value="tb">适应竖屏</option>
        </select>
      </div>
      <div v-html="video"></div>
    </div>
  </node-view-wrapper>
</template>
