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
import { DEFAULT_ROWS, DEFAULT_COLS, MIN_GRID_SIZE, MAX_GRID_SIZE } from './config.js';

export default function App() {
  const containerRef = useRef(null);
  const algorithmRef = useRef(DEFAULT_ALGORITHM);

  // gridSizeRef é a "fonte da verdade" que o sketch p5 lê no restart().
  // rows/cols (state) são só os valores exibidos/editados nos <input>
  // — eles só viram gridSizeRef.current de fato quando o usuário clica
  // em "Aplicar" (não a cada tecla digitada, pra não redimensionar o
  // canvas no meio da digitação).
  const gridSizeRef = useRef({ rows: DEFAULT_ROWS, cols: DEFAULT_COLS });
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [foodsCollected, setFoodsCollected] = useState(0);
  // Espelha o estado de autoplay do sketch p5 só pra pintar o botão
  // certo na tela (o valor "de verdade" mora dentro do sketch).
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  // true quando a busca termina sem achar caminho (comida cercada de
  // obstáculos) — o professor confirmou queissotátudoem; só avisamos
  // e o usuário clica em "Reiniciar" pra sortear um mapa novo.
  const [isUnreachable, setIsUnreachable] = useState(false);

  const handleFoodCollected = useCallback(() => {
    setFoodsCollected((count) => count + 1);
  }, []);

  const handleUnreachable = useCallback((value) => {
    setIsUnreachable(value);
  }, []);

  const p5InstanceRef = useP5Sketch({
    containerRef,
    algorithmRef,
    gridSizeRef,
    onFoodCollected: handleFoodCollected,
    onUnreachable: handleUnreachable,
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

  function handleApplyGridSize() {
    const clampedRows = Math.min(Math.max(rows, MIN_GRID_SIZE), MAX_GRID_SIZE);
    const clampedCols = Math.min(Math.max(cols, MIN_GRID_SIZE), MAX_GRID_SIZE);
    setRows(clampedRows);
    setCols(clampedCols);

    gridSizeRef.current = { rows: clampedRows, cols: clampedCols };
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
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={handleToggleAutoPlay}
        onStepOnce={handleStepOnce}
        onFinishSearch={handleFinishSearch}
        rows={rows}
        cols={cols}
        onRowsChange={setRows}
        onColsChange={setCols}
        onApplyGridSize={handleApplyGridSize}
        isUnreachable={isUnreachable}
      />

      <SimulationCanvas containerRef={containerRef} />
    </div>
  );
}