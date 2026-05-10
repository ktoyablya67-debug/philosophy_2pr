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
        <p>
          Подготовка собрана вокруг пяти устных вопросов листка и терминов для тетради.
          Страницы и разделы учебника привязаны в данных миссий.
        </p>
      </div>

      <article className="lesson-panel">
        <h2>Что выписать в тетрадь</h2>
        <div className="card-grid compact-grid">
          {requiredNotebookTerms.map((term) => {
            const linked = missions.filter((mission) => mission.sourceRefs.notebookTermIds.includes(term.id));
            return (
              <div className="mini-card" key={term.id}>
                <p className="eyebrow">с. {term.assignmentPages.join("-")}</p>
                <h3>{term.label}</h3>
                <p>{term.shortMeaning}</p>
                <p className={linked.length ? "status-ok" : "status-warn"}>
                  {linked.length ? `OK: ${linked.map((mission) => mission.id).join(", ")}` : "WARNING: нет миссий"}
                </p>
              </div>
            );
          })}
        </div>
      </article>

      <div className="card-grid">
        {seminarQuestions.map((question) => {
          const linked = missions.filter((mission) => mission.seminarQuestionId === question.id);
          const fullAnswer = linked.find((mission) => mission.assignmentSubtopic.toLowerCase().includes("итоговый ответ"));
          const firstMission = linked[0];
          const strictMission = fullAnswer ?? firstMission;

          return (
            <article className="mini-card assignment-card" key={question.id}>
              <p className="eyebrow">Вопрос {question.number}</p>
              <h2>{question.title}</h2>
              <p>{question.wording}</p>
              <h3>Подпункты</h3>
              <ul>
                {question.subpoints.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3>Преподаватель точно может спросить</h3>
              <ul>
                {question.teacherMayAsk.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3>Знать от зубов</h3>
              <ul>
                {question.mustKnow.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mission-chip-row">
                {firstMission && <PixelButton onClick={() => onOpenMission(firstMission.id)}>Учить вопрос</PixelButton>}
                {fullAnswer && <PixelButton variant="ghost" onClick={() => onOpenMission(fullAnswer.id)}>Собрать полный ответ</PixelButton>}
                {strictMission && <PixelButton variant="ghost" onClick={() => onOpenMission(strictMission.id)}>Строгий опрос</PixelButton>}
              </div>
              <div className="mission-chip-row">
                {linked.map((mission) => (
                  <PixelButton variant="ghost" key={mission.id} onClick={() => onOpenMission(mission.id)}>
                    {mission.id.toUpperCase()}
                  </PixelButton>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
