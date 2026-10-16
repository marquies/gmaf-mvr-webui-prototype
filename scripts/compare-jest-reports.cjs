// Compare complete suite paths and case identities from two Jest JSON reports.
const fs = require('node:fs');
const path = require('node:path');

if (process.argv.length !== 4) {
  console.error('Usage: node scripts/compare-jest-reports.cjs cra.json standalone.json');
  process.exit(2);
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const reports = process.argv.slice(2).map(read);
const suites = report => new Set(report.testResults.map(result => path.relative(process.cwd(), result.name)));
const cases = report => new Set(report.testResults.flatMap(result =>
  result.assertionResults.map(test => JSON.stringify([path.relative(process.cwd(), result.name), test.fullName, test.status]))));
const same = (left, right) => left.size === right.size && [...left].every(value => right.has(value));
const [leftSuites, rightSuites] = reports.map(suites);
const [leftCases, rightCases] = reports.map(cases);
console.log(`Suites: ${leftSuites.size}/${rightSuites.size}; cases: ${leftCases.size}/${rightCases.size}`);
if (reports.some(report => !report.success || report.numPendingTests || report.numFailedTests) ||
    !same(leftSuites, rightSuites) || !same(leftCases, rightCases)) {
  console.error('Suite/case identities or statuses differ:', {
    suitesOnlyLeft: [...leftSuites].filter(value => !rightSuites.has(value)),
    suitesOnlyRight: [...rightSuites].filter(value => !leftSuites.has(value)),
    casesOnlyLeft: [...leftCases].filter(value => !rightCases.has(value)),
    casesOnlyRight: [...rightCases].filter(value => !leftCases.has(value))
  });
  process.exit(1);
}
console.log('All suite and case identities match; no failures or skips.');
