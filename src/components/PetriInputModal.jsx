import { useState } from "react";
import { LuPlus, LuX, LuTrash2, LuSparkles } from "react-icons/lu";
import "./PetriInputModal.css";

const EXAMPLE = {
  places: [
    { id: "P1", label: "P1", marking: 1 },
    { id: "P2", label: "P2", marking: 0 },
    { id: "P3", label: "P3", marking: 0 },
    { id: "P4", label: "P4", marking: 1 },
  ],
  transitions: [
    { id: "T1", label: "T1" },
    { id: "T2", label: "T2" },
    { id: "T3", label: "T3" },
  ],
  arcs: [
    { from: "P1", to: "T1", weight: 1 },
    { from: "T1", to: "P2", weight: 1 },
    { from: "P2", to: "T2", weight: 1 },
    { from: "P4", to: "T2", weight: 1 },
    { from: "T2", to: "P3", weight: 1 },
    { from: "P3", to: "T3", weight: 1 },
    { from: "T3", to: "P1", weight: 1 },
    { from: "T3", to: "P4", weight: 1 },
  ],
};

function PetriInputModal({ isOpen, onClose, onSave }) {
  const [places, setPlaces] = useState([{ id: "P1", label: "P1", marking: 1 }]);
  const [transitions, setTransitions] = useState([{ id: "T1", label: "T1" }]);
  const [arcs, setArcs] = useState([{ from: "", to: "", weight: 1 }]);

  if (!isOpen) return null;

  const updatePlace = (i, field, value) => {
    const next = [...places];
    next[i] = { ...next[i], [field]: value };
    if (field === "label") next[i].id = value;
    setPlaces(next);
  };
  const updateTransition = (i, field, value) => {
    const next = [...transitions];
    next[i] = { ...next[i], [field]: value };
    if (field === "label") next[i].id = value;
    setTransitions(next);
  };
  const updateArc = (i, field, value) => {
    const next = [...arcs];
    next[i] = { ...next[i], [field]: value };
    setArcs(next);
  };

  const addPlace = () => setPlaces([...places, { id: "", label: "", marking: 0 }]);
  const addTransition = () => setTransitions([...transitions, { id: "", label: "" }]);
  const addArc = () => setArcs([...arcs, { from: "", to: "", weight: 1 }]);

  const removePlace = (i) => places.length > 1 && setPlaces(places.filter((_, idx) => idx !== i));
  const removeTransition = (i) =>
    transitions.length > 1 && setTransitions(transitions.filter((_, idx) => idx !== i));
  const removeArc = (i) => arcs.length > 1 && setArcs(arcs.filter((_, idx) => idx !== i));

  const loadExample = () => {
    setPlaces(EXAMPLE.places);
    setTransitions(EXAMPLE.transitions);
    setArcs(EXAMPLE.arcs);
  };

  const handleSave = () => {
    const validPlaces = places.filter((p) => p.label.trim() !== "");
    const validTransitions = transitions.filter((t) => t.label.trim() !== "");
    const validArcs = arcs.filter((a) => a.from && a.to);

    if (validPlaces.length === 0 || validTransitions.length === 0) {
      alert("Veuillez définir au moins une place et une transition.");
      return;
    }
    if (validArcs.length === 0) {
      alert("Veuillez ajouter au moins un arc reliant places et transitions.");
      return;
    }
    onSave(validPlaces, validTransitions, validArcs);
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-container" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <h2>Nouveau réseau de Petri</h2>
          <button className="pm-close" onClick={onClose} aria-label="Fermer">
            <LuX size={20} />
          </button>
        </div>

        <div className="pm-body">
          {/* Places */}
          <section className="pm-section">
            <div className="pm-section-head">
              <h3>Places (marquage initial)</h3>
              <div className="pm-actions">
                <button className="pm-btn-outline" onClick={loadExample}>
                  <LuSparkles size={14} /> Charger l'exemple
                </button>
                <button className="pm-btn-outline" onClick={addPlace}>
                  <LuPlus size={14} /> Ajouter
                </button>
              </div>
            </div>
            <div className="pm-table-wrapper">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Jetons initiaux</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="pm-input"
                          placeholder="ex: P1"
                          value={p.label}
                          onChange={(e) => updatePlace(i, "label", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="pm-input"
                          value={p.marking}
                          onChange={(e) => updatePlace(i, "marking", e.target.value)}
                        />
                      </td>
                      <td className="pm-action-cell">
                        {places.length > 1 && (
                          <button className="pm-remove" onClick={() => removePlace(i)}>
                            <LuTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transitions */}
          <section className="pm-section">
            <div className="pm-section-head">
              <h3>Transitions</h3>
              <div className="pm-actions">
                <button className="pm-btn-outline" onClick={addTransition}>
                  <LuPlus size={14} /> Ajouter
                </button>
              </div>
            </div>
            <div className="pm-table-wrapper">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transitions.map((t, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="pm-input"
                          placeholder="ex: T1"
                          value={t.label}
                          onChange={(e) => updateTransition(i, "label", e.target.value)}
                        />
                      </td>
                      <td className="pm-action-cell">
                        {transitions.length > 1 && (
                          <button className="pm-remove" onClick={() => removeTransition(i)}>
                            <LuTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Arcs */}
          <section className="pm-section">
            <div className="pm-section-head">
              <h3>Arcs (Place → Transition ou Transition → Place)</h3>
              <div className="pm-actions">
                <button className="pm-btn-outline" onClick={addArc}>
                  <LuPlus size={14} /> Ajouter
                </button>
              </div>
            </div>
            <div className="pm-table-wrapper">
              <table className="pm-table">
                <thead>
                  <tr>
                    <th>Départ</th>
                    <th>Arrivée</th>
                    <th>Poids</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arcs.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="pm-input"
                          placeholder="P1 ou T1"
                          value={a.from}
                          onChange={(e) => updateArc(i, "from", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="pm-input"
                          placeholder="T1 ou P1"
                          value={a.to}
                          onChange={(e) => updateArc(i, "to", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="pm-input"
                          value={a.weight}
                          onChange={(e) => updateArc(i, "weight", e.target.value)}
                        />
                      </td>
                      <td className="pm-action-cell">
                        {arcs.length > 1 && (
                          <button className="pm-remove" onClick={() => removeArc(i)}>
                            <LuTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pm-hint">
              Un nom qui correspond à une place existante et un autre à une transition existante
              détermine automatiquement le sens de l'arc (entrée ou sortie).
            </p>
          </section>
        </div>

        <div className="pm-footer">
          <button className="pm-btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="pm-btn-primary" onClick={handleSave}>
            Créer le réseau
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetriInputModal;
