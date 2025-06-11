import { mergeAttributes, Node } from "@halo-dev/richtext-editor";

const DetailsContent = Node.create({
  name: "detailsContent",
  content: "block+",
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type=detailsContent]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default DetailsContent;
