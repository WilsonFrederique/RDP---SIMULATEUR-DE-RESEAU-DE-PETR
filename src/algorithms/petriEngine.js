// petriEngine.js
// Moteur de calcul pour un Réseau de Petri (P, T, Pré, Post) et un marquage M.
//
// Modèle de données attendu :
//   places      : [{ id: "P1", label: "P1", marking: 1 }, ...]
//   transitions : [{ id: "T1", label: "T1" }, ...]
//   arcs        : [{ from: "P1", to: "T1", weight: 1 }, ...]
//                 (un arc place->transition alimente Pré,
//                  un arc transition->place alimente Post)

/**
 * Construit les matrices Pré, Post et l'incidence W = Post - Pré
 * à partir des places / transitions / arcs saisis par l'utilisateur.
 */
export function buildMatrices(places, transitions, arcs) {
  const nP = places.length;
  const nT = transitions.length;
  const pIndex = new Map(places.map((p, i) => [p.id, i]));
  const tIndex = new Map(transitions.map((t, i) => [t.id, i]));

  const pre = Array.from({ length: nP }, () => Array(nT).fill(0));
  const post = Array.from({ length: nP }, () => Array(nT).fill(0));

  arcs.forEach((arc) => {
    const w = Number(arc.weight) || 1;

    if (pIndex.has(arc.from) && tIndex.has(arc.to)) {
      // Place -> Transition : arc d'entrée (Pré)
      pre[pIndex.get(arc.from)][tIndex.get(arc.to)] += w;
    } else if (tIndex.has(arc.from) && pIndex.has(arc.to)) {
      // Transition -> Place : arc de sortie (Post)
      post[pIndex.get(arc.to)][tIndex.get(arc.from)] += w;
    }
  });

  const incidence = pre.map((row, i) => row.map((v, j) => post[i][j] - v));

  return { pre, post, incidence };
}

/** Marquage initial sous forme de vecteur, dans l'ordre des places. */
export function initialMarking(places) {
  return places.map((p) => Number(p.marking) || 0);
}

/** Une transition t est franchissable si M(p) >= Pré(p,t) pour toute place p. */
export function isEnabled(marking, pre, tIndex) {
  for (let p = 0; p < marking.length; p++) {
    if (marking[p] < pre[p][tIndex]) return false;
  }
  return true;
}

/** Liste des index de transitions franchissables pour un marquage donné. */
export function getEnabledTransitions(marking, pre, nT) {
  const enabled = [];
  for (let t = 0; t < nT; t++) {
    if (isEnabled(marking, pre, t)) enabled.push(t);
  }
  return enabled;
}

/**
 * Applique la règle de franchissement :
 * Mk = Mi + W . e_t   (e_t = vecteur indicateur de la transition tirée)
 * Retourne le nouveau marquage (ne modifie pas l'original).
 */
export function fireTransition(marking, incidence, tIndex) {
  return marking.map((m, p) => m + incidence[p][tIndex]);
}

/** Un réseau est bloqué (deadlock) si aucune transition n'est franchissable. */
export function isDeadlock(marking, pre, nT) {
  return getEnabledTransitions(marking, pre, nT).length === 0;
}

/** Tire une transition franchissable au hasard ; retourne son index ou null. */
export function pickRandomEnabled(marking, pre, nT) {
  const enabled = getEnabledTransitions(marking, pre, nT);
  if (enabled.length === 0) return null;
  return enabled[Math.floor(Math.random() * enabled.length)];
}
