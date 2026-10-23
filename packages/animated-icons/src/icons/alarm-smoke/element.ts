import { createIconElement, type IconHandle } from "../../element";
import { alarmSmokeRecipe } from "./definition";

export type AlarmSmokeIconHandle = IconHandle;

const AlarmSmokeElement = createIconElement(alarmSmokeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-alarm-smoke": InstanceType<typeof AlarmSmokeElement>;
  }
}

if (!customElements.get("grave-alarm-smoke")) {
  customElements.define("grave-alarm-smoke", AlarmSmokeElement);
}
