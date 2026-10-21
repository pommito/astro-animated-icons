import { createIconElement, type IconHandle } from "../../element";
import { calendarCogRecipe } from "./definition";

export type CalendarCogIconHandle = IconHandle;
const CalendarCogElement = createIconElement(calendarCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-calendar-cog": InstanceType<typeof CalendarCogElement>;
  }
}

if (!customElements.get("grave-calendar-cog")) {
  customElements.define("grave-calendar-cog", CalendarCogElement);
}
