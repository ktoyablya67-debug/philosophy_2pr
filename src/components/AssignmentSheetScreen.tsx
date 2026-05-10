import { missions, requiredNotebookTerms, seminarQuestions } from "../data/gameData";
import { PixelButton } from "./PixelButton";

type Props = {
  onOpenMission: (id: string) => void;
};

export function AssignmentSheetScreen({ onOpenMission }: Props) {
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Листок задания</p>
        <h1>Что спросят на семинаре</h1>
        <p>Маршрут подготовки построен по пяти устным вопросам и списку терминов для тетради. Страницы и разделы источника привязаны в данных миссий.</p>
      </div>

      <article className="lesson-panel">
        <h2>Что выписать в тетрадь</h2>
        <div className="tag-row">
          {requiredNotebookTerms.map((term) => {
            const covered = missions.some((mission) => mission.sourceRefs.notebookTermIds.includes(term.id));
            return (
              <span className={`badge ${covered ? "" : "danger"}`} key={term.id}>
                {term.label} · с. {term.assignmentPages.join("-")} · {covered ? "OK" : "WARNING"}
              </span>
            );
          })}
        </div>
      </article>

      <div className="card-grid">
        {seminarQuestions.map((question) => (
          <article className="mini-card assignment-card" key={question.id}>
            <p className="eyebrow">Вопрос {question.number}</p>
            <h2>{question.title}</h2>
            <p>{question.wording}</p>
            <h3>Знать от зубов</h3>
            <ul>
              {question.mustKnow.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="mission-chip-row">
              {question.missionIds.map((id) => (
                <PixelButton variant="ghost" key={id} onClick={() => onOpenMission(id)}>{id.toUpperCase()}</PixelButton>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
