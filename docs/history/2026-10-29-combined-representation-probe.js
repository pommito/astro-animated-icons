async () => {
  // Frozen source expectations for the pre-extraction experiment, not production recipe data.
  const source = {
    "key-square": { values: { rotate: [0, 15, -15, 0], scale: [1, 1.05, 1, 1] }, duration: 600, back: 600, ease: "easeOut", origin: "50% 50%" },
    wallet: { values: { y: [0, -3, 0], rotate: [0, -4, 0] }, times: [0, 0.45, 1], duration: 550, back: 300, ease: "easeInOut", origin: "12px 12px" },
    "key-circle": { values: { y: [0, -3, 0, -2, 0], rotate: [0, 3, -3, 0] }, duration: 900, back: 900, ease: "easeOut", origin: "50% 50%" },
  };
  const bezier = (t, a, b) => (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  const ease = (progress, kind) => {
    if (progress === 0 || progress === 1) return progress;
    let low = 0, high = 1, parameter, difference, iteration = 0;
    do {
      parameter = low + (high - low) / 2;
      difference = bezier(parameter, kind === "easeInOut" ? 0.42 : 0, 0.58) - progress;
      if (difference > 0) high = parameter; else low = parameter;
    } while (Math.abs(difference) > 0.0000001 && ++iteration < 12);
    return bezier(parameter, 0, 1);
  };
  const rest = key => key === "scale" ? 1 : 0;
  const unit = (value, suffix) => typeof value === "number" ? value + suffix : value;
  const transform = values => [values.y === undefined ? "" : `translateY(${unit(values.y, "px")})`, values.scale === undefined ? "" : `scale(${values.scale})`, values.rotate === undefined ? "" : `rotate(${unit(values.rotate, "deg")})`].filter(Boolean).join(" ");
  const model = (config, returning, previous) => {
    const duration = returning ? config.back : config.duration;
    const frameCount = Math.ceil(duration / 5);
    const sample = time => Object.fromEntries(Object.entries(config.values).map(([key, declared]) => {
      const origin = previous?.[key] ?? rest(key);
      const values = returning ? [origin, rest(key)] : previous ? [origin, ...declared.slice(1)] : declared;
      const offsets = config.times?.length === values.length ? config.times : values.map((_, index) => index / (values.length - 1));
      const progress = Math.max(0, Math.min(1, time / duration));
      let index = 0;
      while (index < values.length - 2 && progress >= offsets[index + 1]) index++;
      const fraction = (progress - offsets[index]) / (offsets[index + 1] - offsets[index]);
      const weight = ease(fraction, returning ? "easeOut" : config.ease);
      return [key, values[index] + (values[index + 1] - values[index]) * weight];
    }));
    const frames = Array.from({ length: frameCount + 1 }, (_, index) => sample(index * duration / frameCount));
    return { frames, duration, at(time) {
      const position = Math.max(0, Math.min(frameCount, time / duration * frameCount));
      const index = Math.min(frameCount - 1, Math.floor(position));
      return Object.fromEntries(Object.keys(config.values).map(key => [key, frames[index][key] + (frames[index + 1][key] - frames[index][key]) * (position - index)]));
    } };
  };
  const matrices = element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  };
  const matrixError = (a, b) => Math.max(...a.map((value, index) => Math.abs(value - b[index])));
  const seek = (icon, time) => icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
  const reset = icon => { const parent = icon.parentElement; icon.remove(); parent.append(icon); };
  const results = [];
  const failures = [];
  let comparisons = 0, maxError = 0, wrongOffsetMaxError = 0, wrongOrderMaxError = 0, serial = 0;
  const sheet = document.createElement("style"); document.head.append(sheet);
  const stage = document.createElement("div"); document.body.append(stage);
  try {
    for (const row of document.querySelectorAll("[data-pair]")) {
      const icon = row.querySelector("[data-sample]");
      await customElements.whenDefined(icon.localName);
      const slug = row.closest("[data-kind]").dataset.kind;
      const config = source[slug];
      const svg = icon.querySelector("svg");
      const candidate = svg.cloneNode(true); stage.append(candidate); candidate.style.transformOrigin = config.origin;
      const runCSS = (motion, firstMatrix, parameters) => {
        const name = "decision-probe-" + (++serial);
        let values = motion.frames.map(transform);
        if (parameters) {
          const { returning, retained } = parameters;
          const zero = model(config, returning, Object.fromEntries(Object.keys(config.values).map(key => [key, 0])));
          const one = model(config, returning, Object.fromEntries(Object.keys(config.values).map(key => [key, 1])));
          for (const key of Object.keys(config.values)) candidate.style.setProperty("--probe-" + key, (retained?.[key] ?? rest(key)) + (key === "scale" ? "" : key === "rotate" ? "deg" : "px"));
          candidate.style.setProperty("--probe-matrix", firstMatrix ?? transform(motion.frames[0]));
          values = zero.frames.map((base, index) => transform(Object.fromEntries(Object.keys(base).map(key => [key,
            `calc(var(--probe-${key}) * ${one.frames[index][key] - base[key]} + ${base[key]}${key === "scale" ? "" : key === "rotate" ? "deg" : "px"})`,
          ]))));
          values[0] = "var(--probe-matrix)";
        } else if (firstMatrix) values[0] = firstMatrix;
        const frames = values.map((value, index) => (index / (motion.frames.length - 1) * 100) + "%{transform:" + value + ";}").join("");
        sheet.textContent = "@keyframes " + name + "{" + frames + "}";
        candidate.style.animation = "none"; getComputedStyle(candidate).animationName;
        candidate.style.animation = name + " " + motion.duration + "ms linear both paused";
        const animation = candidate.getAnimations()[0]; animation.pause(); animation.currentTime = 0;
        return animation;
      };
      const compare = (scenario, motion, firstMatrix, parameters) => {
        const candidateAnimation = runCSS(motion, firstMatrix, parameters);
        let maximum = 0;
        const times = [...new Set([0, 1, 2.5, 4.9, 5, 31, 83, 125, 199, motion.duration / 4, motion.duration / 3, motion.duration * 0.45, motion.duration / 2, motion.duration * 2 / 3, motion.duration * 3 / 4, motion.duration - 1, motion.duration])];
        for (const time of times) {
          seek(icon, time); candidateAnimation.currentTime = time;
          const error = matrixError(matrices(svg), matrices(candidate)); comparisons++;
          maximum = Math.max(maximum, error); maxError = Math.max(maxError, error);
          if (error > 0.005 || getComputedStyle(candidate).transformOrigin !== getComputedStyle(svg).transformOrigin) failures.push({ slug, size: Number(row.dataset.size), scenario, time, error });
        }
        results.push({ slug, size: Number(row.dataset.size), scenario, samples: times.length, maxError: maximum });
      };
      reset(icon); icon.startAnimation(); seek(icon, 0);
      compare("entry", model(config, false));
      for (const interrupted of [31, 83, 199, config.duration - 1, config.duration]) for (const returning of [true, false]) {
        reset(icon); icon.startAnimation(); seek(icon, interrupted);
        const retained = model(config, false).at(interrupted);
        const displayed = getComputedStyle(svg).transform;
        if (returning) icon.stopAnimation(); else icon.startAnimation();
        const scenario = (returning ? "stop" : "replay") + " from " + interrupted;
        compare(scenario, model(config, returning, retained), displayed);
        compare("parameterized " + scenario, model(config, returning, retained), displayed, { returning, retained });
      }
      for (const returning of [true, false]) {
        reset(icon); icon.startAnimation(); seek(icon, 199); icon.stopAnimation(); seek(icon, 83);
        const retained = model(config, true, model(config, false).at(199)).at(83);
        const displayed = getComputedStyle(svg).transform;
        if (returning) icon.stopAnimation(); else icon.startAnimation();
        const scenario = (returning ? "stop" : "replay") + " during return";
        compare(scenario, model(config, returning, retained), displayed);
        compare("parameterized " + scenario, model(config, returning, retained), displayed, { returning, retained });
      }
      if (slug === "key-circle") {
        const wrong = { ...config, times: [0, 0.25, 0.5, 0.75, 1], values: { ...config.values, rotate: [0, 3, -3, 0, 0] } };
        reset(icon); icon.startAnimation();
        const animation = runCSS(model(wrong, false));
        for (const time of [150, 225, 300, 450, 600, 675]) { seek(icon, time); animation.currentTime = time; wrongOffsetMaxError = Math.max(wrongOffsetMaxError, matrixError(matrices(svg), matrices(candidate))); }
      }
      if (slug === "wallet") {
        reset(icon); icon.startAnimation(); seek(icon, 247.5);
        candidate.style.animation = "none";
        candidate.style.transform = "rotate(-4deg) translateY(-3px)";
        wrongOrderMaxError = Math.max(wrongOrderMaxError, matrixError(matrices(svg), matrices(candidate)));
        candidate.style.removeProperty("transform");
      }
      reset(icon); candidate.remove();
    }
  } finally { sheet.remove(); stage.remove(); }
  return { baseline: "92523bd5c8f2a8daf58c57f507755b0678419bfb", userAgent: navigator.userAgent, scope: "Isolated absolute-value and parameterized CSS keyframe experiment. No shared engine, registration, recovery, or lifecycle adapter is implemented by this probe.", source, comparisons, maxError, wrongOffsetMaxError, wrongOrderMaxError, failures, results };
}
