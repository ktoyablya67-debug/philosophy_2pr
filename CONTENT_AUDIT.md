# CONTENT AUDIT

## Textbook Extraction Status

| item | status |
|---|---|
| PDF found | `Философия учебник издание 2022 г. (1) (1).pdf` |
| Python script | `python` command unavailable on this machine |
| Working extraction method | `node scripts/extract_textbook_pages_node.mjs` with `pdf-parse` |
| Extracted text | `materials/extracted/textbook_chapter2_pages_34_52.txt` |
| Range | textbook chapter 2 pages 34-52, adjusted by script search |
| Section 2.2 found | OK |
| Section 2.3 found | OK |
| Section 2.4 found | OK |
| Section 2.5 found | OK |

## Seminar Question Coverage

| seminarQuestionId | full assignment question | textbook pages | textbook sections | micro-missions | coveredNotebookTerms | missingNotebookTerms | teacherQuestions | bossQuestions | traps | full-answer mission | sourceStatusSummary | comment |
|---|---|---|---|---|---|---|---:|---:|---:|---|---|---|
| q1 | Theocentrism of European Medieval worldview; theism, creationism, soteriology, eschatology; patristics, Augustine, Pelagius, time, earthly/heavenly city; God/world/person, commandments, love, comparison with antiquity. | 34 | 2.2 | q1m01-q1m11 | medieval_features | none | 55 | 21 | 22 | q1m11 | 5 textbook_verified, 5 assignment_based, 1 needs_textbook_review | Textbook supports medieval features, theocentrism, patristics and comparison. Augustine/Pelagius, time, cities and commandments are required by the sheet and kept honest as assignment-based/review. |
| q2 | Medieval scholasticism; faith and reason; universals, realism, nominalism; Aquinas and five proofs; compare patristics and scholasticism. | 35-36 | 2.2 | q2m01-q2m09 | universals, realism, nominalism, conceptualism | none | 45 | 19 | 18 | q2m09 | 9 textbook_verified | Rebuilt around exact distinctions: universals, realism, nominalism, conceptualism, Aquinas, faith/reason, patristics vs scholasticism. |
| q3 | Renaissance humanism and anthropocentrism; natural philosophy, Copernicus, Bruno; Machiavelli, More, Campanella; antiquity, humanists, infinity and pantheism. | 38-41 | 2.3 | q3m01-q3m11 | humanism, anthropocentrism, natural_philosophy, pantheism | none | 55 | 22 | 22 | q3m11 | 11 textbook_verified | Corrects key traps: humanism is not simple kindness, Bruno did not experimentally prove infinity, Renaissance did not merely reject the Middle Ages. |
| q4 | Scientific revolution of the 17th century; method in Bacon's empiricism and Descartes' rationalism; idols, induction, doubt, cogito, reason, rules, deduction. | 44-46 | 2.4 | q4m01-q4m13 | empiricism, rationalism, bacon_idols, induction, deduction | none | 65 | 25 | 26 | q4m13 | 13 textbook_verified | Focus is now the teacher's likely comparison: Bacon from experience/induction, Descartes from reason/doubt/deduction. |
| q5 | Enlightenment free thought and rationalism; nature, deism, atheism, mechanistic materialism; person, education; society and social contract in Hobbes, Locke, Rousseau. | 48-52 | 2.5 | q5m01-q5m14 | deism, atheism, materialism, mechanistic_materialism, substance, dualism, social_contract | none | 70 | 28 | 28 | q5m14 | 11 textbook_verified, 3 assignment_based | Textbook supports the main Enlightenment framework. Hobbes/Locke/comparative details are kept assignment-based where the extracted text is thinner than the sheet. |

## Notebook Terms

All required notebook terms are linked to at least one mission:

- medieval_features
- universals
- realism
- nominalism
- conceptualism
- humanism
- pantheism
- natural_philosophy
- anthropocentrism
- empiricism
- rationalism
- bacon_idols
- induction
- deduction
- substance
- deism
- dualism
- mechanistic_materialism
- materialism
- atheism
- social_contract

## Quality Audit

The following placeholder style was removed from game content:

- reusable generic mission phrasing;
- obvious distractors about random facts or everyday rules;
- vague prompts asking for the "best formulation";
- author/name lists without conceptual links.

Every micro-mission now has:

- direct assignment prompt;
- source status and source refs;
- lesson tied to the assignment subtopic;
- at least five teacher-style questions;
- one choice step;
- one duel/distinction step;
- one trap step;
- one argument assembly step;
- a final boss question.

Each q1-q5 chapter has an итоговый ответ mission with strict boss-style questions.
