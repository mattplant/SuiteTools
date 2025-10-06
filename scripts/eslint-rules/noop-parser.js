module.exports = {
  parseForESLint(text) {
    return {
      ast: {
        type: "Program",
        body: [],
        sourceType: "script",
        tokens: [],
        comments: [],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 0 },
        },
        range: [0, 0],
      },
      scopeManager: null,
      visitorKeys: {},
    };
  },
};
