# CONTENT_AUDIT

Дата аудита: 2026-05-10.

## Textbook Extraction Status

| Поле | Значение |
|---|---|
| PDF | `Философия учебник издание 2022 г. (1) (1).pdf` |
| Python script | `scripts/extract_textbook_pages.py` создан, но `py` не запускает Python runtime на этой машине: `No installed Python found!` |
| Фактический способ извлечения | Node fallback `scripts/extract_textbook_pages_node.mjs` через локальный пакет `pdf-parse` |
| Извлечённые страницы | partial pages 34-52 |
| Извлечённый текст | `materials/extracted/textbook_chapter2_pages_34_52.txt` |
| Отчёт | `materials/extracted/textbook_extraction_report.md` |
| Найден 2.2 | OK |
| Найден 2.3 | OK |
| Найден 2.4 | OK |
| Найден 2.5 | OK |

## Audit Table

| seminarQuestionId | полный вопрос листка | страницы учебника | разделы учебника | миссии | coveredNotebookTerms | missingNotebookTerms | bossQuestions | traps | sourceStatusSummary | textbookVerifiedMissions | assignmentBasedMissions | needsReviewMissions | comment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| sq1 | Теоцентризм как особенность мировоззрения эпохи европейского Средневековья: теизм, креационизм, сотериология/учение о душе, эсхатология. Патристика: Августин, спор с Пелагием, время, град земной и небесный; Бог, мир, человек, заповеди, сравнение с античностью. | 34-37 | 2.2. Философия Средних веков | m01, m02, m03, m04, m05, m06 | medieval_features | Нет | m01-final-boss, m02-final-boss, m03-final-boss, m04-final-boss, m05-final-boss, m06-final-boss | m01-trap, m02-trap, m03-trap, m04-trap, m05-trap, m06-trap | 1 textbook_verified, 5 assignment_based | m01 | m02, m03, m04, m05, m06 | Нет | Черты средневековой философии, теоцентризм и креационизм найдены в учебнике. Пелагий, 10 заповедей и два града в извлечённом тексте прямо не найдены, поэтому соответствующие миссии оставлены assignment_based. |
| sq2 | Средневековая схоластика: вера и разум; универсалии, реализм, номинализм; Фома Аквинский и 5 доказательств; сравнить патристику и схоластику. | 35-36 | 2.2. Философия Средних веков | m07, m08, m09, m10, m11 | universals, realism, nominalism, conceptualism, medieval_features | Нет | m07-final-boss, m08-final-boss, m09-final-boss, m10-final-boss, m11-final-boss | m07-trap, m08-trap, m09-trap, m10-trap, m11-trap | 3 textbook_verified, 2 assignment_based | m07, m08, m09 | m10, m11 | Нет | Универсалии, реализм, номинализм, концептуализм и Фома Аквинский найдены. Пять доказательств и сравнение патристики/схоластики требуют ручной сверки деталей. |
| sq3 | Гуманизм и антропоцентризм эпохи Возрождения: натурфилософия, Коперник, Бруно, политические учения Макиавелли, Мора, Кампанеллы; античность, гуманисты, пантеизм и бесконечность Вселенной. | 38-41 | 2.3. Философия эпохи Возрождения | m12, m13, m14, m15, m16 | humanism, anthropocentrism, renaissance_natural_philosophy, pantheism | Нет | m12-final-boss, m13-final-boss, m14-final-boss, m15-final-boss, m16-final-boss | m12-trap, m13-trap, m14-trap, m15-trap, m16-trap | 5 textbook_verified | m12, m13, m14, m15, m16 | Нет | Нет | Раздел 2.3 подтверждает гуманизм, античность, натурфилософию, Кузанского/Бруно, пантеизм, Коперника, бесконечность Вселенной и Макиавелли/Мора/Кампанеллу. |
| sq4 | Научная революция XVII века и её влияние на философию Нового времени: проблема научного метода в эмпиризме Бэкона и рационализме Декарта; идолы, индукция, дедукция, Cogito, правила истины. | 43-48 | 2.4. Философия Нового времени | m17, m18, m19, m20 | empiricism, rationalism, bacon_idols, induction, deduction, substance, deism, dualism | Нет | m17-final-boss, m18-final-boss, m19-final-boss, m20-final-boss | m17-trap, m18-trap, m19-trap, m20-trap | 4 textbook_verified | m17, m18, m19, m20 | Нет | Нет | Учебник подтверждает научную революцию, проблему метода, Бэкона, идолы рода/пещеры/рынка/театра, индукцию, Декарта, сомнение, Cogito, правила метода, дедукцию, деизм и дуализм. |
| sq5 | Свободомыслие и рационализм Просвещения: природа, деизм, атеизм, механистический материализм; человек, природа человека, воспитание; общество и общественный договор Гоббса, Локка, Руссо. | 48-52 | 2.5. Философия Просвещения | m21, m22, m23, m24, m25 | substance, deism, dualism, mechanistic_materialism, materialism, atheism, social_contract | Нет | m21-final-boss, m22-final-boss, m23-final-boss, m24-final-boss, m25-final-boss | m21-trap, m22-trap, m23-trap, m24-trap, m25-trap | 5 textbook_verified | m21, m22, m23, m24, m25 | Нет | Нет | Раздел 2.5 подтверждает Вольтера, Руссо, Дидро, французских материалистов, механистический материализм, деизм, материализм, атеизм, воспитание, среду, Руссо и общественный договор. |

## Source Status Summary

- `textbook_verified`: 18 миссий.
- `assignment_based`: 7 миссий.
- `needs_textbook_review`: 1 миссия, финальный смешанный босс `m26`.

## Notes

Запрещённые искажения проверены поиском. Грубые формулы вроде “эмпиризм = эмоции”, “деизм = теизм”, “Бэкон рационалист, Декарт эмпирик” не используются как утверждения учебного ответа.
