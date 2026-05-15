import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(ent.name)) {
      const c = fs.readFileSync(p, "utf8");
      if (c.includes("DIV_TAG")) {
        fs.writeFileSync(p, c.replaceAll("DIV_TAG", "div"));
        console.log("fixed", p);
      }
    }
  }
}

walk(src);
