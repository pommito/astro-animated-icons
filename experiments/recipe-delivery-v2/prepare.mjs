import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {dirname,resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
const dir=dirname(fileURLToPath(import.meta.url)),root=resolve(dir,"../..");
mkdirSync(dir,{recursive:true});
let icon=readFileSync(join(root,"packages/animated-icons/src/Icon.astro"),"utf8").replace('import "./icon.css"','import "../../packages/animated-icons/src/icon.css"').replace('</Tag>','  <slot name="recovery" />\n</Tag>');
writeFileSync(join(dir,"ReferenceIcon.astro"),icon);
for(const [wrapper,kind,param,wire,extra]of [
 ["CssIcon","cycle","cycle","cycle",'svgStyle?: string;'],
 ["CssOpacityIcon","opacity","parts","{ id: tag.slice(6), parts }",''],
 ["CssPaintIcon","paint","paint","encodePaint(paint)",''],
]){
 const type=kind==="cycle"?'import type { TransformCycle } from "../../packages/animated-icons/src/shared/finite-transform-cycle";':kind==="opacity"?'import type { OpacityPart } from "../../packages/animated-icons/src/shared/opacity-parts";':'import type { PaintRecipe } from "../../packages/animated-icons/src/shared/paint-recipe";\nimport { encodePaint } from "../../packages/animated-icons/src/shared/paint-data";';
 const dataType=kind==="cycle"?'TransformCycle':kind==="opacity"?'OpacityPart[]':'PaintRecipe';
 const id=kind==="opacity"?'tag.slice(6)':param+'.id';
 const source=`---\nimport Original from "../../packages/animated-icons/src/${wrapper}.astro";\nimport ReferenceIcon from "./ReferenceIcon.astro";\nimport type { IconProps } from "../../packages/animated-icons/src/Icon.astro";\n${type}\nimport { assets } from "../../.artifacts/recipe-delivery/generated/assets";\nimport recoveryURL from "../recipe-delivery/register-${kind}.ts?worker&url";\nimport { chooseDelivery } from "./delivery";\ninterface Props extends IconProps { ${param}: ${dataType}; tag: \`grave-\${string}\`; ${extra} }\nconst {${param},tag,...props}=Astro.props;\nconst drawing=await Astro.slots.render("default");\nconst shared=chooseDelivery(Astro.locals,tag,${wire},drawing,assets[tag],recoveryURL,"${kind}");\n---\n{shared ? <ReferenceIcon {...props} tag={tag} data-css-${kind}={${id}} data-grave-${kind}-src={assets[tag]}><Fragment set:html={drawing}/><script slot="recovery" is:inline type="module" src={recoveryURL}/></ReferenceIcon> : <Original {...props} ${param}={${param}} tag={tag}><Fragment set:html={drawing}/></Original>}`;
 writeFileSync(join(dir,wrapper+".astro"),source);
}
console.log("Prepared bounded delivery wrappers with conditional recovery modules.");
