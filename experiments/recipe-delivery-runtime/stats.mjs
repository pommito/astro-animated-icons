export function quantile(values,p){
 if(!values.length||values.some(value=>!Number.isFinite(value)))throw Error("Finite samples required");
 const sorted=values.toSorted((a,b)=>a-b),at=(sorted.length-1)*p,low=Math.floor(at),high=Math.ceil(at);
 return sorted[low]+(sorted[high]-sorted[low])*(at-low);
}
export function describe(values){return {samples:values.length,median:quantile(values,.5),p95:quantile(values,.95),min:Math.min(...values),max:Math.max(...values)};}
export function compare(rows,key){
 const a=rows.map(row=>row.baseline[key]),b=rows.map(row=>row.proof[key]),delta=rows.map((_,i)=>b[i]-a[i]);
 let seed=0x261102;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 const estimates=[],differences=[];
 for(let sample=0;sample<5000;sample++){
  const indices=Array.from({length:delta.length},()=>Math.floor(random()*delta.length));
  estimates.push(quantile(indices.map(index=>delta[index]),.5));
  differences.push(quantile(indices.map(index=>b[index]),.5)-quantile(indices.map(index=>a[index]),.5));
 }
 return {baseline:describe(a),proof:describe(b),medianDifference:quantile(b,.5)-quantile(a,.5),medianDifferenceCI95:[quantile(differences,.025),quantile(differences,.975)],pairedDelta:describe(delta),pairedDeltaCI95:[quantile(estimates,.025),quantile(estimates,.975)],medianRatio:quantile(b,.5)/quantile(a,.5)};
}
