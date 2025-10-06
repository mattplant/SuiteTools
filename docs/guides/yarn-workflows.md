# 🛠️ Yarn Workflows

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

Defines the **standard workflows** for using Yarn in the SuiteTools monorepo, ensuring clean, reproducible dependencies and a smooth onboarding experience.

This is the **practical guide** for applying the governance rules in [Yarn Dependencies](../governance/standards/yarn-dependencies.md) and the baseline configuration in [Yarn Foundations](../governance/standards/yarn-core.md).

Covers **day‑to‑day operational steps** for working with Yarn in SuiteTools:

- Common Yarn commands
- When and how to install dependencies at the root
- Typical contributor workflow from install to PR
- Local self‑checks to avoid CI failures
- Deduplication workflow and troubleshooting

Does **not** cover:

- Baseline Yarn configuration or conventions — see [yarn-core.md](./yarn.md)
- Dependency governance rules or enforcement policies — see [yarn-dependencies.md](../governance/standards/yarn-dependencies.md)

---

## 📋 Basic Commands

```bash
# Install all dependencies
yarn install

# Run a script in a workspace
yarn workspace <workspace-name> run <script>

# Run a script in all workspaces
yarn workspaces foreach run <script>
```

### Checking for Dependency Issues

Run these checks locally before committing to catch issues early.

```bash
# Check for missing or extraneous dependencies
yarn constraints

# Check for duplicate versions
yarn dedupe --check
```

### Adding Dependencies

```bash
# Add a dependency to a specific workspace
yarn workspace <workspace-name> add <package>@<version>

# And as a dev dependency
yarn workspace <workspace-name> add -D <package>@<version>
```

### Removing Dependencies

```bash
# Remove a dependency from a workspace
yarn workspace <workspace-name> remove <package>
```

---

## 🗂️ Root-Level Installs

Use `-W` (root install) **only** for dependencies that meet one of these criteria:

- **Truly root‑scoped dev tooling**
  - Linters/formatters: `eslint`, `prettier`, `eslint-plugin-*`
  - Repo‑wide build/release tools: `changesets`, `turbo`, `nx`
  - Common config packages: `@typescript-eslint/*`, `eslint-plugin-jsdoc`

- **Executed from the root** in CI or scripts

- **Must be single‑versioned** for consistency
  _e.g., TypeScript compiler, commit hooks_

**Examples:**

```bash
yarn add -W -D eslint prettier
```

**Do not**:

- ❌ Install runtime dependencies at the root
- ❌ Add workspace‑specific tooling at the root
- ❌ Install a dependency at the root to “share” it across workspaces instead of declaring it where it’s used
- ❌ Use `-W` to bypass PnP errors instead of fixing the underlying dependency declaration

---

## 👩‍💻 Typical Contributor Workflow

These steps are designed to save you time by catching issues early which is faster for everyone.

1. **Sync dependencies**

   ```bash
   yarn install
   ```

2. **Make changes** in the relevant workspace.

   - Follow workspace boundaries and dependency rules documented in [`yarn-dependencies.md`](../governance/standards/yarn-dependencies.md).
   - Keep changes scoped to a single workspace unless the task explicitly spans multiple.
   - Update `package.json` only when adding, removing, or upgrading dependencies.
   - Maintain commit hygiene — group related changes together and avoid mixing dependency updates with unrelated code changes.

3. **Run tests and linting**

   ```bash
   yarn workspaces foreach run lint
   yarn workspaces foreach run test
   ```

4. **Before you commit** — self‑check:
   - ✅ All dependency changes follow [`yarn-dependencies.md`](../governance/standards/yarn-dependencies.md)
   - ✅ No workspace boundaries violated
   - ✅ `yarn constraints` passes locally
   - ✅ `yarn dedupe --check` passes locally
   - ✅ No unexpected `yarn.lock` drift
   - ✅ All linting passes locally

5. **Commit lockfile changes** if dependencies were added or removed.
   - Keep lockfile updates in the same commit as the dependency change for traceability.

6. **Push and open a PR**
   - Reference any related issues in the PR description.

---

## 🔄 Deduplication Workflow

> See [Yarn Dependencies](../governance/standards/yarn-dependencies.md) for the governance rules that make this workflow mandatory.

Deduplication reduces bundle size, avoids patch drift, and keeps dependency trees predictable.
Always prefer the highest compatible version to minimize maintenance overhead.

- Run `yarn dedupe` regularly to minimize duplicate versions.
- Prefer the **highest compatible version** across all workspaces.
- Review `yarn.lock` changes in pull requests to catch unexpected version drift.
- Align dependency ranges in `package.json` files to reduce the chance of drift.

### When to Run Deduplication

- **Before committing** changes that add or update dependencies.
- **After merging** branches that may have modified `yarn.lock`.
- **Periodically** as part of maintenance to keep the dependency tree clean.
- **In CI** as a pre‑merge check to enforce consistency.

### Examples

Deduplicate all dependencies to their highest compatible version:

```bash
yarn dedupe
```

A specific package:

```bash
yarn dedupe lodash
```

### Debugging Tips

- `yarn why <package>` - trace multiple versions and resolution paths
- `yarn constraints` - enforce deduplication or version alignment rules
- Inspect `yarn.lock` for unexpected version splits or resolution drift
- `yarn up <package>` - upgrade and unify versions across workspaces
- `yarn dedupe` - collapse redundant versions (especially after upgrades)
- `yarn workspaces list --verbose` - verify workspace boundaries and locations
- `yarn workspaces focus --production` - test workspace isolation

---

## 🐞 Troubleshooting

| Issue                              | Likely Cause                                | Resolution |
|------------------------------------|---------------------------------------------|------------|
| Constraints check fails            | Dependency rule violation                   | Update `package.json` per [`yarn-dependencies.md`](../governance/standards/yarn-dependencies.md) and reinstall |
| Duplicate versions in `yarn.lock`  | Misaligned dependency ranges                | Run `yarn dedupe` and align ranges in `package.json` |
| Version misalignment detected      | Dependency range mismatch across workspaces | Align versions in all `package.json` files, then rerun `yarn dedupe` |
| `Module not found`                 | Missing dependency declaration              | Add to `dependencies` in the correct workspace and reinstall |
| Unexpected workspace coupling      | Cross‑workspace import without declaration  | Declare the dependency or refactor to respect workspace boundaries |
| Tooling fails with PnP             | Tool not PnP‑compatible                     | Use `yarn unplug <package>` |
| Lockfile merge conflicts           | Concurrent dependency changes               | Re‑run `yarn install` and commit the updated lockfile |
| Workspace not found                | Typo in workspace name or missing config    | Check `package.json` and `workspaces` field for correct name and path |

## Conclusion

Following these workflows keeps contributions aligned with SuiteTools’ governance standards, prevents common dependency issues, and streamlines reviews.

Use this guide alongside these other documents to ensure every change is compliant, maintainable, and easy to integrate.

- [Yarn Foundations](.//yarn.md)
- [Yarn Dependencies](../governance/standards/yarn-dependencies.md)
