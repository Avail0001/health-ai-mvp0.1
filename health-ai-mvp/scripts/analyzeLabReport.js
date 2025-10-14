import labTests from '../data/lab_tests.json';

export function generateLabInsight(testName, value) {
  const test = labTests[testName];
  if (!test) return {error: 'Test not found'};

  let category = 'unknown';
  for (const [rangeName, range] of Object.entries(test.ranges)) {
    if (value >= range.min && value <= range.max) {
      category = rangeName;
      break;
    }
  }

  return {
    testName: test.name,
    value,
    rangeCategory: category,
    units: test.units,
    educationalText: test.educational_text,
    sources: test.sources
  };
}