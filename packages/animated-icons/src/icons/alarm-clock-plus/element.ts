import { createIconElement } from "../../element";
import { alarmClockPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AlarmClockPlusIconHandle = IconHandle;

const AlarmClockPlusElement = createIconElement(alarmClockPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-alarm-clock-plus": InstanceType<typeof AlarmClockPlusElement>;
  }
}

if (!customElements.get("grave-alarm-clock-plus")) {
  customElements.define("grave-alarm-clock-plus", AlarmClockPlusElement);
}
