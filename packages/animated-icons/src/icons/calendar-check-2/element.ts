import { createIconElement } from "../../element";
import { calendarCheck2Recipe } from "./definition";
import type { IconHandle } from "../../element";

export type CalendarCheck2IconHandle = IconHandle;

const CalendarCheck2Element = createIconElement(calendarCheck2Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-calendar-check-2": InstanceType<typeof CalendarCheck2Element>;
  }
}

if (!customElements.get("grave-calendar-check-2")) {
  customElements.define("grave-calendar-check-2", CalendarCheck2Element);
}
