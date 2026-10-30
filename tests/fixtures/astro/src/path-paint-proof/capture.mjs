export async function capture() {
  const representatives = ["at-sign", "attach-file", "ban", "bluetooth-connected", "droplet", "eye-off", "file-chart-line", "fingerprint", "folder-tree", "git-compare-arrows", "git-pull-request-closed", "message-circle-dashed", "receipt-euro", "receipt", "circle-dollar-sign", "message-circle-plus", "receipt-text", "route", "switch-camera", "user-round-plus", "wind-arrow-down", "wind", "x"];
  const icons = [...document.querySelectorAll("[data-proof-holder] [data-sample]")];
  await Promise.all(icons.map(icon => customElements.whenDefined(icon.localName)));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) throw Error("Disable reduced motion");
  const frames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const tracks = icon => icon.getAnimations({ subtree: true });
  const seek = (icon, time) => tracks(icon).forEach(a => { a.pause(); a.currentTime = time; });
  const reset = icon => { const parent = icon.parentElement; icon.remove(); parent.append(icon); };
  const duration = icon => Math.max(0, ...tracks(icon).map(a => a.effect.getComputedTiming().endTime));
  const snapshot = icon => [...icon.querySelectorAll("g > *, svg")].map(el => {
    const style = getComputedStyle(el), m = new DOMMatrix(style.transform);
    return { tag: el.localName, dash: style.strokeDasharray, offset: style.strokeDashoffset, opacity: Number(style.opacity), matrix: [m.a,m.b,m.c,m.d,m.e,m.f], origin: style.transformOrigin };
  });
  const contract = icon => tracks(icon).map(a => ({ target: [...icon.querySelectorAll("*")].indexOf(a.effect.target), timing: a.effect.getTiming(), frames: a.effect.getKeyframes() }));
  const poses = [], contracts = {}, checks = [];
  const check = (pass, context) => checks.push({ pass, context });
  for (const icon of icons) {
    const slug = icon.closest("[data-kind]").dataset.kind, size = Number(icon.closest("[data-size]").dataset.size);
    if (!representatives.includes(slug) && size !== 14) continue;
    reset(icon); icon.startAnimation(); seek(icon, 0);
    const end = duration(icon);
    if (size === 14) contracts[slug] = { entry: contract(icon), lengths: [...icon.querySelectorAll("path,circle,line,rect,polyline,polygon,ellipse")].map(el => el.getTotalLength()), initial: snapshot(icon) };
    const sample = (scenario, time) => { seek(icon, time); poses.push({ slug, size, scenario, time, shapes: snapshot(icon) }); };
    if (representatives.includes(slug)) {
      const samples = [...new Set([0,1,5,31,83,199,299,399,501,end/2,end-1,end])].filter(t=>t>=0).sort((a,b)=>a-b);
      samples.forEach(t => sample("entry",t));
      for (const interrupted of [31,199,end-1]) for (const operation of ["stop","replay"]) {
        reset(icon); icon.startAnimation(); seek(icon,interrupted);
        if (operation === "stop") icon.stopAnimation(); else icon.startAnimation();
        seek(icon,0);
        if (size === 14) contracts[slug][operation+interrupted] = contract(icon);
        const nextEnd = duration(icon);
        for (const time of [0,1,5,31,83,199,nextEnd-1,nextEnd]) sample(operation+" from "+interrupted,time);
      }
      for (const operation of ["stop","replay"]) {
        reset(icon); icon.startAnimation(); seek(icon,199); icon.stopAnimation(); seek(icon,83);
        if(operation === "stop") icon.stopAnimation(); else icon.startAnimation();
        const nextEnd=duration(icon);
        for(const time of [0,1,5,31,83,199,nextEnd-1,nextEnd]) sample(operation+" during return",time);
      }
      reset(icon); icon.startAnimation(); tracks(icon).forEach(a=>a.finish()); await frames();
      poses.push({slug,size,scenario:"completed",time:end,shapes:snapshot(icon)});
      icon.startAnimation(); seek(icon,0);
      if(size===14) contracts[slug].completedReplay=contract(icon);
      for(const time of [0,83,199,end]) sample("replay after completion",time);
      reset(icon); icon.startAnimation(); tracks(icon).forEach(a=>a.finish()); await frames();
      icon.stopAnimation(); seek(icon,0);
      if(size===14) contracts[slug].stopAfterCompletion=contract(icon);
      for(const time of [0,83,199,duration(icon)]) sample("stop after completion",time);
      tracks(icon).forEach(a=>a.finish()); await frames();
      check(!tracks(icon).length && [...icon.querySelectorAll("*")].every(el=>!el.style.strokeDasharray&&!el.style.strokeDashoffset&&!el.style.opacity&&!el.style.transform),slug+"/"+size+" completed return clears");
      icon.stopAnimation(); check(!tracks(icon).length,slug+"/"+size+" idle stop");
      icon.startAnimation(); tracks(icon).forEach(a=>a.finish()); icon.startAnimation(); seek(icon,83); await frames();
      check(tracks(icon).length>0,slug+"/"+size+" stale callbacks preserve newer playback");
      reset(icon); check(!tracks(icon).length,slug+"/"+size+" disconnect cleans animations");
      icon.startAnimation(); seek(icon,83); check(tracks(icon).length>0,slug+"/"+size+" reconnect plays");
    } else {
      seek(icon,83); icon.stopAnimation(); seek(icon,0); contracts[slug].return=contract(icon);
    }
    reset(icon);
  }
  return { baseline:"ab10cd2db4a54380934bdd49b0605a1a39ae9424", userAgent:navigator.userAgent, representatives,
    method:"Public local Motion before extraction; paused native timelines, manual API and synthetic lifecycle. No upstream React execution or visual acceptance.",contracts,poses,checks,failures:checks.filter(x=>!x.pass) };
}
