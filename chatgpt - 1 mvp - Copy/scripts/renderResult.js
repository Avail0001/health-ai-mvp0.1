import { addMsg, typeWords } from './utils.js';

export async function renderEducationalSummary(blocks){
  const wrap=document.createElement('div');
  wrap.innerHTML='<h4>🩺 Your Lab Report Summary (Educational)</h4>';
  for(const r of blocks){
    const el=document.createElement('div');el.className='result-block';
    el.innerHTML=`
      <h4>🔹 ${r.testName}</h4>
      <div><b>Result:</b> <span class="t-result"></span></div>
      <div><b>Range (NHS):</b> <span class="t-range"></span></div>
      <div class="interpretation"><b>Interpretation:</b> <span class="t-interpret"></span></div>
      <div class="education"><b>Educational Guidance:</b> <blockquote class="t-edu"></blockquote></div>
      <div><b>References:</b> ${(r.links||[]).map(u=><a href="${u}" target="_blank" rel="noopener">NHS</a>).join(' ')||'—'}</div>
      ${r.diet?.length?<div class="education"><b>Diet (UK):</b><ul>${r.diet.map(x=><li>${x}</li>).join('')}</ul></div>:''}
      ${r.lifestyle?.length?<div class="education"><b>Lifestyle (UK):</b><ul>${r.lifestyle.map(x=><li>${x}</li>).join('')}</ul></div>:''}
    `;
    wrap.appendChild(el);
    typeWords(el.querySelector('.t-result'),String(r.value));
    typeWords(el.querySelector('.t-range'),r.rangeText||'—');
    typeWords(el.querySelector('.t-interpret'),r.interpretation);
    typeWords(el.querySelector('.t-edu'),r.education);
  }
  const safety=document.createElement('div');safety.className='education';safety.innerHTML='🟨 Safety: Educational tool, not diagnostic. For personalised advice, contact your GP or NHS 111.';wrap.appendChild(safety);

  const follow=document.createElement('div');follow.className='followup';
  follow.innerHTML='<button class="btn-secondary" id="exportPdf">📄 Export as PDF</button>';
  wrap.appendChild(follow);

  const rating=document.createElement('div');rating.className='stars';
  rating.innerHTML='<span><b>⭐ How helpful was this?</b></span><br><button data-s="1">☆</button><button data-s="2">☆</button><button data-s="3">☆</button><button data-s="4">☆</button><button data-s="5">☆</button>';
  wrap.appendChild(rating);

  const bubble=addMsg('ai',wrap.outerHTML);
  bubble.querySelectorAll('.stars button').forEach(b=>b.addEventListener('click',()=>{const v=Number(b.dataset.s);localStorage.setItem('labcheck_feedback',JSON.stringify({ts:Date.now(),rating:v}));bubble.querySelectorAll('.stars button').forEach(x=>x.classList.toggle('filled',Number(x.dataset.s)<=v));}));
  bubble.querySelector('#exportPdf')?.addEventListener('click',()=>exportPdf(bubble.innerText));
}

function exportPdf(text){
  const { jsPDF } = window.jspdf;
  const pdf=new jsPDF({unit:'pt',format:'a4'});const m=40,w=515;
  pdf.setFont('helvetica','bold');pdf.setFontSize(14);pdf.text('Labcheck AI (UK NHS Educational Summary)',m,m);
  pdf.setFont('helvetica','normal');pdf.setFontSize(11);
  pdf.text(pdf.splitTextToSize(String(text),w),m,m+20);
  pdf.save('LabcheckAI_Summary.pdf');
}