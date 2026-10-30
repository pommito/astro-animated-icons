() => {
const icons=[...document.querySelectorAll('[data-kind] [data-size="24"] [data-sample]')].filter(icon=>icon.localName!=="grave-wind-arrow-down");
const original=Element.prototype.animate;let records;const trace={};
Element.prototype.animate=function(keyframes,options){const animation=original.call(this,keyframes,options);records.push({target:[...this.parentElement.children].indexOf(this)+1,length:this.getTotalLength?.(),raw:keyframes,timing:options,frames:animation.effect.getKeyframes()});return animation;};
try{for(const icon of icons){const slug=icon.closest('[data-kind]').dataset.kind;const parent=icon.parentElement;icon.remove();parent.append(icon);records=[];icon.startAnimation();trace[slug]={entry:records};icon.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=83;});records=[];icon.stopAnimation();trace[slug].returning=records;icon.remove();parent.append(icon);}}finally{Element.prototype.animate=original;}return trace;
}
