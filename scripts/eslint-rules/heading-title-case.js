const { titleCase } = require("title-case");
const { remark } = require("remark");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce Title Case in Markdown headings",
    },
    fixable: "code",
    schema: [],
    messages: {
      notTitleCase: 'Heading "{{ text }}" is not in Title Case.',
    },
  },

  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();
        const lines = text.split("\n");
        const tree = remark().parse(text);

        for (const node of tree.children) {
          if (node.type !== "heading") continue;

          const lineIndex = node.position.start.line - 1;
          const previousLine = lines[lineIndex - 1]?.trim();

          if (previousLine === "<!-- heading-title-case: ignore -->") {
            continue; // Skip this heading
          }

          const headingText = node.children
            .filter((c) => c.type === "text")
            .map((c) => c.value)
            .join(" ")
            .trim();

          const expected = titleCase(headingText);

          if (headingText !== expected) {
            context.report({
              loc: {
                start: { line: node.position.start.line, column: 0 },
                end: {
                  line: node.position.start.line,
                  column: headingText.length,
                },
              },
              messageId: "notTitleCase",
              data: { text: headingText },
            });
          }
        }
      },
    };
  },
};
