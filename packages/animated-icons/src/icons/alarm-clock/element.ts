import { createIconElement } from "../../element";
import { alarmClockRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AlarmClockIconHandle = IconHandle;

const AlarmClockElement = createIconElement(alarmClockRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-alarm-clock": InstanceType<typeof AlarmClockElement>;
  }
}

if (!customElements.get("grave-alarm-clock")) {
  customElements.define("grave-alarm-clock", AlarmClockElement);
}
