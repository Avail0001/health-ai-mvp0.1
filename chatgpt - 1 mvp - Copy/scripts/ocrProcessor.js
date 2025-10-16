export function parseTextReport(text){
  if(!text) return {};
  const t=text.trim();
  try{const j=JSON.parse(t);if(typeof j==='object')return j;}catch(e){}
  const out={};const lines=t.split(/[\r\n]+/);
  for(let line of lines){
    line=line.trim();if(!line)continue;
    line=line.replace(/,/g,'');
    const m=line.match(/^([A-Za-z0-9 %\-\+\(\)\/\.]+)[:\s]+([0-9]+\.?[0-9]%?\/?[0-9]|[0-9]+\/[0-9]+)$/);
    if(m){const key=m[1].trim();const val=m[2].trim();out[key]=(/\//.test(val)&&!/%$/.test(val))?val:(/%$/.test(val)?parseFloat(val):Number(val));}
  }
  return out;
}