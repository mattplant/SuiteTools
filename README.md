# SuiteTools Monorepo

Welcome to the SuiteTools monorepo!

This repository contains both the backend and frontend codebases for **SuiteTools** - *The missing NetSuite tools*.

## Structure

```bash
SuiteTools monorepo
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

### Initial setup

#### Clone and install dependencies

```bash
git clone https://github.com/mattplant/SuiteTools
cd SuiteTools
yarn install
```

#### Build the monorepo projects

```bash
yarn workspace frontend run build
yarn workspace backend run build
```

#### SDF project account setup

We need to set up the backend SDF project to connect to your NetSuite account.

I have created a script in the root `package.json` to make this easier. It will change directory into the `backend` folder and initiates the `suitecloud account:setup` command for you. You will then need to follow the prompts to set up the connection.

```bash
yarn run sdf-account-setup
```

#### Deploying to NetSuite

Use the SuiteCloud Development Framework (SDF) to deploy the both the frontend and backend code to your NetSuite account.

Run the following commands from the root of the monorepo:

```bash
yarn workspace backend run deploy
```

## Running SuiteTools

### Via the SuiteTools Suitelet in NetSuite

Navigate to Customization > Scripting > Scripts. Find the script named "SuiteTools App" and click on it. Then, click on the "Deployments" tab to see the deployment record. Click on the "URL" link to open the SuiteTools application.

### Or directly access it with this URL

`https://<account_id>.app.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_idev_suitetools_app&deploy=customdeploy_idev_suitetools_app`

Make sure to replace `<account_id>` with your actual NetSuite account ID.

## Redeployment

When you make changes to your frontend code you will need to build it and deploy your code to NetSuite. This can be done with the following command from the root of the monorepo:

```bash
yarn workspace frontend run build-and-deploy
```

You will also need to clear your browser cache to see the latest changes in the SuiteTools frontend application.

If you only changed backend code, you can skip the frontend build step with the following.

```bash
yarn workspace backend run deploy
```

## VS Code

I recommend using [Visual Studio Code](https://code.visualstudio.com/) as your code editor for this project. It has great support for TypeScript, and it integrates well with the SuiteCloud Development Framework (SDF).

I have also configured some settings in the `.vscode` folder to help with development including automatically building the backend code.

Just have [SuiteCloud Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Oracle.suitecloud-vscode-extension) installed and open the `SuiteTools` folder in VS Code.

And instead of executing the `build-and-deploy` command via the terminal, you can click the play icon ("Run") in the NPM Scripts section of the sidebar of the Explorer panel of VS Code.

### VS Code Initial Setup

#### Use Workspace TypeScript Version

1. Open any `.ts` or `.tsx` file
2. Open the Command Palette (Cmd + Shift + P or Ctrl + Shift + P)
3. Search for and select **“TypeScript: Select TypeScript Version...”**
4. Select **“Use Workspace Version”**

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
