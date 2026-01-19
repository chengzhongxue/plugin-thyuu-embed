<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import {computed, ref} from "vue";
import IconLivephoto from "@/icon/IconLivephoto.vue";
import {type AttachmentLike, utils} from "@halo-dev/ui-shared";
import {getAttachmentUrl} from "@/utils/attachment";
import IconAdd from "@/icon/IconAdd.vue";
import IconFilm from "@/icon/IconFilm.vue";
import IconImg from "@/icon/IconImg.vue";
import IconInfo from "@/icon/IconInfo.vue";
import { VDropdown } from "@halo-dev/components";
import CustomLinkDropdownItem from "@/components/CustomLinkDropdownItem.vue";
import UploadDropdownItem from "@/components/UploadDropdownItem.vue";
import AttachmentDropdownItem from "@/components/AttachmentDropdownItem.vue";

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

async function onAttachmentReplace(type: string, attachments: AttachmentLike[]) {
  if (attachments.length > 0) {
    const attachment = attachments[0];
    const attachmentAttr = getAttachmentUrl(attachment);
    if (type == 'image') {
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


const canUploadAttachment = computed(() => {
  return utils.permission.has([
    "system:attachments:manage",
    "uc:attachments:manage",
  ]);
});

const canViewAttachment = computed(() => {
  return utils.permission.has([
    "system:attachments:view",
    "uc:attachments:manage",
  ]);
});

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
          class="thyuu-upbtn"
        >
          <template #default="{ shown }">
            <button type="button" :class="`components-button thyuu-upbtn has-obj`" >
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
            <UploadDropdownItem
              v-if="canUploadAttachment"
              :accepts="supportImageTypes"
              @selected="(attachments: AttachmentLike[]) => onAttachmentReplace('image', attachments)"
            />
            <AttachmentDropdownItem
              v-if="canViewAttachment"
              :accepts="supportImageTypes"
              @selected="(attachments: AttachmentLike[]) => onAttachmentReplace('image', attachments)"
            />
            <CustomLinkDropdownItem
              :url="photoURL"
              @submit="(url: string) => onLinkReplace('image', url)"
            />
          </template>
        </VDropdown>

        <VDropdown
          :dispose-timeout="null"
          class="thyuu-upbtn"
        >
          <template #default="{ shown }">
            <button type="button" :class="`components-button thyuu-upbtn not-obj` ">
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
            <UploadDropdownItem
              v-if="canUploadAttachment"
              :accepts="supportVideoTypes"
              @selected="(attachments: AttachmentLike[]) => onAttachmentReplace('video', attachments)"
            />
            <AttachmentDropdownItem
              v-if="canViewAttachment"
              :accepts="supportVideoTypes"
              @selected="(attachments: AttachmentLike[]) => onAttachmentReplace('video', attachments)"
            />
            <CustomLinkDropdownItem
              :url="videoURL"
              @submit="(url: string) => onLinkReplace('video', url)"
            />
          </template>
        </VDropdown>
      </div>
    </div>
  </node-view-wrapper>
</template>
