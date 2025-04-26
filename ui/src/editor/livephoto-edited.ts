import {
  type Editor,
  isActive,
  Node,
  nodeInputRule,
  type Range,
  VueNodeViewRenderer,
  type EditorState,
  mergeAttributes
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import IconLivephoto from "@/icon/IconLivephoto.vue";
import LivephotoView from "@/editor/LivephotoView.vue";

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "thyuu-livephoto": {
      setLivephoto: (options: { photoURL: string,videoURL: string }) => ReturnType;
    };
  }
}

const LivephotoExtension = Node.create({
  name: "thyuu-livephoto",
  fakeSelection: true,

  group() {
    return "block";
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      photoURL: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("photo-url");
        },
        renderHTML(element) {
          return { "photo-url": element.photoURL };
        },
      },
      videoURL: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("video-url");
        },
        renderHTML(element) {
          return { "video-url": element.videoURL };
        },
      },
      photoARN: {
        default: 1.0,
        parseHTML: (element) => {
          return element.getAttribute("photo-arn");
        },
        renderHTML(element) {
          return { "photo-arn": element.photoARN };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "thyuu-livephoto",
      },
    ];
  },

  renderHTML({ node,HTMLAttributes }) {
    return ["thyuu-livephoto", mergeAttributes(HTMLAttributes)];
    
  },
  addCommands() {
    return {
      setLivephoto:
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
        find: /^\$thyuu-livephoto\$$/,
        type: this.type,
        getAttributes: (e) => ({ 
          src: e[1] 
        }),
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(LivephotoView);
  },

  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(IconLivephoto),
          title: "THYUU / 实况图片",
          keywords: ["thyuu-livephoto", "thyuu", "实况图片"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLivephoto({ photoURL: "", videoURL: "" })
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
            icon: markRaw(IconLivephoto),
            title: "THYUU / 实况图片",
            action: () => {
              editor
                .chain()
                .focus()
                .setLivephoto({ photoURL: "", videoURL: "" })
                .run();
            },
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "thyuu-livephoto-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, LivephotoExtension.name);
          },
          items: [
            {
              priority: 50,
              props: {
                icon: markRaw(MdiDeleteForeverOutline),
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(LivephotoExtension.name, editor);
                },
              },
            },
          ],
        };
      },
    }
  }


})
export default LivephotoExtension;
