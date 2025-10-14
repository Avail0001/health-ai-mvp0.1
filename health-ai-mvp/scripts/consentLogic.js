const checkbox = document.getElementById('consentCheckbox');
const btn = document.getElementById('uploadBtn');

checkbox.addEventListener('change', () => {
  btn.disabled = !checkbox.checked;
});