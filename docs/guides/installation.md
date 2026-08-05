# 📚 SuiteTools Installation Guide

Last updated: 2026-08-04

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

### Local toolchain

| Tool | Notes |
|------|--------|
| **Node.js** | Matches repo `.node-version` (currently Node 24) |
| **Yarn Berry** | Yarn **4.9.2** via this project’s `packageManager` / `.yarn/releases`. |
| **Java JDK** | **17+** (21 recommended) for the SuiteCloud CLI (`suitecloud` account setup, validate, deploy, file upload) |
| **SuiteCloud CLI** | Provided as a workspace dependency (`@oracle/suitecloud-cli`); invoked via Yarn scripts |

### Requirements From NetSuite-TypeScript-SDF Template

SuiteTools’ backend layout is based on the [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF) approach (TypeScript authoring + SDF FileCabinet output).
You should be comfortable deploying a simple SDF project before working with SuiteTools.

---

## ⚙️ Initial Setup (first-time install)

### Clone and Install Dependencies

```bash
git clone https://gitlab.com/idev-systems/labs/SuiteTools.git
cd SuiteTools
yarn install
```

### Build the Monorepo

Frontend `prebuild` and backend `prebuild` each build **shared** automatically. For a first install, build both consumers so FileCabinet has SPA assets **and** SuiteScript bundles:

```bash
yarn workspace frontend run build
yarn workspace backend run build
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

Full SDF deploy from the backend workspace (scripts, objects, FileCabinet — including SPA `dist/` if you built frontend first):

```bash
yarn workspace backend run deploy
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
yarn workspace backend run build
yarn workspace backend run deploy
```

`prebuild` builds shared first. Use `build:prod` instead of `build` when you want production bundle settings.

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

## 📋 Next Steps

- Verify your deployment by launching the SuiteTools app in NetSuite.
- Explore the [📚 Customizing Guide](./customizing.md) if you want to extend or adapt SuiteTools.
- Day-to-day deploy commands: [📘 Build & Release Checklist](./build-release-checklist.md).
- Ensure compliance with [🏷️ License Compliance](../governance/license-compliance.md) when adding dependencies.
- To remove SuiteTools from an account later, follow the [📚 Uninstall Guide](./uninstall.md).

By completing these steps, you’ll have SuiteTools installed, running, and ready for customization or contribution.
