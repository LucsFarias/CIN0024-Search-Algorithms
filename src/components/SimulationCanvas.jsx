// =============================================================
// components/SimulationCanvas.jsx
// Só o container onde o p5 vai desenhar o canvas (ver useP5Sketch,
// que usa containerRef.current como segundo argumento de `new p5()`).
// =============================================================

export default function SimulationCanvas({ containerRef }) {
  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-md border-2 border-neutral-700 shadow-lg"
    />
  );
}
