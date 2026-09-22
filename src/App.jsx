// =============================================================
// App.jsx
// Orquestra o componente de controles (Tailwind/DOM comum) com o
// canvas do p5 (via useP5Sketch). Guarda em state só o que precisa
// re-renderizar a UI React (algoritmo escolhido, contador de comidas);
// o resto (posições, estado da busca, etc.) vive dentro do sketch p5,
// fora do ciclo de render do React — não faria sentido colocar 60
// atualizações de posição por segundo no state do React.
// =============================================================

import { useRef, useState, useCallback } from 'react';
import ControlsPanel from './components/ControlsPanel.jsx';
import SimulationCanvas from './components/SimulationCanvas.jsx';
import { useP5Sketch } from './hooks/useP5Sketch.js';
import { DEFAULT_ALGORITHM } from './engine/search/index.js';

export default function App() {
  const containerRef = useRef(null);
  const algorithmRef = useRef(DEFAULT_ALGORITHM);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [foodsCollected, setFoodsCollected] = useState(0);

  const handleFoodCollected = useCallback(() => {
    setFoodsCollected((count) => count + 1);
  }, []);

  const p5InstanceRef = useP5Sketch({
    containerRef,
    algorithmRef,
    onFoodCollected: handleFoodCollected,
  });

  function handleAlgorithmChange(newAlgorithm) {
    algorithmRef.current = newAlgorithm;
    setSelectedAlgorithm(newAlgorithm);
    // Obs: a troca só é aplicada na PRÓXIMA busca (quando a comida
    // atual for coletada ou o mapa for reiniciado) — o sketch lê
    // algorithmRef.current apenas no início de cada startSearch().
  }

  function handleRestart() {
    p5InstanceRef.current?.restartSimulation();
    setFoodsCollected(0);
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-neutral-900 p-6">
      <h1 className="text-xl font-semibold text-neutral-100">
        Agente Coletor de Comida — Estratégias de Busca
      </h1>

      <ControlsPanel
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={handleAlgorithmChange}
        onRestart={handleRestart}
        foodsCollected={foodsCollected}
      />

      <SimulationCanvas containerRef={containerRef} />
    </div>
  );
}
