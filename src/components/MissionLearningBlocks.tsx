import type { LearningMission, MissionVisualBlock } from "../types";

type MissionBlockProps = {
  mission: LearningMission;
};

function IconBadge({ children }: { children: string }) {
  return <span className="icon-badge" aria-hidden="true">{children}</span>;
}

export function MissionIntroCard({ mission }: MissionBlockProps) {
  return (
    <section className="mission-intro-card">
      <p className="eyebrow">Комната миссии</p>
      <h1>{mission.title}</h1>
      <p className="scene-text">{mission.introScene || mission.scene}</p>
      <div className="reward-strip">
        <span>+ понимание темы</span>
        <span>+ защита от ловушки</span>
        <span>+ устный ответ</span>
      </div>
    </section>
  );
}

export function PixelSceneCard({ mission }: MissionBlockProps) {
  const subtitle = mission.quickExplain || mission.subtitle;
  return (
    <section className="pixel-scene-card">
      <div className="pixel-scene-mini" aria-hidden="true">
        <span className="pixel-sky" />
        <span className="pixel-ground" />
        <span className="pixel-tower" />
        <span className="pixel-window" />
        <span className="pixel-spark one" />
        <span className="pixel-spark two" />
      </div>
      <div>
        <p className="eyebrow">Pixel vibe</p>
        <strong>{mission.subtitle}</strong>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function FlowDiagram({ block }: { block: Extract<MissionVisualBlock, { type: "flow" }> }) {
  return (
    <div className="flow-diagram">
      {block.items.map((item, index) => (
        <div className="flow-node" key={`${item}-${index}`}>
          <span>{index + 1}</span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({ block }: { block: Extract<MissionVisualBlock, { type: "comparison" }> }) {
  return (
    <div className="comparison-table" role="table" aria-label={block.title}>
      <div className="comparison-head" role="row">
        <span />
        <strong>{block.leftTitle}</strong>
        <strong>{block.rightTitle}</strong>
      </div>
      {block.rows.map((row) => (
        <div className="comparison-row" role="row" key={row.label}>
          <strong>{row.label}</strong>
          <p>{row.left}</p>
          <p>{row.right}</p>
        </div>
      ))}
    </div>
  );
}

function ConceptCards({ block }: { block: Extract<MissionVisualBlock, { type: "cards" }> }) {
  return (
    <div className="concept-card-grid">
      {block.cards.map((card) => (
        <article className="concept-card" key={card.title}>
          <strong>{card.title}</strong>
          <p>{card.text}</p>
        </article>
      ))}
    </div>
  );
}

export function MiniDiagram({ block }: { block: MissionVisualBlock }) {
  return (
    <section className="learning-card visual-card">
      <div className="card-heading"><IconBadge>◆</IconBadge><h2>{block.title}</h2></div>
      {block.type === "flow" && <FlowDiagram block={block} />}
      {block.type === "comparison" && <ComparisonTable block={block} />}
      {block.type === "cards" && <ConceptCards block={block} />}
    </section>
  );
}

export function QuickTakeCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card quick-card">
      <div className="card-heading"><IconBadge>!</IconBadge><h2>Если по-человечески</h2></div>
      <p>{mission.quickExplain}</p>
    </section>
  );
}

export function ConceptCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-grid">
      {mission.lesson.blocks.map((block) => (
        <article className="learning-card" key={block.title}>
          <div className="card-heading"><IconBadge>§</IconBadge><h2>{block.title}</h2></div>
          <p>{block.text}</p>
        </article>
      ))}
    </section>
  );
}

export function KeyTakeawaysList({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card takeaways-card">
      <div className="card-heading"><IconBadge>✓</IconBadge><h2>Запомни главное</h2></div>
      <ul className="compact-list">
        {mission.keyTakeaways.slice(0, 6).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function AnalogyCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card analogy-card">
      <div className="card-heading"><IconBadge>≈</IconBadge><h2>Аналогия</h2></div>
      <p>{mission.analogy}</p>
      <p className="friendly-aside">{mission.miniJoke}</p>
    </section>
  );
}

export function MemoryHookCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card memory-card">
      <div className="card-heading"><IconBadge>*</IconBadge><h2>Крючок памяти</h2></div>
      <p>{mission.memoryHook}</p>
    </section>
  );
}

export function TrapCard({ mission }: MissionBlockProps) {
  const trap = mission.teacherTraps[0];
  return (
    <section className="learning-card trap-card">
      <div className="card-heading"><IconBadge>×</IconBadge><h2>Типичная ошибка</h2></div>
      <p><strong>{trap.falseStatement}</strong></p>
      <p>{trap.correction}</p>
    </section>
  );
}

export function TeacherQuestionCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card teacher-card">
      <div className="card-heading"><IconBadge>?</IconBadge><h2>Как это спросит препод</h2></div>
      <ul className="compact-list">
        {mission.teacherQuestions.slice(0, 3).map((question) => <li key={question}>{question}</li>)}
      </ul>
    </section>
  );
}

export function OralAnswerAccordion({ mission }: MissionBlockProps) {
  return (
    <details className="learning-details oral-answer">
      <summary>Готовый устный ответ</summary>
      <div className="answer-columns">
        <article>
          <h3>40 секунд</h3>
          <p>{mission.oralAnswer.answer40sec}</p>
        </article>
        <article>
          <h3>2 минуты</h3>
          <p>{mission.oralAnswer.answer2min}</p>
        </article>
      </div>
      <h3>Скелет</h3>
      <ol className="compact-list">
        {mission.oralAnswer.answerSkeleton.map((item) => <li key={item}>{item}</li>)}
      </ol>
      <h3>Стратегия</h3>
      <p>{mission.answerStrategy}</p>
    </details>
  );
}

export function CheatSheetCard({ mission }: MissionBlockProps) {
  return (
    <section className="learning-card cheat-card">
      <div className="card-heading"><IconBadge>#</IconBadge><h2>Термины</h2></div>
      <div className="tag-row">{mission.lesson.keyTerms.map((term) => <span className="badge" key={term}>{term}</span>)}</div>
    </section>
  );
}
