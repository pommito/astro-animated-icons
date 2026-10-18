import { createIconElement } from "../../element";
import { alarmClockMinusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AlarmClockMinusIconHandle = IconHandle;

const AlarmClockMinusElement = createIconElement(alarmClockMinusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-alarm-clock-minus": InstanceType<typeof AlarmClockMinusElement>;
  }
}

if (!customElements.get("grave-alarm-clock-minus")) {
  customElements.define("grave-alarm-clock-minus", AlarmClockMinusElement);
}
