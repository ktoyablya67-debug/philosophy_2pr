import fs from "node:fs";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const root = process.cwd();
const outputDir = path.join(root, "materials", "extracted");
const outputReport = path.join(outputDir, "textbook_extraction_report.md");

const targets = [
  ["Seminar 2 chapter 2 pages 34-52", 34, 52, "textbook_chapter2_pages_34_52.txt", ["2.2. Философия Средних веков", "2.3. Философия эпохи Возрождения", "2.4. Философия Нового времени", "2.5. Философия Просвещения"]],
  ["Seminar 3 chapter 2 pages 52-78", 52, 78, "seminar3_chapter2_pages_52_78.txt", ["2.6. Немецкая классическая философия", "2.7. Философия марксизма", "2.8. Западная философия второй половины XIX-XX вв.", "Контрольные вопросы"]],
  ["Seminar 3 dialectics page 111", 111, 111, "seminar3_dialectics_page_111.txt", ["закон единства и борьбы противоположностей", "закон перехода количественных изменений", "закон отрицания отрицания"]],
  ["Seminar 7 chapter 4 pages 101-118", 101, 118, "seminar7_chapter4_pages_101_118.txt", ["Глава 4. Философия бытия", "Контрольные вопросы"]],
  ["Seminar 7 chapter 5 pages 119-134", 119, 134, "seminar7_chapter5_pages_119_134.txt", ["Глава 5. Философия познания", "Контрольные вопросы"]],
  ["Seminar 7 chapter 7 pages 166-188", 166, 188, "seminar7_chapter7_pages_166_188.txt", ["Глава 7. Философия науки и техники", "Контрольные вопросы"]],
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
  return text.toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ");
}

function foundHeadings(text, headings) {
  const body = compact(text);
  return headings.filter((heading) => body.includes(compact(heading)));
}

function ranges(start, end) {
  return [0, -1, 1, -2, 2, -3, 3].map((offset) => [Math.max(1, start + offset), Math.max(1, end + offset)]);
}

async function extractTarget(parser, pageCount, target, report) {
  const [name, start, end, fileName, headings] = target;
  let selected = { text: "", found: [], range: [start, end] };
  for (const range of ranges(start, end)) {
    const partial = [];
    for (let page = range[0]; page <= Math.min(range[1], pageCount || range[1]); page += 1) partial.push(page);
    const data = await parser.getText({ partial });
    const text = normalize(data.text);
    const found = foundHeadings(text, headings);
    report.push(`- ${name}: pdf-parse pages ${range[0]}-${range[1]}: ${text.length} chars, headings ${found.length}/${headings.length}`);
    if (found.length > selected.found.length || (found.length === selected.found.length && text.length > selected.text.length)) {
      selected = { text, found, range };
    }
    if (found.length === headings.length && text.length > 500) break;
  }
  const output = path.join(outputDir, fileName);
  fs.writeFileSync(output, selected.text, "utf8");
  const missing = headings.filter((heading) => !selected.found.includes(heading));
  report.push("");
  report.push(`## ${name}`);
  report.push("- Method: node pdf-parse fallback");
  report.push(`- Requested printed pages: ${start}-${end}`);
  report.push(`- Selected PDF partial pages: ${selected.range[0]}-${selected.range[1]}`);
  report.push(`- Output: \`${path.relative(root, output)}\``);
  report.push(`- Found headings: ${selected.found.length ? selected.found.join("; ") : "none"}`);
  report.push(`- Missing headings: ${missing.length ? missing.join("; ") : "none"}`);
  return missing.length === 0;
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
report.push(`- PDF: \`${pdfPath}\``);
report.push("- Python runtime: unavailable in this environment; node pdf-parse fallback used.");
let ok = 0;
for (const target of targets) {
  if (await extractTarget(parser, pageCount, target, report)) ok += 1;
}
await parser.destroy();
report.push("");
report.push("## Summary");
report.push(`- Complete heading matches: ${ok}/${targets.length}`);
fs.writeFileSync(outputReport, `${report.join("\n")}\n`, "utf8");
console.log(`Extracted ${targets.length} ranges from ${pdfPath}`);
console.log(`Complete heading matches: ${ok}/${targets.length}`);
process.exit(ok === targets.length ? 0 : 1);
