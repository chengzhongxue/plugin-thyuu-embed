<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, onMounted, ref, watch} from "vue";
import {Toast} from "@halo-dev/components";
import {thyuuShortcodeVideo, type Videoatts} from "@/utils/video";
import IconVideo from "@/icon/IconVideo.vue";


const props = defineProps<NodeViewProps>();

const videoatts = ref<Videoatts | undefined>();

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
  const video = thyuuShortcodeVideo(url);
  if (video) {
    videoatts.value = video
  } else {
    Toast.error("嵌入视频，链接无法识别");
  }
}

watch(
  () => props.node.attrs.src,
  (value) => {
    if (value) {
      getVideo(value);
    }
  }
);

const handleResetInit = () => {
  props.updateAttributes({src: ""});
  props.updateAttributes({size: ""});
  videoatts.value = undefined; 
};

</script>

<template>
  <node-view-wrapper as="div" class="contact-thyuu-embed-container"
                     :class="{
        'contact-thyuu-embed-container--selected': selected,
      }">
    <div class="thyuu-embed-setin"  v-if="!src || videoatts==undefined">
      <details class="thyuu-embed-edite-head">
        <summary>
          <h5><i><IconVideo/></i>THYUU / 嵌入视频</h5>
          <i>
            <svg t="1736590172685" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16610" width="1.5em" height="1.5em"><path d="M792.49362266 95.96527991c-16.04614629-10.83479328-37.82478199-6.61520491-48.64809662 9.41487147-10.83479328 16.03581625-6.61520491 37.81330333 9.42061135 48.64809661 119.30669876 80.60379253 190.53579578 214.56082291 190.5357958 358.32988846 0 238.26559222-193.8428239 432.10841613-432.10841613 432.10841612S79.58510095 750.62372866 79.58510095 512.35813758c0-143.77021424 71.22909701-277.72609593 190.53005588-358.32988849 16.03581625-10.83479328 20.25540465-32.61228035 9.42061136-48.64809661-10.8290545-16.03007636-32.60080166-20.24966587-48.64235672-9.41487146C92.27371314 189.61696972 9.51421113 345.27572653 9.51421113 512.35813758c0 276.90536513 225.27508946 502.18045459 502.1804546 502.18045458s502.18045459-225.27508946 502.18045458-502.18045458C1013.87397165 345.28146529 931.11446963 189.61696972 792.49362266 95.96527991z" fill="#1E1E1E" p-id="16611"></path><path d="M386.64744256 10.17768297c-19.34858318 0-35.03544548 15.68800986-35.03544548 35.03544547l0 34.18601739c0 19.34858318 15.68800986 35.03544548 35.03544546 35.03544547s35.03544548-15.68800986 35.03544548-35.03544547L421.68288802 45.21312844C421.68403556 25.86454417 405.99602574 10.17768297 386.64744256 10.17768297z" fill="#1E1E1E" p-id="16612"></path><path d="M636.74074021 10.17768297c-19.34858318 0-35.03544548 15.68800986-35.03544546 35.03544547l0 34.18601739c0 19.34858318 15.68800986 35.03544548 35.03544546 35.03544547s35.03544548-15.68800986 35.03544548-35.03544547L671.77618569 45.21312844C671.77618569 25.86454417 656.08817586 10.17768297 636.74074021 10.17768297z" fill="#1E1E1E" p-id="16613"></path><path d="M414.68773685 193.04337704c12.57382426 20.24392595 47.08469071 54.50340783 96.64534757 54.50340783 49.30927228 0 84.24255715-34.00350603 97.11253321-54.09361677 10.43533337-16.29753088 5.68542605-37.96711855-10.60636608-48.40245077-16.30900956-10.44681204-37.96711855-5.67968614-48.40245078 10.60636605-0.13659664 0.22268732-15.00846806 21.81766302-38.10371523 21.81766301-22.44440261 0-36.3933815-20.33460789-37.32775158-21.73157234-10.29299681-16.18389158-31.72267747-21.08761412-48.04316683-10.94843369C409.52115104 155.00853394 404.47509083 176.6092484 414.68773685 193.04337704z" fill="#1E1E1E" p-id="16614"></path><path d="M536.82509563 395.57217217c19.34858318 0 35.03544548-15.68800986 35.03544546-35.03544547L571.86054109 348.8570966c0-19.34858318-15.68800986-35.03544548-35.03544546-35.03544548s-35.03544548 15.68800986-35.03544547 35.03544548l0 11.67848144C501.78965017 379.88416232 517.47766001 395.57217217 536.82509563 395.57217217z" fill="#1E1E1E" p-id="16615"></path><path d="M624.22086566 687.69721401c-10.85201187-16.02433758-32.62375903-20.2267085-48.65383651-9.35173927l-41.66786783 28.22739804 37.5217428-235.4142699c2.2016242-13.79401609-4.00264096-27.5765524-15.79017045-35.07562141-11.77605081-7.49332912-26.89241938-7.28212046-38.45726155 0.55901507l-108.65441797 73.62471239c-16.02433758 10.85201187-20.20948991 32.63523883-9.35173929 48.6538365 10.85201187 16.02433758 32.64097761 20.22096858 48.65268785 9.35173927l41.66786785-28.23313681-37.52174278 235.41426991c-2.2016242 13.79401609 4.00264096 27.5765524 15.79017045 35.07562141 5.74281947 3.65483454 12.27767245 5.47421628 18.80678666 5.47421628 6.86544084 0 13.72629154-2.01337293 19.65047488-6.03323132l108.65441797-73.61897253C630.8877252 725.49789 635.07861743 703.71466303 624.22086566 687.69721401z" fill="#1E1E1E" p-id="16616"></path></svg>
          </i>
        </summary>
        <h6>支持平台及链接示例</h6>
        <ul>
          <li>bilibili - https://www.bilibili.com/video/<i>BV1Ec411z7j2</i></li>
          <li>bilibili直播 - https://live.bilibili.com/<i>00000000</i></li>
          <li>抖音视频 - https://www.douyin.com/video/<i>7446330035725749564</i></li>
          <li>西瓜视频 - https://www.ixigua.com/<i>7245325256414462497</i></li>
          <li>腾讯视频 - https://v.qq.com/x/cover/mzc002001f5d4ic/<i>s0955xkheix</i>.html</li>
          <li>优酷视频 - https://v.youku.com/v_show/id_<i>XNDY5MjcyNTcy</i>.html</li>
        </ul>考虑数据整洁，建议按格式复制并删除多余参数，标记颜色为必要参数<h6>视频方向说明</h6>
        <ul>
          <li>固定横屏(16 × 9) - 无论是在大屏和小屏时都固定横屏，适合横版的视频</li>
          <li>适应竖屏(9 × 18) - 大屏时适应横屏，小屏时适应竖屏，适合竖版的视频</li>
        </ul>
      </details>
      <input
        ref="inputRef"
        type="url"
        v-model.lazy="src"
        class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="输入链接，按回车确定"
        tabindex="-1"
        @focus="handleSetFocus"
      />
    </div>
    <div v-else class="group relative">
      <div class="contact-thyuu-embed-nav">
        <div class="contact-thyuu-embed-nav-start">
          <h5><i><IconVideo/></i>THYUU / 嵌入视频</h5>
        </div>
        <div class="contact-thyuu-embed-nav-end">
          <button @click="handleResetInit"
                  class="btn-sm btn-default btn" type="button">
            <span class="btn-content">更换</span>
          </button>
        </div>
      </div>
      <div class="contact-thyuu-embed-preview" >
        <thyuu-embed :class="`thyuu-video as-${size == null ? '' : size}`" :data-type="videoatts.type">
          <iframe :src="videoatts.src" loading="lazy" scrolling="no" referrerpolicy="unsafe-url" allow="autoplay; encrypted-media"
                  allowtransparency="true" allowfullscreen="true"></iframe>
        </thyuu-embed>
      </div>
    </div>
  </node-view-wrapper>
</template>
