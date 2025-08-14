# SuiteTools Commit Message Template

Save time by starting your draft commit message as you work instead of scrambling to reconstruct your changes at commit time.

It also helps ensure your final commit message is complete and structured. Commit clarity improves traceability, onboarding, and architectural enforcement.

> **Important:**
> Save this template as `commit-draft.md` in your project directory and update it as you work.

---

## Best Practices

### Writing Style Tips

- Prefer **descriptive summaries** over clever phrasing
- Use **bullet points that start with verbs** (e.g. Added, Refactored, Documented)
- Avoid vague terms like "fix" or "update" unless scoped clearly

### Commit Structure Guidelines

- Start your commit with a **clear, concise summary** so readers can quickly understand the change
- Use `BREAKING:` sparingly—but clearly—when APIs, types, or behaviors change
- Include the **issue number** if applicable

---

## Types and Scopes

Use this guide to choose meaningful `type` and `scope` labels for your commit messages. It reinforces clarity, supports tooling, and improves suite-wide traceability.

### Types

Describe the **nature of the change**.

| Type     | Purpose                                                       | Example Commit Title                                      |
|----------|---------------------------------------------------------------|-----------------------------------------------------------|
| feat     | Introduces a new feature or capability                        | `#42 feat(validation): infer type from custom schema`     |
| fix      | Corrects a bug or faulty behavior                             | `#18 fix(frontend): debounce search input`                |
| chore    | Routine tasks, tooling updates, dependency changes            | `#77 chore(build): bump esbuild to latest version`        |
| docs     | Updates documentation or inline comments                      | `#30 docs(shared): clarify schema validation rules`       |
| refactor | Internal restructuring without functional changes             | `#21 refactor(backend): isolate error parsing logic`      |

---

## Scopes

Specify the **affected area of the suite**.

| Scope     | Description                                                   |
|-----------|---------------------------------------------------------------|
| validation| Zod schemas, custom rules, inference utilities                |
| linting   | ESLint config, rulesets, boundary enforcement logic           |
| frontend  | UI rendering, user interaction, SuiteScript client-side code  |
| backend   | Server-side SuiteScript, metadata loading, record access      |
| shared    | Common types, utilities, or schema logic used across layers   |
| docs      | Contributor guides, onboarding materials, markdown updates    |
| infra     | CI/CD pipelines, environment setup, deployment configs        |
| build     | Bundling, release tasks, build config and tooling             |

---

## Commit Message Format

This format follows the Copilot-style template and adds GitHub issue numbers for traceability.

```txt
#<issue #> <type>(<scope>): <short summary>

<optional longer description>

<optional footer: related issues, breaking changes, etc.>
```

---

## Track Your Changes

> **Important:**
> Save this template as `commit-draft.md` in your project directory and update it as you work.

Save time by starting your draft commit message **below** as you work instead of scrambling to reconstruct your changes at commit time.

```text
#<issue #> <type>(<scope>): <short summary>

<optional longer description>

<optional footer: related issues, breaking changes, etc.>
```
