# Third-party notices generator

Generates [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md) at the repository root.

```sh
yarn generate-third-party-notices
```

| Path | Purpose |
| --- | --- |
| `generate.sh` | The generator. Resolves its own paths, so it runs from any directory. |
| `overrides/*.md` | Entries for packages the plugin cannot see. Appended verbatim. |

📖 **Full documentation: [Third-Party Notices Guide](../../docs/guides/third-party-notices.md)** — scope and why transitive dependencies are included, the rules for override entries, when to regenerate, and how to verify a run.
