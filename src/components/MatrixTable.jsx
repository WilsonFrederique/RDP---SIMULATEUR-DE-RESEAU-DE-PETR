import "./MatrixTable.css";

/**
 * Affiche une matrice places x transitions (Pré, Post ou Incidence).
 */
function MatrixTable({ title, badge, matrix, places, transitions }) {
  return (
    <div className="matrix-card">
      <div className="matrix-card-head">
        <h4>{title}</h4>
        {badge && <span className="matrix-badge">{badge}</span>}
      </div>
      <div className="matrix-scroll">
        <table className="matrix-grid">
          <thead>
            <tr>
              <th className="matrix-corner"></th>
              {transitions.map((t) => (
                <th key={t.id}>{t.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={places[i]?.id ?? i}>
                <th>{places[i]?.label}</th>
                {row.map((value, j) => (
                  <td key={j} className={value > 0 ? "positive" : value < 0 ? "negative" : ""}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MatrixTable;
