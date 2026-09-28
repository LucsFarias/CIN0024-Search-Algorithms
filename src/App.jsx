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
  const [telemetry, setTelemetry] = useState(null);

  const handleFoodCollected = useCallback(() => {
    setFoodsCollected((count) => count + 1);
  }, []);

  const handleUnreachable = useCallback((value) => {
    setIsUnreachable(value);
  }, []);

  const handleTelemetry = useCallback((snapshot) => {
    setTelemetry(snapshot);
  }, []);

  const p5InstanceRef = useP5Sketch({
    containerRef,
    algorithmRef,
    gridSizeRef,
    onFoodCollected: handleFoodCollected,
    onUnreachable: handleUnreachable,
    onTelemetry: handleTelemetry,
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
    <main className="min-h-screen w-full bg-[#10120f] bg-[radial-gradient(#ffffff0b_0.7px,transparent_0.7px)] [background-size:5px_5px] text-[#f1f0e9] [font-family:'Space_Grotesk',sans-serif]">
      <div className="mx-auto min-h-screen max-w-[1440px] px-[5.2vw] max-[1000px]:px-[4vw] max-[320px]:px-3">
      <header className="flex min-h-[76px] items-center justify-between border-b border-[#30352d] max-[720px]:min-h-16">
        <a className="flex items-center gap-[11px] text-[#f1f0e9] no-underline" href="#top" aria-label="Search Lab, início">
          <span className="grid size-[34px] place-items-center border border-[#66baff] text-[17px] font-bold text-[#66baff]">S<span className="text-[#ff704d]">/</span></span>
          <span className="text-[13px] font-bold tracking-[1.2px]">SEARCH<span className="text-[#66baff]">LAB</span></span>
        </a>
        <div className="flex items-center gap-[30px] font-['DM_Mono',monospace] text-[10px] tracking-[.8px] max-[720px]:gap-0">
          <span className="text-[#888d83] max-[720px]:hidden">CIN0024 <i className="px-[5px] text-[#66baff] not-italic">/</i> INTELLIGENCE SYSTEMS</span>
          <span className="flex items-center gap-2 text-[#c8cec1]"><span className="size-[7px] animate-pulse rounded-full bg-[#66baff] shadow-[0_0_10px_#66baff88]" /> SIMULATION ONLINE</span>
        </div>
      </header>

      <section className="flex items-end justify-between pt-[50px] pb-[34px] max-[720px]:pt-[38px] max-[720px]:pb-[26px]" id="top">
        <div>
          <p className="mb-[14px] font-['DM_Mono',monospace] text-[10px] tracking-[1px] text-[#66baff]"><span className="mr-2 inline-block h-px w-[23px] bg-[#66baff] align-[3px]" /> SEARCH ALGORITHM VISUALIZER <span className="ml-3 text-[#747a70] max-[720px]:hidden">FIELD NOTE 001</span></p>
          <h1 className="m-0 text-[76px] leading-[.98] font-semibold tracking-[-2px] max-[720px]:text-[46px] max-[720px]:tracking-[-1.5px]">Map the <span className="text-[#66baff]">unknown.</span></h1>
          <p className="mt-[15px] text-[14px] text-[#9a9e94] max-[720px]:mt-3 max-[720px]:max-w-[260px] max-[720px]:text-xs max-[720px]:leading-[1.5]">A study in pathfinding, terrain cost, and controlled randomness.</p>
        </div>
        <div className="min-w-[145px] border-l border-[#30352d] py-1 pl-5 max-[720px]:min-w-0 max-[720px]:pl-3" aria-label="Map dimensions">
          <span className="block font-['DM_Mono',monospace] text-[9px] tracking-[1px] text-[#888d83]">ACTIVE GRID</span>
          <strong className="my-1 block font-['DM_Mono',monospace] text-[27px] font-medium max-[720px]:text-[21px]">{String(rows).padStart(2, '0')}<small className="text-[15px] text-[#66baff]"> × </small>{String(cols).padStart(2, '0')}</strong>
          <span className="block font-['DM_Mono',monospace] text-[9px] tracking-[1px] text-[#888d83] max-[720px]:text-[7px]">ROW <b className="font-normal text-[#66baff]">Y</b> / COLUMN <b className="font-normal text-[#66baff]">X</b></span>
        </div>
      </section>

      <ControlsPanel
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={handleAlgorithmChange}
        onRestart={handleRestart}
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

      <div className="grid grid-cols-[minmax(0,1fr)_286px] gap-[26px] pt-7 max-[1000px]:grid-cols-[minmax(0,1fr)_250px] max-[1000px]:gap-4 max-[720px]:grid-cols-1 max-[720px]:gap-[18px] max-[720px]:pt-[21px]">
        <section className="map-section" aria-label="Visualização do mapa">
          <div className="mb-3 flex min-h-[33px] items-center justify-between">
            <div className="flex items-baseline gap-[10px]"><span className="font-['DM_Mono',monospace] text-[10px] text-[#66baff]">01</span><h2 className="m-0 text-sm font-medium">Terrain scan</h2></div>
            <span className="max-w-[180px] overflow-hidden whitespace-nowrap font-['DM_Mono',monospace] text-[9px] tracking-[.9px] text-[#a1a69a] after:ml-1 after:inline-block after:h-[11px] after:animate-pulse after:border-r after:border-[#66baff] after:align-[-2px] after:content-['']">{isUnreachable ? 'PATH / NOT FOUND' : isAutoPlay ? 'SEARCH / RUNNING' : 'SEARCH / STANDBY'}</span>
          </div>
          <div className="relative flex min-h-[300px] items-center justify-center overflow-auto border border-[#30352d] bg-[#171a15] bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] [background-size:24px_24px] p-[23px] max-[720px]:min-h-[260px] max-[720px]:overflow-hidden max-[720px]:p-[14px]">
            <span className="absolute top-[7px] left-[7px] z-10 size-[9px] border-t border-l border-[#66baff]" /><span className="absolute top-[7px] right-[7px] z-10 size-[9px] border-t border-r border-[#66baff]" />
            <span className="absolute bottom-[7px] left-[7px] z-10 size-[9px] border-b border-l border-[#66baff]" /><span className="absolute right-[7px] bottom-[7px] z-10 size-[9px] border-r border-b border-[#66baff]" />
            <SimulationCanvas containerRef={containerRef} />
          </div>
          <div className="flex min-h-10 items-end gap-[17px] font-['DM_Mono',monospace] text-[9px] text-[#a2a69b] max-[720px]:gap-3 max-[720px]:text-[8px]">
            <span className="flex items-center gap-[6px]"><i className="size-[7px] rounded-full bg-[#ff704d]" /> AGENT</span>
            <span className="flex items-center gap-[6px]"><i className="size-[7px] rounded-full bg-white" /> TARGET</span>
            <span className="flex items-center gap-[6px]"><i className="size-[7px] bg-[#66baff]" /> SEARCH PATH</span>
            <span className="ml-auto text-[#66baff]">X → / Y ↓</span>
          </div>
        </section>

        <aside className="relative flex min-w-0 flex-col border border-[#30352d] bg-[#191c17] px-4 pt-[14px] pb-3" aria-label="Simulation telemetry">
          <div className="mb-[10px] flex min-h-[33px] items-center justify-between">
            <div className="flex items-baseline gap-[10px]"><span className="font-['DM_Mono',monospace] text-[10px] text-[#66baff]">02</span><h2 className="m-0 text-sm font-medium">Live telemetry</h2></div>
            <span className="flex items-center gap-[6px] font-['DM_Mono',monospace] text-[9px] text-[#66baff]"><i className="size-[5px] animate-pulse rounded-full bg-[#66baff]" /> LIVE</span>
          </div>
          <div className="border-t border-[#30352d] py-[15px] pb-[13px]">
            <span className="block font-['DM_Mono',monospace] text-[9px] tracking-[.75px] text-[#858b7f]">PERLIN NOISE SEED</span>
            <strong className="my-[7px] block font-['DM_Mono',monospace] text-[36px] leading-[.98] font-medium tracking-[2px] text-[#66baff]">{telemetry ? String(telemetry.seed).padStart(5, '0') : '-----'}</strong>
            <span className="block font-['DM_Mono',monospace] text-[8px] text-[#5f655b]">MAP ENTROPY / 100K</span>
          </div>
          <div className="border-t border-[#30352d]">
            <div className="flex min-h-[61px] items-center gap-[10px] border-b border-[#292e26]">
              <span className="grid size-[25px] shrink-0 place-items-center border border-[#426585] font-['DM_Mono',monospace] text-[10px] text-[#66baff]">A</span>
              <div className="min-w-0 flex-1"><span className="block font-['DM_Mono',monospace] text-[9px] tracking-[.75px] text-[#858b7f]">AGENT POSITION</span><strong className="mt-[5px] block whitespace-nowrap font-['DM_Mono',monospace] text-[11px]">{telemetry ? `R${String(telemetry.agent.row).padStart(2, '0')} : C${String(telemetry.agent.col).padStart(2, '0')}` : 'R-- : C--'}</strong></div>
              <span className="font-['DM_Mono',monospace] text-[8px] text-[#666d62]">Y / X</span>
            </div>
            <div className="flex min-h-[61px] items-center gap-[10px] border-b border-[#292e26]">
              <span className="grid size-[25px] shrink-0 place-items-center border border-[#765249] font-['DM_Mono',monospace] text-[10px] text-[#ff704d]">T</span>
              <div className="min-w-0 flex-1"><span className="block font-['DM_Mono',monospace] text-[9px] tracking-[.75px] text-[#858b7f]">TARGET POSITION</span><strong className="mt-[5px] block whitespace-nowrap font-['DM_Mono',monospace] text-[11px]">{telemetry ? `R${String(telemetry.target.row).padStart(2, '0')} : C${String(telemetry.target.col).padStart(2, '0')}` : 'R-- : C--'}</strong></div>
              <span className="font-['DM_Mono',monospace] text-[8px] text-[#666d62]">Y / X</span>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-[#30352d] py-[14px]">
            <div><span className="block font-['DM_Mono',monospace] text-[9px] tracking-[.75px] text-[#858b7f]">NODES VISITED</span><strong className="mt-[5px] block font-['DM_Mono',monospace] text-[19px]">{String(telemetry?.visited ?? 0).padStart(3, '0')}</strong></div>
            <div className="border-l border-[#30352d] pl-[13px]"><span className="block font-['DM_Mono',monospace] text-[9px] tracking-[.75px] text-[#858b7f]">FOOD RETRIEVED</span><strong className="mt-[5px] block font-['DM_Mono',monospace] text-[19px]">{String(foodsCollected).padStart(3, '0')}</strong></div>
          </div>
          <div className="my-auto mt-2 mb-3 flex gap-2 pt-3 text-[#868c81]">
            <span className="font-['DM_Mono',monospace] text-xs text-[#66baff]">*</span>
            <p className="m-0 text-[10px] leading-[1.6]">Coordinates update as the agent advances. A new seed generates a unique terrain field.</p>
          </div>
          <div className="flex justify-between border-t border-[#30352d] pt-[10px] font-['DM_Mono',monospace] text-[8px] text-[#73796e]"><span>SEARCH / 001</span><span>LAT {telemetry ? `${(telemetry.agent.row / rows * 90).toFixed(2)}°N` : '--.--°N'}</span></div>
        </aside>
      </div>

      <footer className="flex justify-between gap-3 pt-[23px] pb-5 font-['DM_Mono',monospace] text-[8px] tracking-[.5px] text-[#777d72] max-[720px]:flex-col max-[720px]:pt-[18px]">
        <span>BUILT FOR EXPLORATION <i className="px-[5px] text-[#66baff] not-italic">·</i> BFS / PATHFINDING STUDY</span>
        <span>GRID {rows} × {cols} <i className="px-[5px] text-[#66baff] not-italic">·</i> RANDOM SEED {telemetry ? telemetry.seed : '-----'}</span>
      </footer>
      </div>
    </main>
  );
}