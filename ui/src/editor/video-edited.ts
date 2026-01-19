import {
  type Editor,
  isActive,
  Node,
  nodeInputRule,
  type Range,
  VueNodeViewRenderer,
  type EditorState, 
  mergeAttributes,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiShare from "~icons/mdi/share";
import BlockActionSeparator from "../components/BlockActionSeparator.vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import VideoView from "./VideoView.vue";
import IconVideo from "@/icon/IconVideo.vue";

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "thyuu-video": {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const VideoExtension = Node.create({
  name: "thyuu-video",
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
        default: "",
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
        tag: "thyuu-video",
      },
    ];
  },

  renderHTML({HTMLAttributes }) {
    return ["thyuu-video", mergeAttributes(HTMLAttributes)];
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
        find: /^\$thyuu-video\$$/,
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
          keywords: ["thyuu-video", "thyuu", "嵌入视频"],
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
          pluginKey: "thyuu-video-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, VideoExtension.name);
          },
          items: [
            {
              priority: 20,
              props: {
                icon: markRaw(MdiShare),
                title: "打开链接",
                action: () => {
                  let src = editor.getAttributes(VideoExtension.name).src;
                  const m = src.match(/<iframe[^>]*?\ssrc=["']([^"']+)["']/i)
                  window.open(m ? m[1] : src, "_blank");
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
