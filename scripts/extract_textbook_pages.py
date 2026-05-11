from __future__ import annotations

import importlib
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "materials" / "extracted"
OUTPUT_REPORT = OUTPUT_DIR / "textbook_extraction_report.md"


@dataclass(frozen=True)
class ExtractionTarget:
    name: str
    printed_start: int
    printed_end: int
    output: Path
    headings: tuple[str, ...]


TARGETS = [
    ExtractionTarget(
        "Seminar 2 chapter 2 pages 34-52",
        34,
        52,
        OUTPUT_DIR / "textbook_chapter2_pages_34_52.txt",
        (
            "2.2. Философия Средних веков",
            "2.3. Философия эпохи Возрождения",
            "2.4. Философия Нового времени",
            "2.5. Философия Просвещения",
        ),
    ),
    ExtractionTarget(
        "Seminar 3 chapter 2 pages 52-78",
        52,
        78,
        OUTPUT_DIR / "seminar3_chapter2_pages_52_78.txt",
        (
            "2.6. Немецкая классическая философия",
            "2.7. Философия марксизма",
            "2.8. Западная философия второй половины XIX-XX вв.",
            "Контрольные вопросы",
        ),
    ),
    ExtractionTarget(
        "Seminar 3 dialectics page 111",
        111,
        111,
        OUTPUT_DIR / "seminar3_dialectics_page_111.txt",
        ("закон единства и борьбы противоположностей", "закон перехода количественных изменений", "закон отрицания отрицания"),
    ),
    ExtractionTarget(
        "Seminar 7 chapter 4 pages 101-118",
        101,
        118,
        OUTPUT_DIR / "seminar7_chapter4_pages_101_118.txt",
        ("Глава 4. Философия бытия", "Контрольные вопросы"),
    ),
    ExtractionTarget(
        "Seminar 7 chapter 5 pages 119-134",
        119,
        134,
        OUTPUT_DIR / "seminar7_chapter5_pages_119_134.txt",
        ("Глава 5. Философия познания", "Контрольные вопросы"),
    ),
    ExtractionTarget(
        "Seminar 7 chapter 7 pages 166-188",
        166,
        188,
        OUTPUT_DIR / "seminar7_chapter7_pages_166_188.txt",
        ("Глава 7. Философия науки и техники", "Контрольные вопросы"),
    ),
]


def find_pdf() -> Path | None:
    candidates: list[Path] = []
    for base in [ROOT / "materials", ROOT / "docs", ROOT]:
        if base.exists():
            candidates.extend(base.rglob("*.pdf"))
    for pdf in candidates:
        lowered = pdf.name.lower()
        if "философ" in lowered or "textbook" in lowered or "учебник" in lowered:
            return pdf
    return candidates[0] if candidates else None


def ensure_package(name: str, import_name: str | None = None) -> bool:
    module_name = import_name or name
    try:
        importlib.import_module(module_name)
        return True
    except Exception:
        return False


def normalize(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"))


def compact(text: str) -> str:
    return " ".join(text.lower().replace("–", "-").replace("—", "-").split())


def headings_found(text: str, headings: tuple[str, ...]) -> list[str]:
    haystack = compact(text)
    return [heading for heading in headings if compact(heading) in haystack]


def printed_to_index(page: int, offset: int) -> int:
    return max(0, page - 1 + offset)


def candidate_ranges(target: ExtractionTarget) -> list[tuple[int, int]]:
    return [
        (printed_to_index(target.printed_start, offset), printed_to_index(target.printed_end, offset))
        for offset in (0, -1, 1, -2, 2, -3, 3)
    ]


def extract_with_fitz(pdf: Path, start: int, end: int) -> str | None:
    if not ensure_package("PyMuPDF", "fitz"):
        return None
    import fitz  # type: ignore

    doc = fitz.open(pdf)
    parts = []
    for index in range(start, min(end + 1, doc.page_count)):
        parts.append(f"\n\n--- PDF index {index}, printed page candidate {index + 1} ---\n")
        parts.append(doc.load_page(index).get_text("text"))
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


METHODS = [
    ("PyMuPDF / fitz", extract_with_fitz),
    ("pypdf", extract_with_pypdf),
    ("pdfplumber", extract_with_pdfplumber),
    ("pdftotext", extract_with_pdftotext),
]


def extract_target(pdf: Path, target: ExtractionTarget, report: list[str]) -> bool:
    best: tuple[str, int, int, str, list[str]] | None = None
    for method_name, method in METHODS:
        for start, end in candidate_ranges(target):
            try:
                text = method(pdf, start, end)
            except Exception as exc:
                report.append(f"- {target.name}: {method_name} indexes {start}-{end}: failed ({exc})")
                continue
            if not text:
                report.append(f"- {target.name}: {method_name} indexes {start}-{end}: no text")
                continue
            found = headings_found(text, target.headings)
            report.append(f"- {target.name}: {method_name} indexes {start}-{end}: {len(text)} chars, headings {len(found)}/{len(target.headings)}")
            if best is None or len(found) > len(best[4]) or (len(found) == len(best[4]) and len(text) > len(best[3])):
                best = (method_name, start, end, text, found)
            if len(found) == len(target.headings):
                break
        if best and len(best[4]) == len(target.headings):
            break

    if not best:
        report.append(f"\n## {target.name}\nERROR: extraction failed.")
        return False

    method_name, start, end, text, found = best
    target.output.write_text(text, encoding="utf-8")
    missing = [heading for heading in target.headings if heading not in found]
    report.append(f"\n## {target.name}")
    report.append(f"- Selected method: {method_name}")
    report.append(f"- PDF indexes: {start}-{end}")
    report.append(f"- Printed page candidates: {start + 1}-{end + 1}")
    report.append(f"- Output: `{target.output.relative_to(ROOT)}`")
    report.append(f"- Found headings: {', '.join(found) if found else 'none'}")
    report.append(f"- Missing headings: {', '.join(missing) if missing else 'none'}")
    return not missing


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf = find_pdf()
    report = ["# Textbook extraction report\n"]
    if not pdf:
        report.append("ERROR: PDF textbook not found.")
        report.append("Put it at `materials/textbook.pdf`.")
        OUTPUT_REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")
        print("PDF textbook not found")
        return 2

    report.append(f"- PDF: `{pdf}`")
    ok_count = sum(1 for target in TARGETS if extract_target(pdf, target, report))
    report.append(f"\n## Summary\n- Complete heading matches: {ok_count}/{len(TARGETS)}")
    OUTPUT_REPORT.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Extracted {len(TARGETS)} ranges from {pdf}")
    print(f"Complete heading matches: {ok_count}/{len(TARGETS)}")
    return 0 if ok_count == len(TARGETS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
