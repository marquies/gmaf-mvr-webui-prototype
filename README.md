# GMAF Webview

This is a web-based Frontend for the GMAF (Generic Multimedia Analysis Framework). It uses the REST Api of the GMAF Service.


## Available Scripts

### Prerequisite

To install the dependencies, run

```
npm install
```

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Before the start, make sure to start the GMAF Service and configure the 


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Testing & CI

Use Node.js 22 (the CI version). From this project directory, run the same checks as CI:

```sh
npm ci
npm run lint
CI=true npm test -- --watchAll=false
CI=false npm run build
```

`npm test` starts interactive watch mode; the command above runs the full suite once.
Tests use Jest and React Testing Library and live next to the code in `src/**/*.test.js`
and `src/**/*.test.jsx`, including `src/App.test.jsx` and `src/App.integration.test.jsx`.
Shared setup is in `src/setupTests.js`; API calls and external integrations are mocked,
so no running GMAF service is required.

GitHub Actions runs `.github/workflows/ci.yml` on pushes to `master` and all pull requests.
It installs locked dependencies with `npm ci`, runs ESLint, runs the non-watch test suite,
and builds the production bundle. Lint errors, test failures, and build errors fail CI.
Existing lint/build warnings remain non-blocking: the build explicitly sets `CI=false`
because GitHub otherwise defaults to `CI=true`, which makes Create React App treat
warnings as errors. Tests still run with `CI=true`.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.