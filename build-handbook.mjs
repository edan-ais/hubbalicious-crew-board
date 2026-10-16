// Usage: node build-handbook.mjs   (reads handbook.md, writes handbook-data.js)
import fs from "fs";
const md = fs.readFileSync("handbook.md", "utf8").split("\n");
const out = { title: "", intro: [], sections: [] };
let cur = null;
for (const raw of md) {
  const l = raw.trimEnd();
  if (!l.trim()) continue;
  if (l.startsWith("TITLE:")) { out.title = l.slice(6).trim(); continue; }
  if (l.startsWith("## ")) { cur = { title: l.slice(3).replace(/^\d+\.\s*/, "").trim(), lines: [] }; out.sections.push(cur); continue; }
  (cur ? cur.lines : out.intro).push(l.startsWith("- ") ? "- " + l.slice(2) : l);
}
fs.writeFileSync("handbook-data.js", "window.HANDBOOK_DATA=" + JSON.stringify(out, null, 1) + ";\n");
console.log("sections:", out.sections.length);
