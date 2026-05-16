import { createHash } from "node:crypto";
import { themeSetterScript } from "./csp-script.mjs";

const hash = createHash("sha256")
  .update(themeSetterScript)
  .digest("base64");

console.log(`'sha256-${hash}'`);
