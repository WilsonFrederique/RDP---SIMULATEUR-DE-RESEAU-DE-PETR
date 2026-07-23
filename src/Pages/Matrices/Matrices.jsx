import { LuTable2 } from "react-icons/lu";
import MatrixTable from "../../components/MatrixTable";
import { usePetri } from "../../context/PetriContext";
import "./Modal.css";

function Matrices() {
  const { places, transitions, matrices, history, hasNetwork } = usePetri();

  if (!hasNetwork) {
    return (
      <div className="mx-page">
        <div className="mx-empty">
          <LuTable2 size={32} />
          <h3>Aucune matrice à afficher</h3>
          <p>Créez un réseau depuis la page Simulateur pour voir les matrices Pré, Post et W.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-page">
      <div className="mx-header">
        <LuTable2 size={20} />
        <h2>Matrices du réseau</h2>
      </div>

      <div className="mx-grid">
        <MatrixTable
          title="Matrice Pré"
          badge="Places → Transitions"
          matrix={matrices.pre}
          places={places}
          transitions={transitions}
        />
        <MatrixTable
          title="Matrice Post"
          badge="Transitions → Places"
          matrix={matrices.post}
          places={places}
          transitions={transitions}
        />
        <MatrixTable
          title="Matrice d'incidence W = Post − Pré"
          badge="Évolution"
          matrix={matrices.incidence}
          places={places}
          transitions={transitions}
        />
      </div>

      <div className="mx-history-card">
        <div className="mx-history-head">
          <h3>Historique des marquages</h3>
          <span className="mx-history-formula">Mₖ = Mᵢ + W · Sᵀ</span>
        </div>
        <div className="mx-scroll">
          <table className="mx-history-table">
            <thead>
              <tr>
                <th>Étape</th>
                <th>Transition tirée</th>
                {places.map((p) => (
                  <th key={p.id}>{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((step, i) => (
                <tr key={i} className={i === history.length - 1 ? "mx-current-row" : ""}>
                  <td>{i}</td>
                  <td>
                    {step.firedTransition !== null
                      ? transitions[step.firedTransition]?.label
                      : "— (initial)"}
                  </td>
                  {step.marking.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Matrices;
