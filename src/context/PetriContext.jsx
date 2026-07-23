import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  buildMatrices,
  initialMarking,
  getEnabledTransitions,
  fireTransition,
  pickRandomEnabled,
} from "../algorithms/petriEngine";

const PetriContext = createContext(null);

export function PetriProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [arcs, setArcs] = useState([]);

  const [matrices, setMatrices] = useState({ pre: [], post: [], incidence: [] });
  const [marking, setMarking] = useState([]);
  const [history, setHistory] = useState([]); // [{ marking, firedTransition }]
  const [lastFired, setLastFired] = useState(null);

  const hasNetwork = places.length > 0 && transitions.length > 0;

  const loadNetwork = useCallback((newPlaces, newTransitions, newArcs) => {
    const built = buildMatrices(newPlaces, newTransitions, newArcs);
    const m0 = initialMarking(newPlaces);

    setPlaces(newPlaces);
    setTransitions(newTransitions);
    setArcs(newArcs);
    setMatrices(built);
    setMarking(m0);
    setHistory([{ marking: m0, firedTransition: null }]);
    setLastFired(null);
  }, []);

  const reset = useCallback(() => {
    const m0 = initialMarking(places);
    setMarking(m0);
    setHistory([{ marking: m0, firedTransition: null }]);
    setLastFired(null);
  }, [places]);

  const fire = useCallback(
    (tIndex) => {
      setMarking((current) => {
        const enabled = getEnabledTransitions(current, matrices.pre, transitions.length);
        if (!enabled.includes(tIndex)) return current;

        const next = fireTransition(current, matrices.incidence, tIndex);
        setHistory((h) => [...h, { marking: next, firedTransition: tIndex }]);
        setLastFired(tIndex);
        return next;
      });
    },
    [matrices, transitions.length]
  );

  const fireRandom = useCallback(() => {
    const tIndex = pickRandomEnabled(marking, matrices.pre, transitions.length);
    if (tIndex !== null) fire(tIndex);
    return tIndex;
  }, [marking, matrices, transitions.length, fire]);

  const enabledTransitions = useMemo(
    () => (hasNetwork ? getEnabledTransitions(marking, matrices.pre, transitions.length) : []),
    [marking, matrices, transitions.length, hasNetwork]
  );

  const value = {
    places,
    transitions,
    arcs,
    matrices,
    marking,
    history,
    lastFired,
    enabledTransitions,
    hasNetwork,
    isDeadlocked: hasNetwork && enabledTransitions.length === 0,
    loadNetwork,
    reset,
    fire,
    fireRandom,
  };

  return <PetriContext.Provider value={value}>{children}</PetriContext.Provider>;
}

export function usePetri() {
  const ctx = useContext(PetriContext);
  if (!ctx) throw new Error("usePetri doit être utilisé à l'intérieur d'un <PetriProvider>");
  return ctx;
}
