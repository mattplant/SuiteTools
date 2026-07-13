# 📚 SuiteTools Uninstall Guide

Last updated: July 12, 2026

---

## 🎯 Purpose & Scope

This guide explains how to **remove SuiteTools from a NetSuite account**.
It is intended for administrators who previously installed SuiteTools via SDF
deploy and want a clean uninstall.

**In scope:** SuiteTools scripts, deployments, custom records, and File Cabinet
files under `/SuiteScripts/SuiteTools/`.

**Out of scope:** NetSuite platform data SuiteTools only reads (integrations,
TBA tokens, login audit, SOAP Sync Status, APM concurrency, and similar). Those
records are not owned by SuiteTools and are left unchanged.

For install and launch steps, see the [Installation Guide](./installation.md).

---

## ⚠️ Before You Start

- Use an **Administrator** role (or equivalent rights to delete scripts, custom
  records, and File Cabinet files).
- Confirm no scheduled SuiteTools Map/Reduce jobs are mid-run. Wait for them to
  finish or cancel them under **Customization > Scripting > Script Deployments**
  / Script Execution Log as needed.
- Decide whether to **keep or delete SuiteTools data** stored in custom records
  (settings, jobs, job runs). Deleting the record *type* permanently removes that
  application data.

---

## 📦 What SuiteTools Installs

| Kind | Script ID / path | UI name (typical) |
|------|------------------|-------------------|
| Suitelet | `customscript_idev_suitetools_app` | SuiteTools App |
| RESTlet | `customscript_idev_suitetools_api` | SuiteTools API |
| Map/Reduce | `customscript_idev_suitetools_mr_jobs_run` | SuiteTools Jobs Run |
| Map/Reduce | `customscript_idev_suitetools_mr_logins` | SuiteTools Logins |
| Custom record | `customrecord_idev_suitetools_settings` | SuiteTools Settings |
| Custom record | `customrecord_idev_suitetools_job` | SuiteTools Job |
| Custom record | `customrecord_idev_suitetools_job_run` | SuiteTools Job Run |
| File Cabinet | `/SuiteScripts/SuiteTools/` | Scripts, helpers, and `dist/` UI assets |

Deployment IDs follow the same prefix pattern (for example
`customdeploy_idev_suitetools_app`).

---

## 🧹 Uninstall Steps (UI)

Perform the steps in order. NetSuite blocks some deletes while references remain.

### 1. Undeploy or delete script deployments

1. Go to **Customization > Scripting > Script Deployments**.
2. Filter or search for deployments whose ID or title contains `idev_suitetools`
   or **SuiteTools**.
3. For each SuiteTools deployment, either set status to **Not Scheduled** /
   undeploy, or **Delete** the deployment.

Include at least:

- `customdeploy_idev_suitetools_app`
- `customdeploy_idev_suitetools_api`
- `customdeploy_idev_suitetools_mr_jobs_run`
- `customdeploy_idev_suitetools_mr_logins`

### 2. Delete SuiteTools scripts

1. Go to **Customization > Scripting > Scripts**.
2. Open each SuiteTools script listed above and **Delete** it.

If NetSuite refuses the delete, a deployment or file reference is still present.
Finish step 1 (and check for extra deployments) before retrying.

### 3. Delete SuiteTools custom record data (optional but recommended)

If you want all SuiteTools application data removed:

1. Open list views for **SuiteTools Settings**, **SuiteTools Job**, and
   **SuiteTools Job Run** (or search by record name).
2. Delete instance records you no longer need.

Delete **job run** instances before **job** instances if NetSuite reports
dependency errors.

### 4. Delete SuiteTools custom record types

1. Go to **Customization > Lists, Records, & Fields > Record Types**.
2. Delete these types (after their instances are gone):

- SuiteTools Settings (`customrecord_idev_suitetools_settings`)
- SuiteTools Job Run (`customrecord_idev_suitetools_job_run`)
- SuiteTools Job (`customrecord_idev_suitetools_job`)

### 5. Delete File Cabinet files

1. Go to **Documents > Files > File Cabinet**.
2. Open **SuiteScripts > SuiteTools**.
3. Delete the **SuiteTools** folder contents, then the folder itself when empty.

That removes compiled backend scripts, helpers, and frontend assets under
`/SuiteScripts/SuiteTools/dist/`.

---

## ✅ Verify Removal

Confirm each of the following:

- No SuiteTools scripts remain under **Customization > Scripting > Scripts**.
- No `customdeploy_idev_suitetools_*` deployments remain.
- No SuiteTools custom record types remain under Record Types.
- `/SuiteScripts/SuiteTools/` is gone from the File Cabinet.
- The former Suitelet URL returns an error or “script not found”, not the app:

`https://<account_id>.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_idev_suitetools_app&deploy=customdeploy_idev_suitetools_app`

---

## 🗒️ Notes

- **SDF does not provide a one-click uninstall.** Removing objects from the
  project and redeploying does not reliably delete account objects. Prefer the
  UI steps above for a clean removal.
- Uninstalling SuiteTools does **not** uninstall NetSuite Application
  Performance Management (APM) or other SuiteApps SuiteTools may call.
- After uninstall, local clones of this monorepo are unchanged; only the
  NetSuite account is affected.

---

## 🔗 Related

- [Installation Guide](./installation.md)
- [Build & Release Guide](./build-release.md)
- [Backend workspace README](../../backend/README.md)

## 🗒️ Stewardship Notes

- Update this guide when SuiteTools adds or renames scripts, custom records, or
  File Cabinet paths (`backend/src/Objects/`, deploy targets).
- Keep the component table aligned with `backend/src/Objects/*.xml`.
