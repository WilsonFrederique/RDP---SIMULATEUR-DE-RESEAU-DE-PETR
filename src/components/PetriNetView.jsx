import { useEffect, useMemo, useState } from "react";
import { ReactFlow, Background, Controls, Handle, Position } from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import "./PetriNetView.css";

const PLACE_SIZE = 74;
const TRANSITION_W = 18;
const TRANSITION_H = 60;

function PlaceNode({ data }) {
  const tokens = data.tokens ?? 0;
  const dots = Math.min(tokens, 5);

  return (
    <div className="petri-place-node">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="place-circle">
        <div className={`place-tokens tokens-${dots}`}>
          {tokens === 0 && <span className="place-count-zero">0</span>}
          {tokens > 0 &&
            tokens <= 5 &&
            Array.from({ length: tokens }).map((_, i) => <span key={i} className="token-dot" />)}
          {tokens > 5 && <span className="place-count">{tokens}</span>}
        </div>
      </div>
      <span className="place-label">{data.label}</span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function TransitionNode({ data }) {
  return (
    <div
      className={`petri-transition-node ${data.enabled ? "enabled" : "disabled"} ${
        data.justFired ? "just-fired" : ""
      }`}
      onClick={() => data.enabled && data.onFire?.()}
      title={data.enabled ? "Cliquer pour franchir" : "Non franchissable"}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <span className="transition-label">{data.label}</span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { place: PlaceNode, transition: TransitionNode };

function layout(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 55, ranksep: 90 });

  nodes.forEach((n) => {
    const w = n.type === "place" ? PLACE_SIZE : TRANSITION_W;
    const h = n.type === "place" ? PLACE_SIZE : TRANSITION_H;
    g.setNode(n.id, { width: w, height: h });
  });
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const w = n.type === "place" ? PLACE_SIZE : TRANSITION_W;
    const h = n.type === "place" ? PLACE_SIZE : TRANSITION_H;
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });
}

function PetriNetView({ places, transitions, arcs, marking, enabledTransitions, lastFired, onFire }) {
  const [rfNodes, setRfNodes] = useState([]);
  const [rfEdges, setRfEdges] = useState([]);

  const rawNodes = useMemo(() => {
    const placeNodes = places.map((p, i) => ({
      id: p.id,
      type: "place",
      data: { label: p.label, tokens: marking[i] ?? 0 },
      position: { x: 0, y: 0 },
    }));
    const transitionNodes = transitions.map((t, i) => ({
      id: t.id,
      type: "transition",
      data: {
        label: t.label,
        enabled: enabledTransitions.includes(i),
        justFired: lastFired === i,
        onFire: () => onFire(i),
      },
      position: { x: 0, y: 0 },
    }));
    return [...placeNodes, ...transitionNodes];
  }, [places, transitions, marking, enabledTransitions, lastFired, onFire]);

  const rawEdges = useMemo(
    () =>
      arcs.map((arc, i) => ({
        id: `arc-${i}`,
        source: arc.from,
        target: arc.to,
        type: "smoothstep",
        markerEnd: { type: "arrowclosed" },
        label: Number(arc.weight) > 1 ? String(arc.weight) : "",
        style: { stroke: "#94a3b8", strokeWidth: 1.8 },
        labelStyle: { fill: "#475569", fontWeight: 600, fontSize: 11 },
      })),
    [arcs]
  );

  useEffect(() => {
    if (rawNodes.length === 0) return;
    const laidOut = layout(rawNodes, rawEdges);
    setRfNodes(laidOut);
    setRfEdges(rawEdges);
  }, [rawNodes, rawEdges]);

  if (places.length === 0) {
    return (
      <div className="petri-view-empty">
        <p>Aucun réseau chargé.</p>
      </div>
    );
  }

  return (
    <div className="petri-view-canvas">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1} color="#e2e8f0" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default PetriNetView;
