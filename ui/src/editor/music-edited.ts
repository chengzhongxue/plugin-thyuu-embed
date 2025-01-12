import {
  type Editor,
  isActive,
  Node,
  nodeInputRule,
  type Range,
  VueNodeViewRenderer,
  type EditorState,
  type DOMOutputSpec
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiShare from "~icons/mdi/share";
import BlockActionSeparator from "../components/BlockActionSeparator.vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import IconMusic from "@/icon/IconMusic.vue";
import {thyuuShortcodeMusic} from "@/utils/music";
import MusicView from "@/editor/MusicView.vue";

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "thyuu-embed-music": {
      setMusic: (options: { src: string }) => ReturnType;
    };
  }
}

const MusicExtension = Node.create({
  name: "thyuu-embed-music",
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
        tag: "thyuu-embed-music",
      },
    ];
  },

  renderHTML({ node,HTMLAttributes }) {
    var src = node?.attrs.src;
    const music = thyuuShortcodeMusic(src);
    if (music == null || music == undefined) {
      return [
        'thyuu-embed-music',
        { class: 'thyuu-noone icon-music', src: src},
        '链接无法识别',
        ['br'],
        src || '',
      ];
    }else {
      let iframe: DOMOutputSpec =[
        "thyuu-embed-music",
        { class: "thyuu-music", 'data-type': music.type,src: src},
        [
          "iframe",
          {
            src: music.src,
            loading:"lazy",
            allowtransparency:"true"
          }
        ],
      ];
      if (music.type == 'nn' || music.type == 'nn_on_app') {
        iframe = [
          "thyuu-embed-music",
          { class: "thyuu-music", 'data-type': music.type,src: src},
          [
            "div",
            {style:'margin:-11px'},
            [
              "iframe",
              {
                src: music.src+'&height=66',
                loading:"lazy",
                allowtransparency:"true"
              }
            ],
          ],
        ];
      }

      if (music.type == 'nn_lists' || music.type == 'nn_album' || music.type == 'nn_lists_on_app' || music.type == 'nn_album_on_app') {
        iframe = [
          "thyuu-embed-music",
          { class: "thyuu-music", 'data-type': music.type,src: src},
          [
            "div",
            {style:'margin:-11px'},
            [
              "iframe",
              {
                marginwidth:'0',
                marginheight:'0',
                width:'330',
                height:'450',
                src: music.src+'&height=430',
                loading:"lazy",
                allowtransparency:"true"
              }
            ],
          ],
        ];
      }
      
      
      return iframe;
    }
    
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
        find: /^\$thyuu-embed-music\$$/,
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
          keywords: ["thyuu-embed-music", "thyuu", "嵌入音乐"],
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
          pluginKey: "thyuu-embed-music-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, MusicExtension.name);
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
