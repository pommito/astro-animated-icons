import { createIconElement } from "../../element";
import { calendarCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CalendarCheckIconHandle = IconHandle;

const CalendarCheckElement = createIconElement(calendarCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-calendar-check": InstanceType<typeof CalendarCheckElement>;
  }
}

if (!customElements.get("grave-calendar-check")) {
  customElements.define("grave-calendar-check", CalendarCheckElement);
}
