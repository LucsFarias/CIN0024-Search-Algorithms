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
  // Espelha o estado de autoplay do sketch p5 só pra pintar o botão
  // certo na tela (o valor "de verdade" mora dentro do sketch).
  const [isAutoPlay, setIsAutoPlay] = useState(false);

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

  function handleToggleAutoPlay() {
    const next = !isAutoPlay;
    setIsAutoPlay(next);
    p5InstanceRef.current?.setAutoPlay(next);
  }

  function handleStepOnce() {
    p5InstanceRef.current?.stepOnce();
  }

  function handleFinishSearch() {
    p5InstanceRef.current?.finishSearchInstantly();
  }

  //TODO - Alterar o layout da tela para ficar mais bonito e responsivo, com o painel de controles à esquerda e a simulação à direita.
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-neutral-900 p-6">
      <h1 className="text-xl font-semibold text-neutral-100">
        Agente Coletor de Comida — Search-Algorithms
      </h1>

      <ControlsPanel
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={handleAlgorithmChange}
        onRestart={handleRestart}
        foodsCollected={foodsCollected}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={handleToggleAutoPlay}
        onStepOnce={handleStepOnce}
        onFinishSearch={handleFinishSearch}
      />

      <SimulationCanvas containerRef={containerRef} />
    </div>
  );
}