import { createIconElement, type IconHandle } from "../../element";
import { calendarDaysRecipe } from "./definition";

export type CalendarDaysIconHandle = IconHandle;
const CalendarDaysElement = createIconElement(calendarDaysRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-calendar-days": InstanceType<typeof CalendarDaysElement>;
  }
}

if (!customElements.get("grave-calendar-days")) {
  customElements.define("grave-calendar-days", CalendarDaysElement);
}
