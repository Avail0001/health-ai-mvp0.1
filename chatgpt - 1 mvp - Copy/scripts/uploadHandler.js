import { parseTextReport } from './ocrProcessor.js';
import { analyzeLabReport } from './analyzeLabReport.js';
import { renderEducationalSummary } from './renderResult.js';
import { addMsg } from './utils.js';

export function mountUploadShortcuts(){
  document.getElementById('pasteText').onclick=async ()=>{const t=prompt('Paste OCR text or JSON:');if(!t)return;await processText(t);};
  document.getElementById('fileText').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>processText(r.result);r.readAsText(f);};
  document.getElementById('fileImage').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;addMsg('ai','🧠 Performing OCR…');
    try{const out=await Tesseract.recognize(f,'eng');await processText(out.data.text||'');}catch{addMsg('ai','OCR failed.');}
  };
  document.getElementById('processText').onclick=async()=>{const t=document.getElementById('manualText').value.trim();if(!t){alert('Paste text or JSON');return;}await processText(t);document.getElementById('drawer').classList.add('hidden');document.getElementById('manualText').value='';};
  document.getElementById('loadSample').onclick=()=>{document.getElementById('manualText').value=JSON.stringify({"HbA1c":8.2,"Total Cholesterol":6.3,"Blood Pressure":"145/90","Ferritin":12,"TSH":5.1,"25-OH Vitamin D":25},null,2);};
  document.getElementById('closeDrawer').onclick=()=>document.getElementById('drawer').classList.add('hidden');
}
async function processText(txt){
  addMsg('user','<small>Uploaded/Pasted</small><pre>'+String(txt).slice(0,2000).replace(/</g,'&lt;')+'</pre>');
  const parsed=parseTextReport(txt);
  const res=await analyzeLabReport(parsed);
  await renderEducationalSummary(res);
}