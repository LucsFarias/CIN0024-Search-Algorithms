// =============================================================
// components/SimulationCanvas.jsx
// Só o container onde o p5 vai desenhar o canvas (ver useP5Sketch,
// que usa containerRef.current como segundo argumento de `new p5()`).
// =============================================================

export default function SimulationCanvas({ containerRef }) {
  return (
    <div
      ref={containerRef}
      className="max-w-full overflow-hidden border border-[#52584b] shadow-[0_8px_36px_#0008] leading-none max-[720px]:w-full [&>canvas]:block [&>canvas]:h-auto [&>canvas]:max-w-full max-[720px]:[&>canvas]:w-full max-[720px]:[&>canvas]:h-auto!"
    />
  );
}
