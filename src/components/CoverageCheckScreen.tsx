import { missions } from "../data/gameData";
import { getCoverageRows, getNotebookCoverageRows, getSeminarCoverageRows } from "../utils/validators";

export function CoverageCheckScreen() {
  const topicRows = getCoverageRows();
  const seminarRows = getSeminarCoverageRows();
  const notebookRows = getNotebookCoverageRows();
  const warnings = topicRows.filter((row) => row.status === "WARNING").length + seminarRows.filter((row) => row.status === "WARNING").length + notebookRows.filter((row) => row.status === "WARNING").length;
  const sourceStats = {
    textbook: missions.filter((mission) => mission.sourceStatus === "textbook_verified").length,
    assignment: missions.filter((mission) => mission.sourceStatus === "assignment_based").length,
    review: missions.filter((mission) => mission.sourceStatus === "needs_textbook_review").length,
  };
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Coverage Check</p>
        <h1>{warnings ? `WARNING: ${warnings}` : "OK: темы и вопросы листка покрыты"}</h1>
        <p>Source verification: textbook_verified {sourceStats.textbook}, assignment_based {sourceStats.assignment}, needs_textbook_review {sourceStats.review}</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Вопрос листка</th>
              <th>Миссии</th>
              <th>Boss</th>
              <th>Trap</th>
              <th>Oral</th>
              <th>Step</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {seminarRows.map((row) => (
              <tr key={row.seminarQuestionId} className={row.status === "OK" ? "ok" : "warn"}>
                <td>{row.seminarQuestionId}: {row.question}</td>
                <td>{row.hasMission ? row.missionIds.join(", ") : "WARNING"}</td>
                <td>{row.hasBoss ? "OK" : "WARNING"}</td>
                <td>{row.hasTrap ? "OK" : "WARNING"}</td>
                <td>{row.hasOralAnswer ? "OK" : "WARNING"}</td>
                <td>{row.hasInteractiveStep ? "OK" : "WARNING"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Термин для тетради</th>
              <th>Миссии</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {notebookRows.map((row) => (
              <tr key={row.notebookTermId} className={row.status === "OK" ? "ok" : "warn"}>
                <td>{row.label}</td>
                <td>{row.missionIds.join(", ") || "WARNING"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Тема</th>
              <th>Mission</th>
              <th>Lesson/Step</th>
              <th>Step</th>
              <th>Boss</th>
              <th>Trap</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {topicRows.map((row) => (
              <tr key={row.topic} className={row.status === "OK" ? "ok" : "warn"}>
                <td>{row.topic}</td>
                <td>{row.inMissionTopics ? "OK" : "WARNING"}</td>
                <td>{row.inLessonOrCoveredTopics ? "OK" : "WARNING"}</td>
                <td>{row.hasStep ? "OK" : "WARNING"}</td>
                <td>{row.hasBoss ? "OK" : "WARNING"}</td>
                <td>{row.hasTrap ? "OK" : "WARNING"}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
