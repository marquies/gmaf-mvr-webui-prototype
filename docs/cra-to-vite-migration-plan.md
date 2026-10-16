# CRA to Vite migration decision and staged implementation plan

Task: t_07c493ff. Repository: https://github.com/marquies/gmaf-mvr-webui-prototype
Inspected baseline: master `6dae69ae34d6548890f8d2ec7478d77404e1442e`.
Evidence date: 2026-10-16. Delivery format: board artifact, not a repository change.

## Decision

Migrate dev/build to Vite; retain Jest initially as an independent runner. Do not combine this with React upgrades, Vitest conversion, application redesign, or backend/API changes. Use three small, independently green PRs below. CRA remains available until the Vite candidate passes tests and browser/build checks.

Keeping CRA avoids immediate migration work and preserves implicit Babel, Jest, ESLint and browser compatibility defaults. Its exposure is mainly in local/CI tooling rather than deployed static JavaScript, but unmaintained dev servers, parsers and build dependencies still matter on developer machines and untrusted PR builds. React officially deprecated CRA and recommends migration. Accepting its exposure indefinitely is not recommended. Until cutover, bind the dev server to loopback, avoid exposing it through public tunnels, use locked installs, and do not give untrusted PR jobs secrets or write permissions.

Vite + Vitest is viable, but replacing Jest globals, hoisted mocks, module auto-mocks, CommonJS test imports and timers at the same time adds unnecessary risk. Independent Jest preserves the 60 existing behavior tests and can be upgraded separately. This is not a claim that Jest or Vite has zero advisories: measure the new lockfile, and report residuals explicitly.

## Verified baseline and corrections to the original risk statement

- Node v22.22.3, npm 10.9.8 on this machine. CI uses Node 22.
- Re-ran `CI=true npm test -- --watchAll=false --runInBand`: 17 suites, 60 tests passed, no snapshots. Existing React act deprecation warnings remain.
- Re-ran `npm audit --json`: 78 findings, 4 critical, 44 high, 16 moderate, 14 low. Audit exit 1 is expected for findings.
- There is no custom package.json Jest block; CRA currently provides the runner, transform, jsdom, discovery and asset handling implicitly. `src/setupTests.js` supplies jest-dom and fail-fast fetch mocks.
- No application `REACT_APP_*`, `process.env`, `process.env.NODE_ENV`, SVG ReactComponent imports or service worker registrations were found in src. `public/index.html` has one `%PUBLIC_URL%`, in the manifest link. No homepage or proxy key exists in package.json.
- Important qualification: not every finding can simply be called a CRA dev-only finding. Direct dependency `node-fetch` has high advisory GHSA-r683-j2x4-v87g, vulnerable range <2.6.7. No application import was found; remove the unused direct declaration in PR 3 after a full tracked-file reference check. This is not evidence of browser exploitability. `npm audit --omit=dev` is not a bundle-reachability analysis, especially while react-scripts is listed under dependencies.
- `webview: "file:"` is a self dependency; remove it in PR 3 to avoid duplicate/self-linked tooling graphs. Check `npm ls` after regenerating the lockfile.
- Browser-facing configuration currently uses CommonJS (`src/config/config.js` ends with `module.exports = config`). Vite does not generally translate application CommonJS automatically.
- JSX is present in `src/index.js`, `src/components/plugins/registry/pluginFactory.js`, and `src/__mocks__/react-tag-input.js`. Vite requires an intentional JSX treatment; do not assume CRA's .js behavior.
- `pluginLoader.js` uses unconstrained template/variable dynamic imports. These need an explicit finite import map, not `@vite-ignore`, which would leave source JSX paths unresolved in production.

Evidence files delivered alongside this plan: `t_07c493ff-audit.json` and `t_07c493ff-baseline-tests.log`. No migration code, dependency install or Vite build was performed in this planning task. The snippets below are implementation specifications to exercise in the follow-up, not claimed working migration output.

## Dependency and package.json delta

Candidate versions were checked against the npm registry during planning. Use exact direct versions and commit the generated package-lock.json; re-check advisories before installation. Node must be >=22.12 on the Node 22 line; keep CI on Node 22 and document that minimum. Do not add `"type": "module"`; use .mjs for Vite/ESLint and .cjs for Jest/Babel to avoid changing application/test module semantics globally.

Add to devDependencies:

```json
{
  "vite": "8.3.4",
  "@vitejs/plugin-react": "6.1.2",
  "jest": "29.7.0",
  "babel-jest": "29.7.0",
  "jest-environment-jsdom": "29.7.0",
  "@babel/core": "7.28.5",
  "@babel/preset-env": "7.28.5",
  "@babel/preset-react": "7.28.5",
  "eslint": "9.39.1",
  "@eslint/js": "9.39.1",
  "globals": "16.5.0",
  "eslint-plugin-react": "7.37.5",
  "eslint-plugin-react-hooks": "7.1.1",
  "eslint-plugin-jsx-a11y": "6.10.2"
}
```

Jest 29 is a compatibility bridge close to CRA's Jest 27 semantics, not a long-term commitment to freeze its major. If its resulting dependency graph leaves high/critical advisories, upgrade the independent Jest family together and rerun the unchanged tests before cutover; do not waive findings merely to preserve this candidate version. Vite 8/plugin-react 6 are a matched pair; plugin-react's compiler-related peers are optional, so do not install React Compiler for this migration.

Move the existing three @testing-library packages from dependencies to devDependencies at their existing resolved lockfile versions, without a library upgrade. Keep React 18 and all other application library versions unchanged.

Remove in PR 3:

- dependencies.react-scripts (5.0.1), dependencies.node-fetch (unused), dependencies.webview (self-reference).
- devDependencies.@babel/plugin-proposal-private-property-in-object (CRA workaround).
- package.json eslintConfig (replace with standalone flat config below).
- `eject`, all temporary CRA scripts and all CRA-only configuration/dependencies introduced for bridging.

Final scripts:

```json
{
  "start": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src",
  "test": "jest --watch",
  "test:ci": "jest --ci --runInBand",
  "test:standalone": "jest --ci --runInBand"
}
```

During PR 1, leave existing start/build/lint/test/eject unchanged and add only test:standalone. During PR 2 add `start:vite: "vite"` and `build:vite: "vite build"`. Use alternate candidate output `build-vite/`; do not overwrite the CRA build. Add build-vite/ to .gitignore. Remove alternate scripts/output at cutover.

## Independent Jest configuration (PR 1)

Add `jest.config.cjs` explicitly selecting this file when running standalone during coexistence:

```js
module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: { '^.+\\.[jt]sx?$': ['babel-jest', {
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ]
  }] },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test-utils/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp4|mp3)$': '<rootDir>/src/test-utils/fileMock.cjs'
  },
  resetMocks: true,
  clearMocks: true
};
```

Set temporary script `test:standalone` to `jest --config jest.config.cjs --ci --runInBand`; retain explicit --config in final scripts if needed. No global Babel config is necessary: inline babel-jest options prevent CRA picking up the new transform. Add styleMock.cjs containing `module.exports = {};` and fileMock.cjs containing `module.exports = 'test-file-stub';`. If repository inspection discovers CSS module class-name assertions, use an explicit CSS modules mapper rather than assuming this empty stub preserves them; none is presently required by the baseline tests.

Keep src/setupTests.js unchanged, including its beforeEach fail-fast fetch mock and afterEach jest.restoreAllMocks(). Keep all existing jest.mock calls, modern fake timers/setSystemTime behavior, require() in App.test.jsx, and generated GMAFAdapter auto-mocks. Do not introduce a global `jest = vi` shim or remove assertions to obtain a green run.

Keep the react-tag-input manual mock and its WithContext named export. It contains JSX; Jest's transform above handles .js and .jsx. In PR 2 it may stay .js because it is not in the browser graph; if renamed to .jsx, verify Jest still resolves the manual mock. Do not map react-tag-input to the mock in Vite: real tags/drag-and-drop must ship. The application integration, query and queryview tests intentionally mock the ESM/drag-and-drop boundary. Add a browser smoke check of the real widget since unit mocks cannot prove that dependency works in Vite.

Record a JSON test report from both runners (`--json --outputFile=...`) and compare suite paths and full test names, not only totals. Preserve all 17 original suite paths and all 60 original cases (new tests may increase totals); no skipped/focused tests. CRA and standalone must both pass in PR 1 and PR 2. Check resetMocks behavior particularly around the shared fetch setup and GMAFAdapter auto-mocks.

## Application and Vite configuration (PR 2)

1. Rename src/index.js to src/index.jsx and pluginFactory.js to pluginFactory.jsx. Extensionless imports continue to work; inspect explicit imports and tests. Leave the Jest-only mock as .js. Prefer these small renames over a global .js-as-JSX loader hack.
2. Change src/config/config.js's final statement to `export default config;`. Keep every configuration value unchanged. Babel-Jest can translate this and CRA already supports ESM.
3. Add a root index.html copied from public/index.html. Preserve the Bootstrap/JSZip CDN tags, integrity attributes, root node and noscript. Replace `%PUBLIC_URL%/manifest.json` with `%BASE_URL%manifest.json` and add `<script type="module" src="/src/index.jsx"></script>` before closing body. Keep public/index.html temporarily for CRA only. Remove it in PR 3 so Vite cannot copy/overwrite the generated entry. During coexistence use a temporary filtered public directory (same files except index.html), created deterministically by a Node script before build:vite; point publicDir there. Gitignore it. This avoids relying on Vite copy ordering; delete the helper at cutover and use public/ normally.
4. Keep public/manifest.json, favicon.ico and pluginmedia unchanged. Use base `/` and output directory `build` at cutover to preserve existing deployment paths. Initial deployment remains root-hosted; subpath hosting is not added implicitly. Existing absolute `/pluginmedia/...` and relative `pluginmedia/Golftrack.PNG` references require review and a separate base-path test if subpath hosting is later required.
5. Replace both arbitrary dynamic-import paths in pluginLoader with an explicit registry of literal lazy imports. Use canonical keys from _resolvePluginPath (strip a leading slash, normalize optional .jsx extension); point to actual case-sensitive files. Required modules: pd/DefaultPdPlugin.jsx, pd/HeartratePlugin.jsx, srd/DefaultSrdPlugin.jsx, srd/RsgPlugin.jsx, mmco/DefaultMmcoPlugin.jsx. Map the existing configured class name `RSGPlugin` to file RsgPlugin.jsx without renaming the class contract. An example entry is `'pd/HeartratePlugin': () => import('../pd/HeartratePlugin.jsx')`. Unknown paths must still reach the existing warning/null error contract; retain cache/registration logic. No arbitrary remote plugin loading, import.meta.glob or Vite-only syntax in code read by Jest. Add tests for the map and missing paths; browser-check a real lazy import, not just cached mocks.

Final `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { host: '127.0.0.1', port: 3000, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: { outDir: 'build', emptyOutDir: true }
});
```

For PR 2 only, use outDir build-vite and the filtered publicDir described above. Do not add global Node process/Buffer shims or permissive allowedHosts/CORS to fix unexplained dependency failures. Verify real react-tag-input and ReactPlayer in both dev and production; Vite optimization and production bundling are different paths.

### Environment and browser behavior

There is no existing env-variable migration to perform in application source. Leave backend config in src/config/config.js for this tooling-only migration. Future public variables use `VITE_*` / `import.meta.env.VITE_*`, and production guards use import.meta.env.PROD (or DEV). BASE_URL includes the trailing slash. Do not replace `process.env` wholesale or expose all CI environment variables. If any new browser branch is discovered during implementation, inventory it before conversion; Node config files can still use process.env. Vite mode and NODE_ENV are distinct, and --mode staging does not imply a development build.

CRA browserslist is not automatically honored by Vite. Keep the existing browserslist field during the transition as a record of the previous contract, but explicitly review the deployment's browser requirement before PR 3. Vite's current production default is Baseline Widely Available, not `>0.2%, not dead`. Smoke-test the actual supported Chrome/Firefox/Safari versions. If older browsers are required, do not silently drop them: add a separately reviewed explicit target and @vitejs/plugin-legacy/polyfill configuration, then test those browsers before merging cutover. No unsupported claim of identical browser coverage is acceptable.

Vite does not provide CRA's build-integrated ESLint or CRA asset-manifest.json format. Keep lint as a required separate job step; inspect hosting/deployment for dependence on asset-manifest.json or `/static/` paths. No deployment workflow is currently present in .github/workflows/ci.yml; external hosting details must be checked rather than guessed. Preserve build/ as the deployment directory and validate generated asset URLs.

## Standalone ESLint (PR 3)

Do not retain eslint-config-react-app just to get lint working: it retains part of the old Babel/config graph. Add eslint.config.mjs and remove package.json eslintConfig. Import @eslint/js, globals, eslint-plugin-react, eslint-plugin-react-hooks, and eslint-plugin-jsx-a11y. Configure:

- ignores: build/**, build-vite/**, node_modules/**, temporary filtered public output.
- files src/**/*.{js,jsx}: ecmaVersion latest, sourceType module, parserOptions.ecmaFeatures.jsx true, browser and es2021 globals, settings.react.version detect.
- rules: spread js.configs.recommended.rules, react.configs.recommended.rules, jsxA11y.configs.recommended.rules and hooks.configs.recommended.rules. Disable react/react-in-jsx-scope; set react/prop-types to off (no prop-types migration); set no-unused-vars to warn; set react-hooks/exhaustive-deps to warn. Retain react-hooks/rules-of-hooks as error.
- test/setup/mock files: add globals.jest, plus global and require as readonly only at that boundary; CJS test stubs use sourceType commonjs and Node globals.
- Inventory remaining CRA-only lint checks (notably import, Testing Library and flow/typescript rules). Document deliberately retired rules in the PR; do not describe this as exact lint-rule parity. No TypeScript/Flow source is currently present. New errors discovered by the standalone rule set must be fixed narrowly before merging or explicitly retained as reviewed warning-level baseline, never blanket-disabled.

Use `npm run lint` as the required error gate; do not use --max-warnings=0 while existing warnings are accepted. Vite build no longer lints, so a green build alone is insufficient. This plan deliberately changes rule ownership while retaining core correctness/hooks/accessibility checks; regression protection is tests plus the independently required lint command.

## Three-PR rollout and CI

Every PR branches from current origin/master, uses a feature branch and `gh pr create`, and merges only after hosted CI passes at the exact reviewed head. Do not push directly to master and do not merge all steps as one unverified batch.

### PR 1: extract the test runner, keep CRA default

Add independent Jest deps, explicit config/stubs, test:standalone and test-report comparison. Leave application/build/lint paths on CRA. CI retains npm ci, existing lint, `CI=true npm test -- --watchAll=false`, and `CI=false npm run build`; add `npm run test:standalone`. Gate: both report the same original 17 suites/60 passing tests. Rollback: revert this PR; original scripts and CRA remain untouched.

### PR 2: Vite in parallel

Add Vite/plugin pair, root HTML, candidate scripts, temporary public filtering, JSX renames, ESM config conversion and finite lazy plugin map. CI runs both Jest runners and both builds, outputting CRA build/ and Vite build-vite/ separately. Existing CRA build retains CI=false. Add targeted map tests rather than replacing old tests. Gate: all old tests pass under both runners, both builds pass, candidate HTTP assets return successfully, dev HMR works, and browser smoke cases below pass. Rollback: revert this PR; PR 1 still provides CRA plus standalone Jest.

### PR 3: cutover and prune

Switch final scripts, add standalone ESLint/dependencies, move test libraries, remove CRA/self/unused node-fetch and workaround dependencies, delete public/index.html, candidate filtering/helpers and temporary scripts, use Vite output build/. Regenerate package-lock.json through npm, then run a fresh npm ci. Remove CRA browserslist only after recording an approved supported-browser policy, or retain it with a comment in documentation that Vite ignores it. Update README instructions: Vite start/HMR on 3000, Jest watch vs test:ci, preview on 4173, and Vite no longer emits CRA lint/build warnings.

Final .github/workflows/ci.yml changes: retain push master / all pull_request triggers, contents: read, concurrency and checkout/setup-node v4 with npm cache. Keep Node 22 and npm ci. Replace old test command with `npm run test:ci` (CI=true may remain). Keep `npm run lint`. Run `npm run build` without CI=false and remove the CRA-specific warning comment. Add a non-mutating audit reporting step that preserves complete JSON as an uploaded artifact; handle expected npm audit exit 1 explicitly rather than making the step silently green for all failures. Gate high/critical only after the new baseline has been triaged; no permanent continue-on-error covering install, lint, test or build. Upload test JSON and audit outputs even on failure when available.

Release gates for PR 3:

- Clean npm ci; npm ls resolves without missing/invalid peers; no react-scripts, webpack-dev-server or CRA webpack middleware path remains (`npm ls react-scripts webpack-dev-server webpack-dev-middleware` may exit 1 when absent; inspect output).
- All original 17 suites and 60 cases pass with no skipped/focused tests, plus any new migration tests. lint and production build succeed. Compare test identities to PR 1's baseline.
- New audit totals/severity/package paths recorded alongside the 78 baseline. Require no unaccepted critical/high findings; any residual dependency needs a concrete fix or explicit owner-approved risk decision, not a zero-vulnerability promise. Validate node-fetch removal and CRA transitive removal separately.
- HTTP/browser smoke checks below pass using a production preview and the dev server, with no browser process/module/CommonJS errors or missing chunks. Actual deployment browser support and build directory confirmed.
- Hosted CI succeeds for the exact PR head and the resulting master push; no direct master commits.

## Smoke checks and rollback

Exercise real assets and integrations, not only mocks: initial App render/navigation; manifest, favicon and pluginmedia requests; add/remove a real tag; query/collection flows with a controlled backend or explicit stub server; classic/alternative details; image, audio, video and composite playback; PD/SRD/MMCO plugin loading, including Heartrate and RSG; lazy chunk requests; reload and HMR. External network-dependent CDN behavior must be distinguished from bundler failures. Inspect console for module.exports/process/require errors and network for 404/MIME/base-path issues. Do not claim live-backend behavior verified if only mocked.

Before cutover record the last green CRA master SHA, the pre-cutover package-lock.json, Node/npm versions and the last deployable CRA build artifact. Retain that immutable deployment artifact during the rollout. If production breaks, redeploy the previous artifact immediately, then open a rollback feature PR reverting PR 3; run npm ci and the restored CRA CI commands, and merge only when green. PR 1/2 remain, so CRA defaults can return without reconstructing deleted infrastructure. If a shared source change from PR 2 causes the regression, revert PR 2 as well after checking subsequent changes; never reset or force-push master or run npm audit fix --force as a rollback. For branch-development failures, stop before merge and fix the candidate branch; master keeps its existing green tooling.

## Deferred work and sources

Vitest adoption, React/RTL upgrades, CDN dependency consolidation, arbitrary remote plugin support, backend security/configuration redesign and general UI lint cleanup are separate work. They are not prerequisites unless a measured compatibility/security blocker requires a scoped change.

Sources checked during planning:

- https://react.dev/blog/2025/02/14/sunsetting-create-react-app — CRA deprecation and migration choices.
- https://vite.dev/guide/ — current Node requirements, HTML entry and browser defaults.
- https://vite.dev/guide/env-and-mode — env exposure, BASE_URL and mode vs NODE_ENV.
- npm registry queries for Vite 8.3.4 / plugin-react 6.1.2 (including optional peers), Jest family 29.7.0, Babel family 7.28.5 and lint versions above.
- Repository package.json, workflow, setupTests, test mocks, entry HTML, config, dynamic plugin loader and source-reference searches at the baseline SHA; raw audit/test logs attached to this task.
