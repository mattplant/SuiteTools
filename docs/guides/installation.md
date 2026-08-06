# 📚 SuiteTools Installation Guide

Last updated: 2026-08-06

---

## 🎯 Purpose & Scope

This guide helps you **install and run SuiteTools** in your NetSuite account.
It is intended for **administrators and contributors** setting up the monorepo and deploying to NetSuite.

SuiteTools is a Yarn workspaces monorepo:

| Workspace | Role |
|-----------|------|
| **shared** | Types, schemas, errors — built to `shared/dist/`, consumed by FE and BE |
| **frontend** | React SPA — builds into `backend/.../SuiteTools/dist/` |
| **backend** | NetSuite SDF project — SuiteScript bundles + objects; only SDF deploy target |

---

## 🛫 Prerequisites

### General

- A NetSuite **instance** with SDF enabled
- Administrator (or equivalent) access to install, deploy, and run SuiteTools

### Local Toolchain

| Tool | Notes |
|------|--------|
| **Node.js** | **24.x** (Active LTS). Pinned by `.node-version` / `.nvmrc`, declared in root `engines.node`, enforced on `yarn install` via `scripts/check-node.mjs`. CI uses `node:24-bookworm` (see [Build & Release](./build-release.md)). |
| **Yarn Berry** | Yarn **4.9.2** via this project’s `packageManager` / `.yarn/releases`. |
| **Java JDK** | **17+** (21 recommended) for the SuiteCloud CLI (`suitecloud` account setup, validate, deploy, file upload) |
| **SuiteCloud CLI** | Provided as a workspace dependency (`@oracle/suitecloud-cli`); invoked via Yarn scripts |

### Node.js 24 (Not Homebrew Current)

As of 2026-08-05, Homebrew’s default `node` formula tracks **Current** (Node **26**). SuiteTools stays on **Node 24 LTS** until 26 becomes LTS (~2026-10-28). Odd-major / Current Node has caused native postinstall pain under Yarn PnP (notably esbuild).

Confirm before installing:

```bash
node -v   # expect v24.x.x
```

**Homebrew (recommended on macOS):**

```bash
brew install node@24
brew unlink node          # if bare `node` (26) is linked
brew link node@24 --force --overwrite
hash -r
node -v                   # v24.x.x
```

If `brew link` still leaves 26 on your `PATH`, put `node@24` first:

```bash
echo 'export PATH="$(brew --prefix node@24)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Version managers (read the pin files):**

```bash
# fnm — reads .node-version
fnm install
fnm use

# nvm — reads .nvmrc
nvm install
nvm use
```

Yarn 4 does **not** enforce `engines` by itself. Root `postinstall` runs `scripts/check-node.mjs` and **fails** if the major version is not 24.

### Requirements From NetSuite-TypeScript-SDF Template

SuiteTools’ backend layout is based on the [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF) approach (TypeScript authoring + SDF FileCabinet output).
You should be comfortable deploying a simple SDF project before working with SuiteTools.

---

## ⚙️ Initial Setup (First-Time Install)

### Clone and Install Dependencies

```bash
git clone https://gitlab.com/idev-systems/labs/SuiteTools.git
cd SuiteTools
node -v          # must be v24.x
yarn install
```

### Build the Monorepo

Frontend `prebuild` and backend `prebuild` each build **shared** automatically. For a first install, build both consumers so FileCabinet has SPA assets **and** SuiteScript bundles:

```bash
yarn build:all
```

- Frontend output: `backend/src/FileCabinet/SuiteScripts/SuiteTools/dist/` (`index.html`, `output.css`, `app-bundle.js`)
- Backend output: SuiteScript bundles under `backend/src/FileCabinet/SuiteScripts/SuiteTools/`

Generated FileCabinet JavaScript and `dist/` assets are **build products** (gitignored). Always build before deploy.

### SDF Project Account Setup

Connect the **backend** SDF project to your NetSuite account:

```bash
yarn run sdf-account-setup
```

Follow the SuiteCloud prompts (uses the Java-backed CLI).

### Deploy to NetSuite (first time)

Builds the SPA into FileCabinet `dist/`, builds SuiteScript, then full SDF `project:deploy` (scripts, objects, FileCabinet — including SPA assets):

```bash
yarn deploy:all
```

---

## 🔄 Iterative updates (after first install)

### Frontend-only (SPA)

Builds shared (via `prebuild`), builds the SPA into FileCabinet `dist/`, then uploads those files:

```bash
yarn workspace frontend run build-and-deploy
```

Reload the SuiteTools Suitelet and confirm the **app-bundle** timestamp if debugging cache.

### Backend-only (RESTlet / Suitelet / Map-Reduce / objects)

```bash
yarn workspace backend run build-and-deploy
```

`prebuild` builds shared first. Prefer `build-and-deploy` over bare `deploy`. Use `build:prod` instead of `build` when you want production bundle settings before deploy.

---

## 🚀 Running SuiteTools

### Via the SuiteTools Suitelet in NetSuite

1. Navigate to **Customization > Scripting > Scripts**.
2. Locate the script named **"SuiteTools App"** and open it.
3. Go to the **Deployments** tab.
4. Click the **URL** link to launch the SuiteTools application.

### Or Directly Access It With This URL

`https://<account_id>.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_idev_suitetools_app&deploy=customdeploy_idev_suitetools_app`

- ✅ Replace `<account_id>` with your actual NetSuite account ID.

---

## 🧯 Troubleshooting Yarn Install

### Wrong Node Major (Check-Node Failure)

If `yarn install` prints that SuiteTools requires Node 24, your shell is on another major (often Homebrew Current 26). Switch with the Homebrew / fnm / nvm steps above, then re-run `yarn install`.

### Hung Install or `esbuild Must Be Built`

A bad local `.yarn/unplugged` esbuild binary (for example a self-recursive Node wrapper instead of the real Mach-O/ELF) can hang or fork-bomb during postinstall.

Recovery:

```bash
# From the monorepo root
rm -rf .yarn/unplugged/esbuild-* .yarn/unplugged/@esbuild-*
yarn install --mode=skip-build   # if a normal install hangs on esbuild
yarn install                     # once Node 24 is confirmed
```

If esbuild is still wrong after a clean install on Node 24, delete the matching entries under `.yarn/unplugged/` again and reinstall. Prefer Node 24 before retrying — Current Node increases risk for native optional deps under PnP.

---

## 📋 Next Steps

- Verify your deployment by launching the SuiteTools app in NetSuite.
- Explore the [📚 Customizing Guide](./customizing.md) if you want to extend or adapt SuiteTools.
- Day-to-day deploy commands: [📘 Build & Release Checklist](./build-release-checklist.md).
- Ensure compliance with [🏷️ License Compliance](../governance/license-compliance.md) when adding dependencies.
- To remove SuiteTools from an account later, follow the [📚 Uninstall Guide](./uninstall.md).

By completing these steps, you’ll have SuiteTools installed, running, and ready for customization or contribution.
