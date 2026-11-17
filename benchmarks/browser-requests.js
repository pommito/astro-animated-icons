async () => {
  const settle = () => new Promise(resolve => setTimeout(resolve, 1800));
  const snapshots = [];
  const snapshot = phase => snapshots.push({
    phase,
    resources: performance.getEntriesByType("resource").map(entry => ({
      url: new URL(entry.name).pathname, initiator: entry.initiatorType,
      transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize,
    })),
  });
  const hosts = [...document.querySelectorAll("[data-grave-icon]")];
  await Promise.all(hosts.map(host => customElements.whenDefined(host.localName)));
  await settle();
  snapshot("initial");
  const returns = [];
  for (const phase of ["first-playback", "replay", "missing-sheets", "late-clone-reconnect"]) {
    if (phase === "missing-sheets") document.querySelectorAll("style[data-grave-cycle-style]").forEach(sheet => sheet.remove());
    const selected = phase === "late-clone-reconnect" ? hosts.map(host => host.cloneNode(true)) : hosts;
    if (phase === "late-clone-reconnect") selected.forEach(host => document.body.append(host));
    for (const host of selected) {
      returns.push(typeof host.startAnimation());
      if (phase === "replay") returns.push(typeof host.startAnimation());
      returns.push(typeof host.stopAnimation());
      if (phase === "late-clone-reconnect") {
        host.remove(); document.body.append(host);
        returns.push(typeof host.startAnimation());
        returns.push(typeof host.stopAnimation());
      }
    }
    await settle();
    snapshot(phase);
    if (phase === "late-clone-reconnect") selected.forEach(host => host.remove());
  }
  return {
    browser: navigator.userAgent, path: location.pathname, visibility: document.visibilityState,
    motionReduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    hosts: hosts.length, tags: [...new Set(hosts.map(host => host.localName))],
    returnedTypes: [...new Set(returns)], snapshots,
    remainingAnimations: hosts.reduce((sum, host) => sum + host.getAnimations({ subtree: true }).length, 0),
    scope: "Programmatic playback and request observation, 1800 ms settlement per phase; no timing or visual acceptance.",
  };
}
