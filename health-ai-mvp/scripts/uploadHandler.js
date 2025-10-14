import { generateLabInsight } from './analyzeLabReport.js';

document.getElementById('uploadBtn').addEventListener('click', () => {
  const testName = document.getElementById('testName').value.trim();
  const value = parseFloat(document.getElementById('testValue').value);

  const result = generateLabInsight(testName, value);

  if (result.error) {
    alert(result.error);
    return;
  }

  document.getElementById('result-container').innerHTML = `
    <section>
      <h2>AI Lab Insight — Educational Result</h2>
      <p><strong>Test:</strong> ${result.testName}</p>
      <p><strong>Value:</strong> ${result.value} ${result.units}</p>
      <p><strong>Category:</strong> ${result.rangeCategory}</p>
      <p>${result.educationalText}</p>
      <p><strong>Sources:</strong> ${result.sources.join(', ')}</p>
      <div style="background:#f8d7da;color:#721c24;padding:10px;border-radius:5px;">
        ⚠ This content is educational only and is not a medical diagnosis or treatment. Please consult a GP or NHS clinician for personalised guidance.
      </div>
    </section>`;
});