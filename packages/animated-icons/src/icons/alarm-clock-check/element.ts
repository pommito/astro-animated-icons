import { createIconElement } from "../../element";
import { alarmClockCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AlarmClockCheckIconHandle = IconHandle;

const AlarmClockCheckElement = createIconElement(alarmClockCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-alarm-clock-check": InstanceType<typeof AlarmClockCheckElement>;
  }
}

if (!customElements.get("grave-alarm-clock-check")) {
  customElements.define("grave-alarm-clock-check", AlarmClockCheckElement);
}
