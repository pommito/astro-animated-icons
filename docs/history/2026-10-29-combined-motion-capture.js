async () => {
  const rows = [...document.querySelectorAll("[data-pair]")];
  await Promise.all(rows.map(row => customElements.whenDefined(row.querySelector("[data-sample]").localName)));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) throw new Error("Disable reduced motion for the Motion capture");
  const poses = [];
  const contracts = {};
  const checks = [];
  const check = (pass, context) => checks.push({ pass, context });
  const tracks = icon => icon.getAnimations({ subtree: true });
  const seek = (icon, time) => tracks(icon).forEach(animation => { animation.pause(); animation.currentTime = time; });
  const reset = icon => { const parent = icon.parentElement; icon.remove(); parent.append(icon); };
  const settle = async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); };
  for (const row of rows) {
    const icon = row.querySelector("[data-sample]");
    const svg = icon.querySelector("svg");
    const slug = row.closest("[data-kind]").dataset.kind;
    const size = Number(row.dataset.size);
    const context = slug + "/" + size;
    const snap = (scenario, time) => {
      seek(icon, time);
      const style = getComputedStyle(svg);
      const matrix = new DOMMatrix(style.transform);
      poses.push({ slug, size, scenario, time, matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f], origin: style.transformOrigin });
    };
    reset(icon); icon.startAnimation(); seek(icon, 0);
    const animation = tracks(icon)[0];
    const duration = Number(animation.effect.getTiming().duration);
    const entry = animation.effect.getKeyframes();
    if (size === 14) contracts[slug] = { entryTiming: animation.effect.getTiming(), entryFrames: entry };
    check(tracks(icon).length === 1, context + " has one native transform track");
    const samples = [...new Set([0, 1, 2.5, 4.9, 5, 31, 83, 125, 199, duration / 3, duration * 0.45, duration / 2, duration * 2 / 3, duration - 1, duration])].sort((a, b) => a - b);
    samples.forEach(time => snap("entry", time));
    const interruptions = [31, 83, 199, duration - 1, duration];
    for (const interrupted of interruptions) for (const operation of ["stop", "replay"]) {
      reset(icon); icon.startAnimation(); seek(icon, interrupted);
      const before = getComputedStyle(svg).transform;
      if (operation === "stop") icon.stopAnimation(); else icon.startAnimation();
      seek(icon, 0);
      const next = tracks(icon)[0];
      if (size === 14) {
        contracts[slug][operation + "From" + interrupted] = { timing: next.effect.getTiming(), firstFrames: next.effect.getKeyframes().slice(0, 2), before, after: getComputedStyle(svg).transform };
      }
      const a = new DOMMatrix(before), b = new DOMMatrix(getComputedStyle(svg).transform);
      check(["a", "b", "c", "d", "e", "f"].every(key => Math.abs(a[key] - b[key]) <= 0.005), context + " " + operation + " retains displayed pose at " + interrupted);
      const end = Number(next.effect.getTiming().duration);
      for (const time of [0, 1, 2.5, 4.9, 5, 31, 83, end / 2, end - 1, end]) snap(operation + " from " + interrupted, time);
    }
    for (const operation of ["stop", "replay"]) {
      reset(icon); icon.startAnimation(); seek(icon, 199); icon.stopAnimation(); seek(icon, 83);
      if (operation === "stop") icon.stopAnimation(); else icon.startAnimation();
      const end = Number(tracks(icon)[0].effect.getTiming().duration);
      for (const time of [0, 1, 2.5, 4.9, 5, 31, 83, end / 2, end - 1, end]) snap(operation + " during return", time);
    }
    reset(icon); icon.startAnimation(); tracks(icon).forEach(track => track.finish()); await settle();
    check(tracks(icon).length === 0 && svg.style.transform !== "" && svg.style.transformOrigin !== "", context + " completed entry commits and holds its pose");
    icon.stopAnimation(); seek(icon, 0);
    if (size === 14) contracts[slug].returnTiming = tracks(icon)[0].effect.getTiming();
    check(tracks(icon).length === 1, context + " stop after held completion starts a return");
    tracks(icon).forEach(track => track.finish()); await settle();
    check(tracks(icon).length === 0 && svg.style.transform === "" && svg.style.transformOrigin === "", context + " completed return clears inline pose and origin");
    icon.stopAnimation(); check(tracks(icon).length === 0, context + " stop after completed return remains idle");
    icon.startAnimation(); tracks(icon).forEach(track => track.finish()); icon.startAnimation(); seek(icon, 83); await settle();
    check(tracks(icon).length === 1 && svg.style.transformOrigin !== "", context + " stale completion preserves newer replay");
    reset(icon); check(tracks(icon).length === 0 && svg.style.transform === "" && svg.style.transformOrigin === "", context + " disconnect and reconnect clear state");
    icon.startAnimation(); tracks(icon).forEach(track => track.finish()); icon.remove(); await settle();
    check(tracks(icon).length === 0 && svg.style.transform === "" && svg.style.transformOrigin === "", context + " stale completion after disconnect remains clean");
    row.querySelector("td").append(icon); icon.startAnimation(); seek(icon, 83);
    check(tracks(icon).length === 1, context + " reconnected instance plays"); reset(icon);
    const template = document.createElement("template"); template.content.append(icon.cloneNode(true));
    const clone = template.content.firstElementChild.cloneNode(true); template.remove(); row.querySelector("td").append(clone);
    clone.startAnimation(); seek(clone, 83); check(tracks(clone).length === 1, context + " independent template clone plays after registration");
    clone.stopAnimation(); tracks(clone).forEach(track => track.finish()); await settle();
    check(clone.querySelector("svg").style.transform === "", context + " independent clone return clears"); clone.remove();
    const nativeMatchMedia = window.matchMedia;
    let reduced = false;
    const preference = new EventTarget();
    Object.defineProperty(preference, "matches", { get: () => reduced });
    try {
      window.matchMedia = query => query === "(prefers-reduced-motion: reduce)" ? preference : nativeMatchMedia.call(window, query);
      reset(icon); icon.startAnimation(); seek(icon, 83);
      reduced = true; preference.dispatchEvent(new Event("change"));
      check(tracks(icon).length === 0 && svg.style.transform === "" && svg.style.transformOrigin === "", context + " synthetic preference change clears paused entry");
      icon.startAnimation(); check(tracks(icon).length === 0, context + " synthetic reduced motion blocks manual playback");
      reduced = false; preference.dispatchEvent(new Event("change")); icon.startAnimation();
      check(tracks(icon).length === 1, context + " synthetic preference restoration enables playback");
    } finally { window.matchMedia = nativeMatchMedia; reset(icon); }
  }
  return { baseline: "92523bd5c8f2a8daf58c57f507755b0678419bfb", userAgent: navigator.userAgent, tolerance: 0.005, scope: "Public preceding local Motion components before recipe extraction. Paused native animation seeks and synthetic lifecycle operations, not visual acceptance.", contracts, poses, checks, failures: checks.filter(check => !check.pass) };
}
