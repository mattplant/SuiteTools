# SuiteTools Customizing Guide

If you want to customize SuiteTools, you can do so by modifying the code in the appropriate workspace.

## Development

Both the frontend and backend workspaces can be developed independently. Both are built using TypeScript.

The frontend uses React and Flowbite for the UI components, while the backend is a NetSuite SDF project.

I have used my years of experience with NetSuite to create a developer friendly environment that is easy to extend and customize.

## VS Code

I recommend using Visual Studio Code as your code editor for this project.

For additional details, see the [VS Code](vscode.md) documentation.

## Deploying Changes

When you make changes to the code, you will need to deploy them to NetSuite.

### Backend

To deploy the backend run the following command from the root of the monorepo:

```bash
yarn workspace backend run deploy
```

### Frontend

When you make changes to the frontend code, you will need to build it and deploy your code to NetSuite. This can be done with the following command from the root of the monorepo:

```bash
yarn workspace frontend run build-and-deploy
```

Remember to also clear your browser cache to see the latest changes.

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](../LICENSE). By using this project, you agree to comply with the terms of the license.
