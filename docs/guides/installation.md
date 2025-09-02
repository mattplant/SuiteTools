# SuiteTools Installation Guide

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

Here is the guide to install SuiteTools in your NetSuite account.

## Prerequisites

### General

- NetSuite
- Administrator access to a NetSuite

### Requirements from NetSuite-TypeScript-SDF template

Since this project was built using the [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF) template, you will need to have its requirements met along with understanding how to deploy a simple project before working with a more complex project like this.

---

## Initial setup

### Clone and install dependencies

```bash
git clone https://github.com/mattplant/SuiteTools
cd SuiteTools
yarn install
```

### Build the monorepo projects

```bash
yarn workspace frontend run build
yarn workspace backend run build
```

### SDF project account setup

We need to set up the backend SDF project to connect to your NetSuite account.

I have created a script in the root `package.json` to make this easier. It will change directory into the `backend` folder and initiates the `suitecloud account:setup` command for you. You will then need to follow the prompts to set up the connection.

```bash
yarn run sdf-account-setup
```

### Deploying to NetSuite

Use the SuiteCloud Development Framework (SDF) to deploy the both the frontend and backend code to your NetSuite account.

Run the following commands from the root of the monorepo:

```bash
yarn workspace backend run deploy
```

---

## Running SuiteTools

### Via the SuiteTools Suitelet in NetSuite

Navigate to Customization > Scripting > Scripts. Find the script named "SuiteTools App" and click on it. Then, click on the "Deployments" tab to see the deployment record. Click on the "URL" link to open the SuiteTools application.

### Or directly access it with this URL

`https://<account_id>.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_idev_suitetools_app&deploy=customdeploy_idev_suitetools_app`

Make sure to replace `<account_id>` with your actual NetSuite account ID.
