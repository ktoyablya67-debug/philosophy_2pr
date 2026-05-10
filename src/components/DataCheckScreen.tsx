import { validateData } from "../utils/validators";

export function DataCheckScreen() {
  const errors = validateData();
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Data Check</p>
        <h1>{errors.length ? `Ошибки: ${errors.length}` : "OK: структура данных валидна"}</h1>
      </div>
      <article className="lesson-panel">
        {errors.length ? (
          <ul className="error-list">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        ) : (
          <p>Проверены id, связи миров и миссий, seminarQuestionId, sourceStatus, sourceNote, типы заданий, индексы ответов, boss-ответы, lesson, oralAnswer, requiredTopics и покрытие вопросов листка.</p>
        )}
      </article>
    </section>
  );
}
