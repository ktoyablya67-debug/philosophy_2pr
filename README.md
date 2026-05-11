# PhiloQuest

Игровой тренажёр для подготовки к устным семинарам по философии: объяснение материала, задания, слабые темы, быстрый бой и финальный босс.

Поддерживаются семинары:

- Семинар 2: Средневековье, Возрождение, Новое время, Просвещение.
- Семинар 3: Кант, Гегель, Маркс, иррационализм, психоанализ, современная западная философия.
- Семинар 7: бытие, познание, наука и техника.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Content Check

```bash
npm run content:check
```

Команда запускает валидаторы данных, покрытия, multi-seminar связей, visual blocks, quickExplain, analogies, traps, oralAnswer и sourceRefs.

## Выбор семинара

На главном экране есть блок "Выбери семинар". После выбора кампания, листок задания, слабые места, быстрый бой, coverage и финальный босс фильтруются по `selectedSeminarId`.

Прогресс хранится раздельно по семинарам в `progressBySeminar`. Старый localStorage Семинара 2 мигрируется в `seminar2`.

## Где редактировать контент

Индекс данных: `src/data/gameData.ts`.

Новые семинары:

- `src/data/seminar3Data.ts`
- `src/data/seminar7Data.ts`
- `src/data/seminarContentFactory.ts`

Задания:

- `materials/assignment/seminar2_assignment_questions.md`
- `materials/assignment/seminar3_assignment.md`
- `materials/assignment/seminar7_assignment.md`

Извлечённые тексты учебника:

- `materials/extracted/seminar3_chapter2_pages_52_78.txt`
- `materials/extracted/seminar3_dialectics_page_111.txt`
- `materials/extracted/seminar7_chapter4_pages_101_118.txt`
- `materials/extracted/seminar7_chapter5_pages_119_134.txt`
- `materials/extracted/seminar7_chapter7_pages_166_188.txt`

## Проверки

- Coverage: `src/utils/validators.ts`, экран `CoverageCheckScreen`.
- Data check: `src/utils/validators.ts`, экран `DataCheckScreen`.
- localStorage: `src/utils/storage.ts`.
