from __future__ import annotations

import importlib
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "materials" / "extracted"
OUTPUT_TEXT = OUTPUT_DIR / "textbook_chapter2_pages_34_52.txt"
OUTPUT_REPORT = OUTPUT_DIR / "textbook_extraction_report.md"
TARGET_HEADINGS = [
    "2.2. Философия Средних веков",
    "2.3. Философия эпохи Возрождения",
    "2.4. Философия Нового времени",
    "2.5. Философия Просвещения",
]


def find_pdf() -> Path | None:
    candidates = []
    for base in [ROOT / "materials", ROOT / "docs", ROOT]:
        if base.exists():
            candidates.extend(base.rglob("*.pdf"))
    for pdf in candidates:
        name = pdf.name.lower()
        if "философ" in name or "textbook" in name or "учебник" in name:
            return pdf
    return candidates[0] if candidates else None


def ensure_package(name: str, import_name: str | None = None) -> bool:
    module_name = import_name or name
    try:
        importlib.import_module(module_name)
        return True
    except Exception:
        pass
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", name])
        importlib.import_module(module_name)
        return True
    except Exception:
        return False


def normalize(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"))


def headings_found(text: str) -> list[str]:
    lowered = text.lower()
    found = []
    for heading in TARGET_HEADINGS:
        compact = " ".join(heading.lower().split())
        if compact in " ".join(lowered.split()):
            found.append(heading)
    return found


def extract_with_fitz(pdf: Path, start: int, end: int) -> str | None:
    if not ensure_package("PyMuPDF", "fitz"):
        return None
    import fitz  # type: ignore

    doc = fitz.open(pdf)
    parts = []
    for index in range(start, min(end + 1, doc.page_count)):
        page = doc.load_page(index)
        parts.append(f"\n\n--- PDF index {index}, printed page candidate {index + 1} ---\n")
        parts.append(page.get_text("text"))
    return normalize("".join(parts))


def extract_with_pypdf(pdf: Path, start: int, end: int) -> str | None:
    if not ensure_package("pypdf"):
        return None
    from pypdf import PdfReader  # type: ignore

    reader = PdfReader(str(pdf))
    parts = []
    for index in range(start, min(end + 1, len(reader.pages))):
        parts.append(f"\n\n--- PDF index {index}, printed page candidate {index + 1} ---\n")
        parts.append(reader.pages[index].extract_text() or "")
    return normalize("".join(parts))


def extract_with_pdfplumber(pdf: Path, start: int, end: int) -> str | None:
    if not ensure_package("pdfplumber"):
        return None
    import pdfplumber  # type: ignore

    parts = []
    with pdfplumber.open(str(pdf)) as doc:
        for index in range(start, min(end + 1, len(doc.pages))):
            parts.append(f"\n\n--- PDF index {index}, printed page candidate {index + 1} ---\n")
            parts.append(doc.pages[index].extract_text() or "")
    return normalize("".join(parts))


def extract_with_pdftotext(pdf: Path, start: int, end: int) -> str | None:
    exe = shutil.which("pdftotext")
    if not exe:
        return None
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as handle:
        temp = Path(handle.name)
    try:
        subprocess.check_call([exe, "-f", str(start + 1), "-l", str(end + 1), "-layout", str(pdf), str(temp)])
        return normalize(temp.read_text(encoding="utf-8", errors="ignore"))
    except Exception:
        return None
    finally:
        try:
            temp.unlink()
        except OSError:
            pass


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf = find_pdf()
    report = []
    if not pdf:
        OUTPUT_REPORT.write_text("# Textbook extraction report\n\nERROR: PDF textbook not found.\nPut it at `materials/textbook.pdf`.\n", encoding="utf-8")
        print("PDF textbook not found")
        return 2

    report.append("# Textbook extraction report\n")
    report.append(f"- PDF: `{pdf}`")
    ranges = [(33, 51), (32, 52), (34, 53), (30, 55)]
    methods = [
        ("PyMuPDF / fitz", extract_with_fitz),
        ("pypdf", extract_with_pypdf),
        ("pdfplumber", extract_with_pdfplumber),
        ("pdftotext", extract_with_pdftotext),
    ]

    best = None
    best_meta = None
    for method_name, method in methods:
        for start, end in ranges:
            try:
                text = method(pdf, start, end)
            except Exception as exc:
                report.append(f"- {method_name} pages {start}-{end}: failed ({exc})")
                continue
            if not text:
                report.append(f"- {method_name} pages {start}-{end}: no text")
                continue
            found = headings_found(text)
            report.append(f"- {method_name} pages {start}-{end}: extracted {len(text)} chars, headings {len(found)}/4")
            if best is None or len(found) > len(best_meta[3]) or (len(found) == len(best_meta[3]) and len(text) > len(best)):
                best = text
                best_meta = (method_name, start, end, found)
            if len(found) == len(TARGET_HEADINGS):
                break
        if best_meta and len(best_meta[3]) == len(TARGET_HEADINGS):
            break

    if not best or not best_meta:
        report.append("\nERROR: text extraction failed.")
        OUTPUT_REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")
        return 3

    method_name, start, end, found = best_meta
    OUTPUT_TEXT.write_text(best, encoding="utf-8")
    missing = [heading for heading in TARGET_HEADINGS if heading not in found]
    report.append("\n## Selected extraction")
    report.append(f"- Method: {method_name}")
    report.append(f"- PDF indexes: {start}-{end}")
    report.append(f"- Printed page candidates: {start + 1}-{end + 1}")
    report.append(f"- Output: `{OUTPUT_TEXT}`")
    report.append(f"- Found headings: {', '.join(found) if found else 'none'}")
    report.append(f"- Missing headings: {', '.join(missing) if missing else 'none'}")
    OUTPUT_REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Extracted with {method_name}: {OUTPUT_TEXT}")
    print(f"Found headings: {len(found)}/4")
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
