import type {Editor} from "@halo-dev/richtext-editor";
import VideoExtension from "@/editor/video-edited";

export interface VideoViewType {
  key: string;
  title: string;
  action: ({ editor }: { editor: Editor }) => void;
}

const videoViewTypes: VideoViewType[] = [
  {
    key: '',
    title: '选择视频方向',
    action: ({ editor }) => {
      editor.commands.updateAttributes(VideoExtension.name, {
        size: '',
      });
    },
  },
  {
    key: 'lr',
    title: '固定横屏',
    action: ({ editor }) => {
      editor.commands.updateAttributes(VideoExtension.name, {
        size: 'lr',
      });
    },
  },
  {
    key: 'tb',
    title: '适应竖屏',
    action: ({ editor }) => {
      editor.commands.updateAttributes(VideoExtension.name, {
        size: 'tb',
      });
    },
  },
];
export default videoViewTypes;
