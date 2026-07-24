import { useEffect, useState } from "react";
import { LuPlus, LuX, LuTrash2, LuSparkles } from "react-icons/lu";
import "./PetriInputModal.css";

let idCounter = 0;
const genId = (prefix) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`;

const EXAMPLE = () => {
  const p1 = genId("p"), p2 = genId("p"), p3 = genId("p"), p4 = genId("p");
  const t1 = genId("t"), t2 = genId("t"), t3 = genId("t");
  return {
    places: [
      { id: p1, label: "P1", marking: 1 },
      { id: p2, label: "P2", marking: 0 },
      { id: p3, label: "P3", marking: 0 },
      { id: p4, label: "P4", marking: 1 },
    ],
    transitions: [
      { id: t1, label: "T1" },
      { id: t2, label: "T2" },
      { id: t3, label: "T3" },
    ],
    arcs: [
      { id: genId("arc"), from: p1, to: t1, weight: 1 },
      { id: genId("arc"), from: t1, to: p2, weight: 1 },
      { id: genId("arc"), from: p2, to: t2, weight: 1 },
      { id: genId("arc"), from: p4, to: t2, weight: 1 },
      { id: genId("arc"), from: t2, to: p3, weight: 1 },
      { id: genId("arc"), from: p3, to: t3, weight: 1 },
      { id: genId("arc"), from: t3, to: p1, weight: 1 },
      { id: genId("arc"), from: t3, to: p4, weight: 1 },
    ],
  };
};

function blankPlace() {
  return { id: genId("p"), label: "", marking: 0 };
}
function blankTransition() {
  return { id: genId("t"), label: "" };
}
function blankArc() {
  return { id: genId("arc"), from: "", to: "", weight: 1 };
}

/**
 * Modal de création ET d'édition d'un réseau de Petri.
 * Si initialPlaces/initialTransitions/initialArcs sont fournis (réseau déjà
 * chargé dans le contexte), le formulaire s'ouvre pré-rempli pour permettre
 * d'ajouter, renommer ou supprimer des éléments sans repartir de zéro.
 *
 * L'id de chaque place/transition est stable et indépendant de son label :
 * renommer un élément ne casse donc jamais les arcs qui le référencent.
 */
function PetriInputModal({ isOpen, onClose, onSave, initialPlaces, initialTransitions, initialArcs }) {
  const [places, setPlaces] = useState([blankPlace()]);
  const [transitions, setTransitions] = useState([blankTransition()]);
  const [arcs, setArcs] = useState([blankArc()]);

  // Pré-remplissage à chaque ouverture du modal avec le réseau courant (édition)
  useEffect(() => {
    if (!isOpen) return;

    setPlaces(
      initialPlaces && initialPlaces.length
        ? initialPlaces.map((p) => ({ ...p }))
        : [blankPlace()]
    );
    setTransitions(
      initialTransitions && initialTransitions.length
        ? initialTransitions.map((t) => ({ ...t }))
        : [blankTransition()]
    );
    setArcs(
      initialArcs && initialArcs.length
        ? initialArcs.map((a) => ({ id: a.id || genId("arc"), ...a }))
        : [blankArc()]
    );
  }, [isOpen, initialPlaces, initialTransitions, initialArcs]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialPlaces && initialPlaces.length);

  const updatePlace = (i, field, value) => {
    const next = [...places];
    next[i] = { ...next[i], [field]: value };
    setPlaces(next);
  };
  const updateTransition = (i, field, value) => {
    const next = [...transitions];
    next[i] = { ...next[i], [field]: value };
    setTransitions(next);
  };
  const updateArc = (i, field, value) => {
    const next = [...arcs];
    next[i] = { ...next[i], [field]: value };
    // Si on change le point de départ, on invalide l'arrivée si elle devient incohérente
    if (field === "from") {
      const fromKind = kindOf(value);
      const toKind = kindOf(next[i].to);
      if (fromKind && toKind && fromKind === toKind) next[i].to = "";
    }
    setArcs(next);
  };

  const addPlace = () => setPlaces([...places, blankPlace()]);
  const addTransition = () => setTransitions([...transitions, blankTransition()]);
  const addArc = () => setArcs([...arcs, blankArc()]);

  const removePlace = (i) => places.length > 1 && setPlaces(places.filter((_, idx) => idx !== i));
  const removeTransition = (i) =>
    transitions.length > 1 && setTransitions(transitions.filter((_, idx) => idx !== i));
  const removeArc = (i) => arcs.length > 1 && setArcs(arcs.filter((_, idx) => idx !== i));

  const loadExample = () => {
    const ex = EXAMPLE();
    setPlaces(ex.places);
    setTransitions(ex.transitions);
    setArcs(ex.arcs);
  };

  // Détermine si un id appartient à une place, une transition, ou aucun des deux
  function kindOf(id) {
    if (places.some((p) => p.id === id)) return "place";
    if (transitions.some((t) => t.id === id)) return "transition";
    return null;
  }

  const optionsFor = (kind) =>
    kind === "place"
      ? places.filter((p) => p.label.trim() !== "")
      : transitions.filter((t) => t.label.trim() !== "");

  const handleSave = () => {
    const validPlaces = places.filter((p) => p.label.trim() !== "");
    const validTransitions = transitions.filter((t) => t.label.trim() !== "");

    if (validPlaces.length === 0 || validTransitions.length === 0) {
      alert("Veuillez définir au moins une place et une transition.");
      return;
    }

    const validIds = new Set([...validPlaces.map((p) => p.id), ...validTransitions.map((t) => t.id)]);
    const validArcs = arcs.filter(
      (a) => a.from && a.to && validIds.has(a.from) && validIds.has(a.to)
    );

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
          <h2>{isEditing ? "Modifier le réseau de Petri" : "Nouveau réseau de Petri"}</h2>
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
                    <tr key={p.id}>
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
                    <tr key={t.id}>
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
                  {arcs.map((a, i) => {
                    const fromKind = kindOf(a.from);
                    const toKind = fromKind === "place" ? "transition" : fromKind === "transition" ? "place" : null;

                    return (
                      <tr key={a.id}>
                        <td>
                          <select
                            className="pm-input"
                            value={a.from}
                            onChange={(e) => updateArc(i, "from", e.target.value)}
                          >
                            <option value="">-- Choisir --</option>
                            <optgroup label="Places">
                              {optionsFor("place").map((p) => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Transitions">
                              {optionsFor("transition").map((t) => (
                                <option key={t.id} value={t.id}>{t.label}</option>
                              ))}
                            </optgroup>
                          </select>
                        </td>
                        <td>
                          <select
                            className="pm-input"
                            value={a.to}
                            disabled={!fromKind}
                            onChange={(e) => updateArc(i, "to", e.target.value)}
                          >
                            <option value="">-- Choisir --</option>
                            {toKind &&
                              optionsFor(toKind).map((el) => (
                                <option key={el.id} value={el.id}>{el.label}</option>
                              ))}
                          </select>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="pm-hint">
              Choisissez d'abord le point de départ : la liste d'arrivée se limite automatiquement
              à l'autre catégorie (une place ne peut être reliée qu'à une transition, et inversement).
            </p>
          </section>
        </div>

        <div className="pm-footer">
          <button className="pm-btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="pm-btn-primary" onClick={handleSave}>
            {isEditing ? "Enregistrer les modifications" : "Créer le réseau"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetriInputModal;
