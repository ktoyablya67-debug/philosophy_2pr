import { getCoverageRows } from "../utils/validators";

export function CoverageCheckScreen() {
  const rows = getCoverageRows();
  const warnings = rows.filter((row) => row.status === "WARNING").length;
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Coverage Check</p>
        <h1>{warnings ? `WARNING: ${warnings}` : "OK: все темы покрыты"}</h1>
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
            {rows.map((row) => (
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
