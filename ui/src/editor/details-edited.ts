import {
  type Editor,
  isActive,
  Node,
  nodeInputRule,
  type Range,
  type EditorState,
  mergeAttributes,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import { ToolboxItem } from "@halo-dev/richtext-editor";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "../utils/delete-node";
import DetailsContent from './details-content';
import DetailsSummary from './details-summary';
import PajamasDetailsBlock from '~icons/pajamas/details-block?width=128px&height=128px';
import TablerLayoutBottombarCollapse from '~icons/tabler/layout-bottombar-collapse'
import TablerLayoutBottombarCollapseFilled from '~icons/tabler/layout-bottombar-collapse-filled'

declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    "details": {
      setDetails: (options: { content: string; summary?: string; open?: boolean }) => ReturnType;
    };
  }
}

const DetailsExtension = Node.create({
  name: "details",
  content: "detailsSummary detailsContent",
  isolating: true,
  fakeSelection: true,

  addExtensions() {
    return [
      DetailsSummary,
      DetailsContent
    ];
  },

  group() {
    return "block";
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'block-details',
      },
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(PajamasDetailsBlock),
          title: "折叠内容",
          keywords: ["details", "thyuu"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setDetails({ content: '', summary: '' })
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
            icon: markRaw(PajamasDetailsBlock),
            title: "折叠内容",
            action: () => {
              editor
                .chain()
                .focus()
                .setDetails({ content: '', summary: '' })
                .run();
            },
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "details-bubble-menu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, DetailsExtension.name);
          },
          items: [
            {
              priority: 45,
              props: {
                title:
                  editor.getAttributes(DetailsExtension.name).open === true
                    ? "收起"
                    : "展开",
                isActive: () => {
                  return editor.getAttributes(DetailsExtension.name).open  === true;
                },
                icon: markRaw(
                  editor.getAttributes(DetailsExtension.name).open === true
                    ? TablerLayoutBottombarCollapse
                    : TablerLayoutBottombarCollapseFilled
                ),
                action: () => {
                  const open = editor.getAttributes(DetailsExtension.name).open;
                  editor.commands.updateAttributes(DetailsExtension.name, {
                    open: open === false ? true : false
                  });
                },
              },
            },
            {
              priority: 50,
              props: {
                icon: markRaw(MdiDeleteForeverOutline),
                title: "删除",
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(DetailsExtension.name, editor);
                },
              },
            },
          ],
        };
      },
      getDraggable() {
        return true;
      },
    };
  },

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: element => element.hasAttribute('open'),
        renderHTML: attributes => ({
          open: attributes.open ? true : undefined
        })
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "details",
        getAttrs: node => ({
          open: (node as HTMLElement).hasAttribute('open')
        })
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "details",
      mergeAttributes({
        class: 'block-details',
        open: node.attrs.open ? true : undefined
      }, HTMLAttributes),
      0
    ];
  },

  addCommands() {
    return {
      setDetails:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: { open: true },
              content: [
                {
                  type: "detailsSummary",
                  content: options.summary ? [{ type: 'text', text: options.summary }] : []
                },
                {
                  type: "detailsContent",
                  content: [
                    {
                      type: "paragraph",
                      content: options.content ? [
                        {
                          type: "text",
                          text: options.content
                        }
                      ] : []
                    }
                  ]
                }
              ]
            });
          },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$details\$$/,
        type: this.type,
        getAttributes: (e) => ({}),
      }),
    ];
  },
})

export default DetailsExtension;
