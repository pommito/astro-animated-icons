import { createIconElement } from "../../element";
import { snowflakeRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SnowflakeIconHandle = IconHandle;

const SnowflakeElement = createIconElement(snowflakeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-snowflake": InstanceType<typeof SnowflakeElement>;
  }
}

if (!customElements.get("grave-snowflake")) {
  customElements.define("grave-snowflake", SnowflakeElement);
}
