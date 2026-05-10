import { seminarQuestions } from "../data/gameData";
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
        <p>Главный маршрут подготовки построен по этим вопросам. Вопросы 4 и 5 перенесены с фото листка дословно по смыслу; вопросы 1-3 восстановлены по списку тем задания и должны быть сверены с первой страницей листка, если она появится.</p>
      </div>
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
