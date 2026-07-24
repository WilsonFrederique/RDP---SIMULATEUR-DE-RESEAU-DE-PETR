import { useState } from "react";
import { LuPlus, LuPencil, LuShuffle, LuRotateCcw, LuGitGraph } from "react-icons/lu";
import PetriInputModal from "../../components/PetriInputModal";
import PetriNetView from "../../components/PetriNetView";
import { usePetri } from "../../context/PetriContext";
import "./Modal.css";

function Simulateur() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("new"); // "new" | "edit"
  const {
    places,
    transitions,
    arcs,
    marking,
    enabledTransitions,
    lastFired,
    hasNetwork,
    isDeadlocked,
    loadNetwork,
    fire,
    fireRandom,
    reset,
  } = usePetri();

  return (
    <div className="sim-page">
      <div className="sim-toolbar">
        <div className="sim-toolbar-title">
          <LuGitGraph size={20} />
          <h2>Simulateur</h2>
        </div>

        <div className="sim-toolbar-actions">
          <button
            className="sim-btn sim-btn-primary"
            onClick={() => {
              setModalMode("new");
              setIsModalOpen(true);
            }}
          >
            <LuPlus size={16} /> Nouveau réseau
          </button>
          {hasNetwork && (
            <button
              className="sim-btn sim-btn-ghost"
              onClick={() => {
                setModalMode("edit");
                setIsModalOpen(true);
              }}
            >
              <LuPencil size={16} /> Modifier le réseau
            </button>
          )}
          <button
            className="sim-btn sim-btn-accent"
            onClick={fireRandom}
            disabled={!hasNetwork || isDeadlocked}
          >
            <LuShuffle size={16} /> Franchir au hasard
          </button>
          <button className="sim-btn sim-btn-ghost" onClick={reset} disabled={!hasNetwork}>
            <LuRotateCcw size={16} /> Réinitialiser
          </button>
        </div>
      </div>

      <div className="sim-layout">
        <div className="sim-graph-panel">
          {isDeadlocked && (
            <div className="sim-deadlock-banner">
              Aucune transition n'est franchissable : le réseau est bloqué.
            </div>
          )}
          <PetriNetView
            places={places}
            transitions={transitions}
            arcs={arcs}
            marking={marking}
            enabledTransitions={enabledTransitions}
            lastFired={lastFired}
            onFire={fire}
          />
        </div>

        <aside className="sim-side-panel">
          <div className="sim-card">
            <h3>Marquage courant</h3>
            {hasNetwork ? (
              <ul className="sim-marking-list">
                {places.map((p, i) => (
                  <li key={p.id}>
                    <span>{p.label}</span>
                    <strong>{marking[i]}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sim-empty-hint">Créez un réseau pour commencer.</p>
            )}
          </div>

          <div className="sim-card">
            <h3>Transitions franchissables</h3>
            {hasNetwork && enabledTransitions.length > 0 ? (
              <div className="sim-chip-list">
                {enabledTransitions.map((tIndex) => (
                  <button
                    key={transitions[tIndex].id}
                    className="sim-chip"
                    onClick={() => fire(tIndex)}
                  >
                    {transitions[tIndex].label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="sim-empty-hint">
                {hasNetwork ? "Aucune transition franchissable." : "—"}
              </p>
            )}
          </div>
        </aside>
      </div>

      <PetriInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlaces={modalMode === "edit" ? places : null}
        initialTransitions={modalMode === "edit" ? transitions : null}
        initialArcs={modalMode === "edit" ? arcs : null}
        onSave={(newPlaces, newTransitions, newArcs) => {
          loadNetwork(newPlaces, newTransitions, newArcs);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default Simulateur;
