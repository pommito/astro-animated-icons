import data0 from "../../../../../../docs/history/2026-10-30-production-runtime-path-reveal-motion-before.json?raw";
import data1 from "../../../../../../docs/history/2026-10-30-production-staggered-path-reveal-motion-before.json?raw";
import data2 from "../../../../../../docs/history/2026-10-30-production-currency-path-reveal-motion-before.json?raw";
import data3 from "../../../../../../docs/history/2026-10-30-production-symbol-path-reveal-motion-before.json?raw";
import data4 from "../../../../../../docs/history/2026-10-30-production-wind-path-reveal-motion-before.json?raw";
export function getStaticPaths() {
  return ["runtime-path-reveal","staggered-path-reveal","currency-path-reveal","symbol-path-reveal","wind-path-reveal"].map((family,index)=>({params:{family},props:{source:[data0,data1,data2,data3,data4][index]}}));
}
export function GET({props}:{props:{source:string}}) { return new Response(props.source,{headers:{"Content-Type":"application/json"}}); }
