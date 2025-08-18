# SuiteTools Yarn Configuration and Usage

This guide explains how SuiteTools uses **Yarn Berry** (v3+) with **Plug’n’Play** and **workspaces** to manage its modular monorepo and streamline development workflows.

## Quick Primer: Yarn Berry & Plug’n’Play (PnP)

Yarn Berry departs from the traditional `node_modules` world. Instead, it uses **Plug’n’Play (PnP)** for dependency resolution, which brings several important benefits for SuiteTools:

- **No `node_modules` folder**
  Dependencies are stored in a global cache and mapped directly to your code — no deep folder trees.
- **Central resolution manifest**
  The `.pnp.cjs` file tells Node exactly where to find every `require()` or `import`, ensuring speed and consistency.
- **Strict dependency boundaries**
  Workspaces can only import packages explicitly declared in their own `package.json`. Missing declarations fail fast at runtime or build time.
- **Faster, deterministic installs**
  Install state is fully reproducible from `yarn.lock` + `.pnp.cjs`, avoiding OS‑specific quirks or symlink issues.
- **IDE integration**
  Yarn generates SDKs in `.yarn/sdks`, enabling editors like VS Code to provide autocompletion, type checking, and jump‑to‑definition for PnP projects.

**In practice for SuiteTools:**

- Enforced **modularity** between workspaces
- **Predictable builds** across environments
- Immediate feedback when dependencies are undeclared, mis‑scoped, or inconsistent

---

## Workspace Management

Yarn workspaces allow SuiteTools to manage dependencies at the monorepo level while maintaining strict isolation between individual workspaces.

For our workspace philosophy and enforcement rationale, see [Architecture: Workspaces](../docs/architecture.md#workspaces).

### Conventions

- Decide early which workspaces should be **first‑class packages** (versioned and maybe published) versus which are purely tooling and marked private.
- Keep published vs internal only packages clearly marked in the `private` field in `package.json`.

### Package Naming Best Practices

Naming conventions are crucial for clarity and consistency in a monorepo. SuiteTools follows these guidelines.

- **Use scoped packages**: All SuiteTools packages are scoped under the `@suiteworks` organization
- **Prefix with `suitetools-`**: This distinguishes SuiteTools packages from future `@suiteworks` projects
- **Use descriptive names**: Each package name should clearly indicate its purpose:
  - Short but descriptive: Aim for clarity without excessive length, balancing brevity with meaningfulness
  - Lowercase letters: Package names in lowercase to maintain consistency and avoid case sensitivity issues
  - Hyphens to separate words: Improves readability and follows common npm naming conventions
  - Avoid special characters: Stick to alphanumeric characters and hyphens
  - Avoid generic names: Ensures clarity and prevents conflicts with unrelated packages
- **Use `@suiteworks/suitetools-<scope>` for specific scopes**
  - Allows for clear separation of concerns and modularity
  - Core Product Packages
    - `@suiteworks/suitetools-shared` - for common types, utilities, and schema logic used across layers
    - TODO: move `/frontend` to `@suiteworks/suitetools-frontend` for UI rendering, user interaction, and SuiteScript client-side code
    - TODO: move `/backend` to `@suiteworks/suitetools-backend` for server-side SuiteScript, metadata loading, and record access
  - Engineering Support Packages
    - TODO: ??? `@suiteworks/suitetools-linting` for ESLint config, rulesets, and boundary enforcement logic
    - TODO: ??? `@suiteworks/suitetools-build` for bundling, release tasks, and build config and tooling

Use root directories for the following instead of packages.

- Documentation in `docs/` directory
- Place any infra scripts in `infra/` directory

### Enforcement Mechanisms

> TODO: Does this outline make sense? If so the implement it.

| Mechanism                  | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| Plug’n’Play (`.pnp.cjs`)  | Enforces resolution only through declared dependencies                      |
| `dependencies:` hygiene   | Contributors must declare all runtime deps in their own `package.json`      |
| `peerDependencies:` rules | Used for shared interfaces or plugin-style relationships                    |
| `devDependencies:` scope  | Dev-only tools must not leak into runtime or other workspaces               |
| `yarn constraints.pro`    | (Optional) Can define custom rules for workspace access                     |

## Workspace Management Best Practices

These apply to **all** workspaces in the SuiteTools monorepo — they are independent of install location and focus on dependency hygiene, boundaries, and predictability.

- **Declare all runtime dependencies explicitly** in your workspace's `package.json`
  - No implicit reliance on transitive deps from other workspaces
- **Scope devDependencies correctly** — keep them from leaking into runtime or into other workspaces
- **Use `peerDependencies` for shared interfaces** or plugin‑style extension points
- **Align versions for shared dependencies** to avoid resolution drift and lockfile churn
- **Run `yarn constraints`** regularly to enforce workspace rules and prevent accidental boundary breaks
- **Test workspace isolation** with:

  ```bash
  yarn workspaces focus --production
  ```

---

## 🧼 Deduplication Strategy

SuiteTools uses Yarn’s built-in deduplication capabilities to reduce install size, prevent resolution drift, and to ensure consistent behavior across environments.

### 🎯 Goals

- ✅ Minimize duplicate versions of shared dependencies
- ✅ Ensure consistent resolution across all workspaces
- ✅ Prevent accidental upgrades or version drift
- ✅ Maintain a clean, auditable `yarn.lock`

### Deduplication Best Practices

- Use `yarn dedupe` after adding or upgrading dependencies
- Always commit lockfile changes with clear context (e.g., dependency upgrade, deduplication)
- Avoid lockfile churn by aligning versions and ranges across workspaces
- Avoid mixing semver ranges (`^`, `~`, exact) for the same dependency
- Never manually edit `yarn.lock`

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

- Use `yarn why <package>` to trace multiple versions and resolution paths
- Use `yarn constraints` to enforce deduplication or version alignment rules
- Inspect `yarn.lock` for unexpected version splits or resolution drift
- Use `yarn up <package>` to upgrade and unify versions across workspaces
- Use `yarn dedupe` to collapse redundant versions (especially after upgrades)
- Use `yarn workspaces list --verbose` to verify workspace boundaries and locations

---

## Configuration

Configuration for SuiteTools is managed through the root `package.json` and Yarn’s configuration files. This setup defines workspaces, dependencies, and custom scripts for common tasks.

### Root `package.json`

The root `package.json` serves as the entry point for SuiteTools, defining workspaces and shared dependencies.

### Yarn's Configuration Files

```plaintext
SuiteTools root
├── .pnp.cjs         # Plug'n'Play configuration file
├── .pnp.loader.mjs  # Plug'n'Play loader for Node.js
├── .yarn/           # Yarn directory
│   ├── plugins/          # Yarn plugins for custom functionality
│   ├── sdks/             # SDKs for IDE integration
│   ├── unplugged/        # Unplugged packages for overrides
│   ├── install-state.gz  # Yarn install state
├── .yarnrc.yml      # Yarn configuration
└── .yarn.lock       # Lockfile for dependency versions
```

#### Plug'n'Play Configuration Files

##### `.pnp.cjs`

This is the Plug’n’Play runtime manifest generated by Yarn. It maps every package to its physical location and enforces dependency boundaries.

##### `.pnp.loader.mjs`

This loader enables Node.js to resolve modules using the PnP API defined in `.pnp.cjs`. It’s automatically used when running scripts or tools that rely on Node’s module resolution.

### Yarn's Directory

The `.yarn/` directory contains Yarn-specific files and directories.

#### `.yarn/plugins`

Contains Yarn plugins that extend functionality.

**Notable plugins:**

- `@yarnpkg/plugin-licenses`: Generates `THIRD_PARTY_LICENSES.md` listing third-party packages and their licenses.

> ✅ TODO: Investigate whether `@yarnpkg/plugin-typescript` would be beneficial for TypeScript support.

---

##### `.yarn/sdks`

Provides SDKs for VS Code to support autocompletion, type checking, and workspace-aware resolution.

---

##### `.yarn/unplugged`

Contains packages that have been "unplugged" from PnP for manual patching, inspection, or compatibility reasons. These are extracted from the cache and stored here temporarily.

Since our linting and formatting tools (ESLint and Prettier) do not fully support Yarn's Plug’n’Play out of the box, we needed to unplug them for compatibility.

##### `.yarn/install-state.gz`

Stores the install state, including metadata about installed packages and their versions. This ensures consistent behavior across environments and supports reproducible installs.

### `.yarnrc.yml`

The main configuration file for Yarn which defines the behavior of the package manager across the monorepo.

#### Key Settings

| Setting                     | Purpose                                                                 |
|----------------------------|-------------------------------------------------------------------------|
| `nodeLinker: pnp`          | Enables Plug’n’Play for strict dependency resolution (no `node_modules`) |
| `enableGlobalCache: false` | Ensures all cache is local to the repo for reproducibility              |
| `nmMode: hardlinks-local`  | (Optional) Enables hybrid mode for tooling compatibility                |
| `plugins:`                 | Lists Yarn plugins used (e.g. `workspace-tools`, `patch`, `interactive-tools`) |

### `.yarn.lock`

The lockfile is automatically generated by Yarn and contains the exact versions of all dependencies used in the project. It ensures that installs are reproducible across different environments.

The `yarn.lock` file is a critical artifact for reproducibility. SuiteTools treats it as a source of truth for dependency resolution.

### Custom Scripts

- `yarn reset`: Clears Yarn caches and restores a clean install state.

---

## Usage

The rules below cover where and how to install dependencies, differentiating between workspace‑scoped and root‑scoped installs.

### Installing Dependencies in the Correct Scope

#### Default to workspace‑scoped

Install a dependency **in the workspace that actually uses it**:

```bash
yarn workspace backend add some-lib
```

This keeps graphs accurate, boundaries explicit, and license scans precise.

#### When to install at the root

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

---

## Conclusion

SuiteTools leverages Yarn’s powerful workspace capabilities to manage a modular monorepo structure, ensuring consistent tooling, shared dependencies, and efficient development workflows.

For more information on SuiteTools, refer to the [README.md](../README.md) and the [SuiteTools Monorepo Documentation](./index.md).

---

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](../LICENSE). By using this project, you agree to comply with the terms of the license.
