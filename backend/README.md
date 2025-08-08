# SuiteTools

This is the **backend workspace** for the SuiteTools project.

The backend workspace provides the server-side logic, API endpoints, and data processing capabilities for SuiteTools to connect to NetSuite.

## 🧱 Structure

SuiteTools uses the standard NetSuite SuiteCloud Development Framework (SDF) structure*, with SuiteTools installed in its own folder under `FileCabinet/SuiteScripts/SuiteTools/`.

```plaintext
backend/
├── src/     # Backend Source code
│   ├── FileCabinet/
│   │   └── SuiteScripts/
│   │       └── SuiteTools/   # SuiteTool's SuiteScripts (JavaScript)
│   ├── Objects/       # SuiteTool's NetSuite object definitions
│   ├── TypeScript/    # SuiteTool's SuiteScripts (TypeScript)
│   ├── deploy.xml     # SDF deployment configuration
│   └── manifest.xml   # SDF manifest file
├── LICENSE        # The GPL-3.0-or-later license file
├── project.json   # SDF project definition
├── package.json   # Yarn workspace definition & backend scripts
└── README.md      # This README file
```

*The only change to the SDF Structure is the addition of the `/src/TypeScript/` folder.  With leveraging my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF), the TypeScript files are automatically compiled to JavaScript and deployed to the `/src/FileCabinet/SuiteScripts/SuiteTools/` folder.

## Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Backend-Only Logic** — Avoid importing frontend or shared modules.
- **DX Matters** — All code should be easy to read, test, and onboard into.

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
