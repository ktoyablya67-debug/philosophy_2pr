import fs from "node:fs";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const root = process.cwd();
const outputDir = path.join(root, "materials", "extracted");
const outputText = path.join(outputDir, "textbook_chapter2_pages_34_52.txt");
const outputReport = path.join(outputDir, "textbook_extraction_report.md");
const headings = [
  "2.2. Философия Средних веков",
  "2.3. Философия эпохи Возрождения",
  "2.4. Философия Нового времени",
  "2.5. Философия Просвещения",
];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) results.push(full);
  }
  return results;
}

function findPdf() {
  const candidates = [...walk(path.join(root, "materials")), ...walk(path.join(root, "docs")), ...walk(root)];
  return candidates.find((file) => /философ|учебник|textbook/i.test(path.basename(file))) ?? candidates[0];
}

function normalize(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((line) => line.trimEnd()).join("\n");
}

function compact(text) {
  return text.toLowerCase().replace(/\s+/g, " ");
}

function foundHeadings(text) {
  const body = compact(text);
  return headings.filter((heading) => body.includes(compact(heading)));
}

fs.mkdirSync(outputDir, { recursive: true });
const pdfPath = findPdf();
const report = ["# Textbook extraction report", ""];

if (!pdfPath) {
  fs.writeFileSync(outputReport, `${report.join("\n")}\nERROR: PDF textbook not found.\nPut it at materials/textbook.pdf.\n`, "utf8");
  process.exit(2);
}

const buffer = fs.readFileSync(pdfPath);
const parser = new PDFParse({ data: buffer });
const info = await parser.getInfo();
const pageCount = info.total ?? info.pages ?? 0;
const ranges = [
  [34, 52],
  [33, 51],
  [35, 53],
  [32, 52],
  [30, 55],
];
let selected = { text: "", found: [], range: ranges[0] };
for (const range of ranges) {
  const partial = [];
  for (let page = range[0]; page <= Math.min(range[1], pageCount || range[1]); page += 1) partial.push(page);
  const data = await parser.getText({ partial });
  const text = normalize(data.text);
  const found = foundHeadings(text);
  if (found.length > selected.found.length || (found.length === selected.found.length && text.length > selected.text.length)) {
    selected = { text, found, range };
  }
  if (found.length === headings.length && text.length > 5000) break;
}
await parser.destroy();
const text = selected.text;
const found = selected.found;
fs.writeFileSync(outputText, text, "utf8");
report.push(`- PDF: \`${pdfPath}\``);
report.push("- Method: node pdf-parse fallback (Python launcher found, but no Python runtime installed)");
report.push("- Requested printed pages: 34-52");
report.push(`- Selected PDF partial pages: ${selected.range[0]}-${selected.range[1]}`);
report.push("- Extraction strategy: pdf-parse partial page extraction, trying neighboring ranges and selecting the one with section headings 2.2-2.5");
report.push(`- Output: \`${outputText}\``);
report.push(`- Extracted chars: ${text.length}`);
report.push(`- Found headings: ${found.length ? found.join("; ") : "none"}`);
report.push(`- Missing headings: ${headings.filter((heading) => !found.includes(heading)).join("; ") || "none"}`);
fs.writeFileSync(outputReport, `${report.join("\n")}\n`, "utf8");
console.log(`Extracted text to ${outputText}`);
console.log(`Found headings: ${found.length}/4`);
process.exit(found.length === 4 ? 0 : 1);
