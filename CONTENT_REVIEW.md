# CONTENT REVIEW

## Textbook status

PDF found: `Философия учебник издание 2022 г. (1) (1).pdf`.

Python extraction could not be run on this machine because the `python` command is not installed. Text was extracted with the Node fallback script `scripts/extract_textbook_pages_node.mjs` using `pdf-parse`.

Extracted text: `materials/extracted/textbook_chapter2_pages_34_52.txt`.

Found textbook sections:

- `2.2. Философия Средних веков`
- `2.3. Философия эпохи Возрождения`
- `2.4. Философия Нового времени (XVII в.) и научная революция`
- `2.5. Философия Просвещения (XVIII в.)`

## What changed

The old content was too generic: many lessons were built around reusable phrasing instead of the actual seminar sheet. The new `gameData.ts` is rebuilt around the five oral questions from the assignment sheet.

Current structure:

- Q1: 11 micro-missions on medieval theocentrism, patristics, Augustine, commandments, and comparison with antiquity.
- Q2: 9 micro-missions on scholasticism, faith and reason, universals, Aquinas, and patristics vs scholasticism.
- Q3: 11 micro-missions on Renaissance humanism, anthropocentrism, natural philosophy, Copernicus, Bruno, and politics.
- Q4: 13 micro-missions on the scientific revolution, Bacon, idols, induction, Descartes, doubt, cogito, rules, and deduction.
- Q5: 14 micro-missions on Enlightenment reason, nature, deism, atheism, materialism, education, and social contract theories.

## Source status

- `textbook_verified`: 49 missions.
- `assignment_based`: 8 missions.
- `needs_textbook_review`: 2 missions.

`textbook_verified` is used only where the extracted text supports the section/page reference. Assignment-only details remain marked honestly.

## Needs manual textbook review

- Augustine on time: included from the assignment sheet and standard Augustine material, but the extracted pages did not provide enough direct text for full verification.
- Final mixed boss: combines all assignment questions, so it has no single textbook passage.

## Assignment-based items

These are required by the sheet and safe to train, but exact wording should be checked against the printed/SДО material if the teacher expects a specific formulation:

- Augustine vs Pelagius.
- Soteriology as wording in the sheet.
- Earthly city and heavenly city.
- Ten Commandments and commandment of love.
- Hobbes, Locke, and comparison of state theories where the extracted pages give less detail than the assignment demands.

## Safe to study through the app

The app is now aligned to the assignment sheet structure. It trains each required oral question through explanation, teacher-style questions, traps, argument assembly, and boss questions. The strongest textbook-backed blocks are scholasticism, Renaissance philosophy, Bacon and Descartes, and the main Enlightenment nature/person/society framework.
