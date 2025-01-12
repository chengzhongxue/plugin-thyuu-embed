import {
  type Editor,
  isActive,
  Node,
  nodeInputRule,
  type Range,
  VueNodeViewRenderer,
  type EditorState, getNodeAttributes,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiShare from "~icons/mdi/share";
import BlockActionSeparator from "../components/BlockActionSeparator.vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import VideoView from "./VideoView.vue";
import IconVideo from "@/icon/IconVideo.vue";
import VideoViewBubbleMenuItem from "@/components/VideoViewBubbleMenuItem.vue";
import videoViewTypes from "@/editor/video-view-type";
import {thyuuShortcodeVideo} from "@/utils/video";

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "thyuu-embed-video": {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const VideoExtension = Node.create({
  name: "thyuu-embed-video",
  fakeSelection: true,

  group() {
    return "block";
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("src");
        },
        renderHTML(element) {
          return { src: element.src };
        },
      },
      size: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.getAttribute('size');
        },
        renderHTML(element) {
          return { size: element.size };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "thyuu-embed-video",
      },
    ];
  },

  renderHTML({ node,HTMLAttributes }) {
    var src = node?.attrs.src;
    var size = node?.attrs.size;
    const video = thyuuShortcodeVideo(src);
    if (video == null || video == undefined) {
      return [
        'thyuu-embed-video',
        { class: 'thyuu-noone icon-film', src: src,size: size},
        '链接无法识别',
        ['br'],
        src || '',
      ];
    }else {
      return [
        "thyuu-embed-video",
        { class: "thyuu-video as-"+(size == null ? '' : size), 'data-type': video.type,src: src,size: size},
        ["iframe",
          {
            src: video.src,
            loading:"lazy",
            scrolling:"no",
            referrerpolicy:"unsafe-url",
            allow:"autoplay; encrypted-media",
            allowtransparency:"true",
            allowfullscreen:"true"
          }
        ]
      ];
    }
    
  },
  addCommands() {
    return {
      setVideo:
        (options) =>
          ({ commands }) => {
            return commands.insertContent([
              {
                type: this.name,
                attrs: options,
              },
              { 
                type: "paragraph", 
                content: "" 
              },
            ]);
          },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$thyuu-embed-video\$$/,
        type: this.type,
        getAttributes: (e) => ({ 
          src: e[1] 
        }),
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(VideoView);
  },

  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(IconVideo),
          title: "THYUU / 嵌入视频",
          keywords: ["thyuu-embed-video", "thyuu", "嵌入视频"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setVideo({ src: "" })
              .run();
          },
        };
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return {
          priority: 59,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(IconVideo),
            title: "THYUU / 嵌入视频",
            action: () => {
              editor
                .chain()
                .focus()
                .setVideo({ src: "" })
                .run();
            },
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "thyuu-embed-video-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, VideoExtension.name);
          },
          items: [
            {
              priority: 20,
              component: markRaw(VideoViewBubbleMenuItem),
              props: {
                type: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, VideoExtension.name);
                  return videoViewTypes.find((type) => type.key == attr.size) || videoViewTypes[0];
                },
              },
            },
            {
              priority: 30,
              props: {
                icon: markRaw(MdiShare),
                title: "打开链接",
                action: () => {
                  window.open(editor.getAttributes(VideoExtension.name).src, "_blank");
                },
              },
            },
            {
              priority: 40,
              component: markRaw(BlockActionSeparator),
            },
            {
              priority: 50,
              props: {
                icon: markRaw(MdiDeleteForeverOutline),
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(VideoExtension.name, editor);
                },
              },
            },
          ],
        };
      },
    }
  }


})
export default VideoExtension;
