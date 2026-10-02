// =============================================================
// components/SimulationCanvas.jsx
// Só o container onde o p5 vai desenhar o canvas (ver useP5Sketch,
// que usa containerRef.current como segundo argumento de `new p5()`).
// =============================================================

export default function SimulationCanvas({ containerRef }) {
  return (
    <div
      ref={containerRef}
      className="max-w-full overflow-hidden border border-[#52584b] shadow-lg leading-none max-md:w-full [&>canvas]:block [&>canvas]:h-auto [&>canvas]:max-w-full max-md:[&>canvas]:w-full max-md:[&>canvas]:h-auto!"
    />
  );
}
