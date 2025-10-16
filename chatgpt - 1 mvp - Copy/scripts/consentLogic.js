const loader=document.getElementById('loader');
const modal=document.getElementById('consentModal');
const openSettings=document.getElementById('openSettings');
const settings=document.getElementById('settingsPanel');
const closeSettings=document.getElementById('closeSettings');
const resetConsent=document.getElementById('resetConsent');
const clearLocal=document.getElementById('clearLocal');
const themeToggle=document.getElementById('themeToggle');
const speedSelect=document.getElementById('speedSelect');

setTimeout(async()=>{loader.classList.add('hidden');const html=await loadConsentTemplate();document.getElementById('consentHtml').innerHTML=html;if(!localStorage.getItem('consent'))modal.classList.remove('hidden');else boot();},1200);

document.getElementById('acceptBtn').onclick=()=>{localStorage.setItem('consent','yes');modal.classList.add('hidden');boot();};
document.getElementById('rejectBtn').onclick=()=>alert('Consent required to use the prototype.');

openSettings.onclick=()=>settings.classList.remove('hidden');
closeSettings.onclick=()=>settings.classList.add('hidden');
resetConsent.onclick=()=>{localStorage.removeItem('consent');location.reload();};
clearLocal.onclick=()=>{localStorage.clear();location.reload();};
themeToggle?.addEventListener('change',()=>document.body.classList.toggle('light',themeToggle.checked));
speedSelect?.addEventListener('change',()=>localStorage.setItem('type_speed',speedSelect.value));

export async function loadConsentTemplate(){
  try{const r=await fetch('templates/consent-form.html');if(r.ok)return await r.text();}catch(e){}
  return <p>Educational prototype (UK). Not a medical device. Local processing only. For medical advice contact your GP or NHS 111.</p>;
}
function boot(){document.getElementById('appMain').classList.remove('hidden');}