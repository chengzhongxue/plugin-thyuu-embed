import { mergeAttributes, Node } from "@halo-dev/richtext-editor";

const DetailsSummary = Node.create({
  name: "detailsSummary",
  content: "text*",
  isolating: true,
  fakeSelection: false,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'details-summary',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "summary",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "summary",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

export default DetailsSummary;
