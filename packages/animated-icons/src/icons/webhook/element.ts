import { createIconElement, type IconHandle } from "../../element";
import { webhookRecipe } from "./definition";

export type WebhookIconHandle = IconHandle;

const WebhookElement = createIconElement(webhookRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-webhook": InstanceType<typeof WebhookElement>;
  }
}

if (!customElements.get("grave-webhook")) {
  customElements.define("grave-webhook", WebhookElement);
}
