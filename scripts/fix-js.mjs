import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(js|jsx)$/.test(ent.name)) files.push(p);
  }
  return files;
}

const replacements = [
  [/\}: Props\)/g, "})"],
  [/\}: ProductFormProps\)/g, "})"],
  [/\}: ButtonProps\)/g, "})"],
  [/\}: InputProps\)/g, "})"],
  [/\}: CardProps\)/g, "})"],
  [/\}: ProductCardProps\)/g, "})"],
  [/\(\{ params \}: Props\)/g, "({ params })"],
  [/credentials\?\.email \| undefined/g, "credentials?.email"],
  [/credentials\?\.password \| undefined/g, "credentials?.password"],
  [/export const metadata: Metadata =/g, "export const metadata ="],
  [/export const viewport: Viewport =/g, "export const viewport ="],
  [/globalThis as \{[\s\S]*?\};/g, "globalThis;"],
  [/  size\?: "sm" \| "md" \| "lg";\n\};\n\n/g, ""],
  [/\(value: string \| number\)/g, "(value)"],
  [/import type \{[^}]+\} from[^;]+;\n/g, ""],
  [/from "@\/types[^"]*"/g, ""],
];

for (const file of walk(root)) {
  let c = fs.readFileSync(file, "utf8");
  for (const [re, rep] of replacements) c = c.replace(re, rep);
  fs.writeFileSync(file, c);
}
console.log("Fixed", walk(root).length, "files");
