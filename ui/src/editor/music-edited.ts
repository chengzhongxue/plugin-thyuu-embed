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
import MdiShare from "~icons/mdi/share";
import BlockActionSeparator from "../components/BlockActionSeparator.vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import IconMusic from "@/icon/IconMusic.vue";
import MusicView from "@/editor/MusicView.vue";

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "thyuu-music": {
      setMusic: (options: { src: string }) => ReturnType;
    };
  }
}

const MusicExtension = Node.create({
  name: "thyuu-music",
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "thyuu-music",
      },
    ];
  },

  renderHTML({ node,HTMLAttributes }) {
    return ["thyuu-music", mergeAttributes(HTMLAttributes)];
    
  },
  addCommands() {
    return {
      setMusic:
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
        find: /^\$thyuu-music\$$/,
        type: this.type,
        getAttributes: (e) => ({ 
          src: e[1] 
        }),
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(MusicView);
  },

  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(IconMusic),
          title: "THYUU / 嵌入音乐",
          keywords: ["thyuu-music", "thyuu", "嵌入音乐"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setMusic({ src: "" })
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
            icon: markRaw(IconMusic),
            title: "THYUU / 嵌入音乐",
            action: () => {
              editor
                .chain()
                .focus()
                .setMusic({ src: "" })
                .run();
            },
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "thyuu-music-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, MusicExtension.name);
          },
          options: {
            placement: "top-start",
          },
          items: [
            {
              priority: 30,
              props: {
                icon: markRaw(MdiShare),
                title: "打开链接",
                action: () => {
                  window.open(editor.getAttributes(MusicExtension.name).src, "_blank");
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
                  deleteNode(MusicExtension.name, editor);
                },
              },
            },
          ],
        };
      },
    }
  }


})
export default MusicExtension;
