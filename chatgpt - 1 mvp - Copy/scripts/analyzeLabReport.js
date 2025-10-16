import TESTS from '../data/lab_tests.json' assert { type:'json' };
import CONDITIONS from '../data/conditions.json' assert { type:'json' };
import { NHS_LINKS } from './nhsReferences.js';

function formatRange(ref){
  if(!ref) return '—';
  if(ref.type==='bp') return 'Ideal <120/80 mmHg';
  if(ref.low!=null&&ref.high!=null) return ${ref.low}–${ref.high} ${ref.unit||''}.trim();
  if(ref.high!=null) return ≤ ${ref.high} ${ref.unit||''}.trim();
  if(ref.low!=null) return ≥ ${ref.low} ${ref.unit||''}.trim();
  return '—';
}
function interpret(val,ref,test){
  if(!ref) return 'No NHS range found.';
  if(ref.type==='bp'&&typeof val==='string'){
    const [s,d]=(val||'').split('/').map(Number);
    if(!Number.isFinite(s)||!Number.isFinite(d)) return 'Value not recognised.';
    if(s<120&&d<80) return 'Ideal';
    if((s>=120&&s<140)||(d>=80&&d<90)) return 'Elevated/Stage 1';
    if(s>=140||d>=90) return 'High blood pressure';
    return 'Check with GP if persistent.';
  }
  const n=Number(val); if(!Number.isFinite(n)) return 'Value not recognised.';
  if(ref.low!=null&&ref.high!=null){if(n<ref.low)return ref.interpretation?.low||'Below range';if(n>ref.high)return ref.interpretation?.high||'Above range';return ref.interpretation?.normal||'Within range';}
  if(ref.high!=null){return n>ref.high?(ref.interpretation?.high||'Above range'):(ref.interpretation?.normal||'Within range');}
  if(ref.low!=null){return n<ref.low?(ref.interpretation?.low||'Below range'):(ref.interpretation?.normal||'Within range');}
  return '—';
}

export async function analyzeLabReport(obj){
  const out=[];
  for(const[k,v] of Object.entries(obj)){
    const meta=TESTS[k];
    const range=formatRange(meta);
    const note=interpret(v,meta,k);
    const cat=meta?.category||'general';
    const diet=(CONDITIONS[cat]?.diet||[]).slice(0,8);
    const lifestyle=(CONDITIONS[cat]?.lifestyle||[]).slice(0,8);
    out.push({
      testName:k,
      value:v,
      rangeText:range,
      interpretation:note,
      education:meta?.edu||'Balanced diet, activity, sleep; consult GP if concerned.',
      links:[NHS_LINKS[k]].filter(Boolean),
      diet,
      lifestyle
    });
  }
  return out;
}