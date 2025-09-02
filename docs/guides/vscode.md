# VS Code

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

I recommend using [Visual Studio Code](https://code.visualstudio.com/) as your code editor for this project. It has great support for TypeScript, and it integrates well with the SuiteCloud Development Framework (SDF).

I have also configured some settings in the `.vscode` folder to help with development including automatically building the backend code.

Just have [SuiteCloud Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Oracle.suitecloud-vscode-extension) installed and open the `SuiteTools` folder in VS Code.

And instead of executing the `build-and-deploy` command via the terminal, you can click the play icon ("Run") in the NPM Scripts section of the sidebar of the Explorer panel of VS Code.

## Initial Setup

### Use Workspace TypeScript Version

1. Open any `.ts` or `.tsx` file
2. Open the Command Palette (Cmd + Shift + P or Ctrl + Shift + P)
3. Search for and select **“TypeScript: Select TypeScript Version...”**
4. Select **“Use Workspace Version”**
