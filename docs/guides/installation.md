# 📚 SuiteTools Installation Guide

Last updated: October 17, 2025

---

## 🎯 Purpose & Scope

This guide helps you **install and run SuiteTools** in your NetSuite account.
It is intended for **end users and administrators** who want to get SuiteTools up and running quickly.

---

## 🛫 Prerequisites

### General

- A NetSuite instance
- Administrator access to install, deploy and run SuiteTools

### Requirements From NetSuite-TypeScript-SDF Template

SuiteTools is built on the [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF) template.
You should meet its requirements and be comfortable deploying a simple SDF project before working with SuiteTools.

---

## ⚙️ Initial Setup

### Clone and Install Dependencies

```bash
git clone https://github.com/mattplant/SuiteTools
cd SuiteTools
yarn install
```

### Build the Monorepo Projects

```bash
yarn workspace @suiteworks/suitetools-shared run build
yarn workspace frontend run build
yarn workspace backend run build
```

### SDF Project Account Setup

A helper script is provided to connect the backend SDF project to your NetSuite account. It changes into the backend folder and runs suitecloud account:setup. Follow the prompts to complete setup.

```bash
yarn run sdf-account-setup
```

### Deploying to NetSuite

Use the SuiteCloud Development Framework (SDF) to deploy both the frontend and backend code to your NetSuite account.

```bash
yarn workspace backend run deploy
```

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
- Explore the [📚 Customizing Guide](./customizing.md) if you want to extend or adapt SuiteTools for your workflows.
- Ensure compliance with [🏷️ License Compliance](../governance/license-compliance.md) when adding dependencies or modifying code.

By completing these steps, you’ll have SuiteTools installed, running, and ready for customization or contribution.
