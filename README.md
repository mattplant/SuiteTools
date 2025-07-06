# SuiteTools Monorepo

Welcome to the SuiteTools monorepo! This repository contains both the backend and frontend codebases for **SuiteTools** - *The missing NetSuite tools*.

## Structure

```
.
├── backend/
└── frontend/
```

## Installation

### Prerequisites

#### General

- NetSuite
- Administrator access to a NetSuite

#### Requirements from NetSuite-TypeScript-SDF template

Since this project was built using the [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF) template, you will need to have its requirements met along with understanding how to deploy a simple project before working with a more complex project like this.

See the [NetSuite-TypeScript-SDF's README file](https://github.com/mattplant/NetSuite-TypeScript-SDF/blob/main/README.md).

### Clone and install dependencies

```bash
git clone https://github.com/mattplant/SuiteTools
cd backend
npm install
cd ../frontend
npm install
```

### Build the frontend

Ensure you are in the `frontend` directory and run:

```bash
tsc && vite build
```

### Deploying to NetSuite

Use the SuiteCloud Development Framework (SDF) to deploy the both the frontend and backend code to your NetSuite account.

For more details, see the [NetSuite-TypeScript-SDF's README file](https://github.com/mattplant/NetSuite-TypeScript-SDF/blob/main/README.md).

## Running SuiteTools

### Via the SuiteTools Suitelet in NetSuite

Navigate to Customization > Scripting > Scripts. Find the script named "SuiteTools App" and click on it. Then, click on the "Deployments" tab to see the deployment record. Click on the "URL" link to open the SuiteTools application.

### Or directly access it with this URL

`https://<account_id>.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_idev_suitetools_app&deploy=customdeploy_idev_suitetools_app`

Make sure to replace `<account_id>` with your actual NetSuite account ID.

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
