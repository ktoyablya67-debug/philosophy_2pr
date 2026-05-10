# CONTENT REVIEW

## Textbook Status

PDF found: `Философия учебник издание 2022 г. (1) (1).pdf`.

Python extraction could not be run because the `python` command is unavailable on this machine. Text extraction was completed with the Node fallback script `scripts/extract_textbook_pages_node.mjs` using `pdf-parse`.

Extracted text: `materials/extracted/textbook_chapter2_pages_34_52.txt`.

Found textbook sections: 2.2, 2.3, 2.4, 2.5.

## Content Change

The previous revision was still too meta-instructional: many lessons explained how to arrange an answer instead of teaching the philosophy itself.

This pass separates learning layers:

- `lesson`: subject explanation only.
- `knowledge`: definitions, distinctions, examples, names, context, and must-remember points.
- `answerStrategy`: short guidance for assembling an oral answer.
- `sourceRefs`: kept for audit and shown in a compact details block, not before the learning material.

## Q1 Standard

Q1 was rewritten as the quality benchmark:

- `q1m01` now teaches the medieval worldview: God, world, person, history, soul, salvation, and comparison with antique cosmocentrism.
- `q1m04` is the model lesson for soteriology and eschatology.
- `q1m09` now contains the ten commandments and the commandment of love as a real moral-philosophical block.
- `q1m10` keeps the full antiquity vs Middle Ages comparison.
- `q1m11` contains the full subject answer for question 1.

## Source Status

- `textbook_verified`: 49 missions.
- `assignment_based`: 8 missions.
- `needs_textbook_review`: 2 missions.

Assignment-only details remain marked honestly where the extracted textbook text is thinner than the assignment sheet.

## Quality Checks Added

DataCheck now warns if a lesson:

- contains meta phrases such as "answer should be built", "start with definition", or source-verification prose;
- is shorter than the content-depth threshold;
- has fewer than two definitions;
- lacks a comparison or distinction;
- lacks epoch context.

## Still Needs Manual Review

- Augustine on time.
- Some Augustine/Pelagius wording.
- The exact class-expected wording for commandments and commandment of love.
- Hobbes/Locke comparative detail if the teacher expects more than the extracted textbook gives.
