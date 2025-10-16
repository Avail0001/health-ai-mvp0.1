import { setupFab } from './utils.js';
import { mountUploadShortcuts } from './uploadHandler.js';
import { analyzeLabReport } from './analyzeLabReport.js';
import { renderEducationalSummary } from './renderResult.js';
import { addMsg } from './utils.js';

window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('appMain'); // noop to ensure mount
  init();
});

function init(){
  setupFab();
  mountUploadShortcuts();
  const input=document.getElementById('userMessage');
  const send=document.getElementById('sendBtn');
  const drawer=document.getElementById('drawer');

  addMsg('ai','Hi! Upload your report (image/TXT/JSON) or type values like <em>HbA1c 8.2%</em>, <em>Ferritin 12</em>, <em>BP 145/90</em>.');

  send.onclick=()=>{const t=input.value.trim();if(!t)return;input.value='';addMsg('user',t);handleQuery(t);};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send.click();}});

  document.getElementById('fabOpen').addEventListener('click',()=>drawer.classList.remove('hidden'));
  document.getElementById('closeDrawer').addEventListener('click',()=>drawer.classList.add('hidden'));
}

async function handleQuery(query){
  const m=query.match(/([A-Za-z0-9 %\-\(\)\/]+)\s*[:]?[\s]([0-9]+\.?[0-9]%?\/?[0-9]*|\d+\/\d+)/);
  if(m){
    const test=m[1].trim(); const raw=m[2].trim();
    const val=(/\//.test(raw)&&!/%$/.test(raw))?raw:(/%$/.test(raw)?parseFloat(raw):Number(raw));
    addMsg('ai','Analyzing against NHS ranges…');
    const blocks=await analyzeLabReport({[test]:val});
    await renderEducationalSummary(blocks);
    return;
  }
  addMsg('ai','Try: <em>HbA1c 8.2%</em>, <em>Total Cholesterol 6.3</em>, <em>Ferritin 12</em>.');
}