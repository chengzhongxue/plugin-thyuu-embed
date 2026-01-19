<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, ref} from "vue";
import IconLivephoto from "@/icon/IconLivephoto.vue";
import type {AttachmentLike} from "@halo-dev/console-shared";
import {getAttachmentUrl} from "@/utils/attachment";
import IconAdd from "@/icon/IconAdd.vue";
import IconFilm from "@/icon/IconFilm.vue";
import IconImg from "@/icon/IconImg.vue";
import IconInfo from "@/icon/IconInfo.vue";
import { VDropdown, VDropdownItem } from "@halo-dev/components";
import CustomLinkDropdownItem from "@/components/CustomLinkDropdownItem.vue";

const props = defineProps<NodeViewProps>();

const photoURL = computed({
  get: () => {
    return props.node?.attrs.photoURL;
  },
  set: (photoURL: string) => {
    props.updateAttributes({ photoURL: photoURL });
  },
});

const videoURL = computed({
  get: () => {
    return props.node?.attrs.videoURL;
  },
  set: (videoURL: string) => {
    props.updateAttributes({ videoURL: videoURL });
  },
});

const  mediaType = ref<string>("image")

const photoARN = computed({
  get: () => {
    return props.node?.attrs.photoARN;
  },
  set: (photoARN: string) => {
    props.updateAttributes({ photoARN: photoARN });
  },
});

const supportImageTypes: string[] = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
]

const supportVideoTypes: string[] = ["video/*"];

const attachmentSelectorModal = ref(false)

function onAttachment (type: string) {
  mediaType.value = type
  attachmentSelectorModal.value = true
}

function onLinkReplace(type: string, url: string) {
  if(type === 'image') {
    photoURL.value = url;
  }else {
    videoURL.value = url;
  }
}

function getImageDimensions(url: string): Promise<{width: number, height: number}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      resolve({
        width: 1,
        height: 1
      });
    };
    img.src = url;
  });
}

async function onAttachmentSelect (attachments: AttachmentLike[]) {
  if (attachments.length > 0) {
    const attachment = attachments[0];
    const attachmentAttr = getAttachmentUrl(attachment);
    if (mediaType.value == 'image') {
      photoURL.value = attachmentAttr.url || ""
      if (photoURL.value) {
        const dimensions = await getImageDimensions(photoURL.value);
        let aspectRatio = Number(dimensions.width) / Number(dimensions.height);
        photoARN.value = aspectRatio.toString();
      }
    }else {
      videoURL.value = attachmentAttr.url || ""
    }
  }
}



</script>

<template>
  <node-view-wrapper as="div" class="contact-thyuu-embed-container"
                     :class="{
        'contact-thyuu-embed-container--selected': selected,
      }">
    <div class="thyuu-embed-block thyuu-embed-livephoto">
      <details class="thyuu-embed-refer">
        <summary>
          <h5><i><IconLivephoto/></i>THYUU / 实况图片</h5>
          <i>
            <IconInfo/>
          </i>
        </summary>
        <h6>区块说明</h6>
        <p>Live Photo 是苹果开发的动态影像格式，通过视频与图片的封装组合，实现按压查看动态效果的创新交互。由于 web 网页端的浏览器并不支持 Live Photo 格式，因此需要同时上传静图和视频，通过前端按同尺寸融合实现实况。</p><h6>区块规范</h6>
        <ul>
          <li>资源要求：必须同时提供<i>静图</i>与<i>视频</i></li>
          <li>视频时长：限制 <i>1.5-3秒</i></li>
        </ul>
        <h6>视频格式</h6>
        <ul>
          <li>推荐 <i>WEBM</i>：文件较小，兼容较好</li>
          <li>建议 <i>MP4</i>：文件较 WEBM 大，兼容最好</li>
          <li>不建议 <i>MOV</i>：文件较大，兼容一般</li>
          <li>不建议 <i>HEVC</i>：文件最小，兼容最差</li>
          <li>在线格式转换工具推荐：<a href="https://cloudconvert.com/" target="_blank">cloudconvert.com</a></li>
        </ul>
      </details>
      <div class="thyuu-embed-panel thyuu-media-upload">
        <VDropdown
          :dispose-timeout="null"
        >
          <template #default="{ shown }">
            <button type="button" :class="`components-button ${ photoURL ? 'thyuu-upbtn icon-image has-obj' : 'thyuu-upbtn icon-add not-obj'}`" >
              <i>
                <IconImg v-if="photoURL" />
                <IconAdd v-else />
              </i>
              <template v-if="!photoURL">
                选择图片
              </template>
              <img v-else class="media-obj" :src="photoURL"/>
            </button>
          </template>
          <template #popper>
            <VDropdownItem @click="onAttachment('image')">
              从附件库选择
            </VDropdownItem>
            <CustomLinkDropdownItem
              :url="photoURL"
              @submit="(url: string) => onLinkReplace('image', url)"
            />
          </template>
        </VDropdown>

        <VDropdown
          :dispose-timeout="null"
        >
          <template #default="{ shown }">
            <button type="button" :class="`components-button ${ videoURL ? 'thyuu-upbtn icon-film has-obj' : 'thyuu-upbtn icon-add not-obj'}` ">
              <i>
                <IconFilm v-if="videoURL" />
                <IconAdd v-else />
              </i>
              <template v-if="!videoURL">
                选择视频
              </template>
              <video v-else class="media-obj" :src="videoURL"/>
            </button>
          </template>
          <template #popper>
            <VDropdownItem @click="onAttachment('video')">
              从附件库选择
            </VDropdownItem>
            <CustomLinkDropdownItem
              :url="videoURL"
              @submit="(url: string) => onLinkReplace('video', url)"
            />
          </template>
        </VDropdown>
      </div>
    </div>
    
    <AttachmentSelectorModal
      v-model:visible="attachmentSelectorModal"
      :min="1"
      :max="1"
      :accepts="mediaType == 'image' ? supportImageTypes : supportVideoTypes"
      @select="onAttachmentSelect"
    />
  </node-view-wrapper>
</template>
