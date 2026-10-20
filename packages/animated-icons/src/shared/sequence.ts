import type { IconAnimation, IconTrack } from "../element";

export function animateSequence(track: IconTrack, phases: ((track: IconTrack) => void)[]) {
  track((onComplete) => {
    let active = true;
    let controls: IconAnimation[] = [];
    let index = 0;
    function next() {
      if (!active) return;
      if (index === phases.length) { onComplete(); return; }
      controls = [];
      let remaining = 0;
      let ready = false;
      const complete = () => { if (active && ready && remaining === 0) next(); };
      const phaseTrack: IconTrack = (start) => {
        remaining++;
        const control = start(() => {
          if (!active) { onComplete(); return; }
          remaining--;
          complete();
        });
        controls.push(control);
        return control;
      };
      phases[index++](phaseTrack);
      ready = true;
      complete();
    }
    next();
    return {
      stop() { active = false; controls.forEach(control => control.stop()); },
      cancel() { active = false; controls.forEach(control => control.cancel()); },
    };
  });
}
