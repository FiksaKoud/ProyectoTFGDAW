import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(ent.name)) {
      let c = fs.readFileSync(p, "utf8");
      const orig = c;
      c = c.replace(/import \{ type ClassValue, clsx \}/g, "import { clsx }");
      c = c.replace(/\.\.\.inputs: ClassValue\[\]/g, "...inputs");
      c = c.replace(/\(value \| number\)/g, "(value)");
      c = c.replace(/formData: FormData/g, "formData");
      c = c.replace(/\(formData: FormData\)/g, "(formData)");
      c = c.replace(/file: File\)/g, "file)");
      c = c.replace(/\): ActionResult<[^>]*>/g, ")");
      c = c.replace(/\): Promise<[^>]*>/g, ")");
      c = c.replace(/\{ listId \}: \{ listId \}/g, "{ listId }");
      c = c.replace(/folder,\s*\)>/g, "folder)");
      c = c.replace(/,\s*folder,\s*\n\)>/g, ", folder)");
      if (c !== orig) {
        fs.writeFileSync(p, c);
        console.log("fixed", path.relative(src, p));
      }
    }
  }
}

walk(src);
