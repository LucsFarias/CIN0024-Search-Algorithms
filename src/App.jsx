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
import { ALGORITHMS, DEFAULT_ALGORITHM } from './engine/search/index.js';
import { DEFAULT_ROWS, DEFAULT_COLS, MIN_GRID_SIZE, MAX_GRID_SIZE } from './config.js';

const styles = {
  app: "min-h-screen w-full bg-[#10120f] text-[#f1f0e9] font-['Space_Grotesk',sans-serif]",
  content: 'mx-auto min-h-screen max-w-screen-2xl px-12 max-lg:px-8 max-md:px-6',
  header: 'flex min-h-20 items-center justify-between border-b border-[#30352d] max-md:min-h-16',
  brand: 'flex items-center gap-3 text-[#f1f0e9] no-underline',
  brandMark: 'grid size-9 place-items-center border border-[#66baff] text-lg font-bold text-[#66baff]',
  brandName: 'text-sm font-bold tracking-wide',
  brandHighlight: 'text-[#66baff]',
  headerMeta: "flex items-center gap-8 font-['DM_Mono',monospace] text-xs tracking-wider max-md:gap-0",
  courseMeta: 'text-[#888d83] max-md:hidden',
  slash: 'px-1 text-[#66baff] not-italic',
  connection: 'flex items-center gap-2 text-[#c8cec1]',
  connectionDot: 'size-2 animate-pulse rounded-full bg-[#66baff] shadow-md shadow-[#66baff88]',
  intro: 'flex items-end justify-between pt-12 pb-8 max-md:pt-10 max-md:pb-6',
  eyebrow: "mb-3.5 font-['DM_Mono',monospace] text-xs tracking-widest text-[#66baff]",
  eyebrowRule: 'mr-2 inline-block h-px w-6 bg-[#66baff] align-middle',
  fieldNote: 'ml-3 text-[#747a70] max-md:hidden',
  title: 'm-0 text-7xl leading-[.98] font-semibold tracking-tight max-md:text-5xl',
  titleHighlight: 'text-[#66baff]',
  introCopy: 'mt-4 text-sm text-[#9a9e94] max-md:mt-3 max-md:max-w-64 max-md:text-xs max-md:leading-relaxed',
  dimensions: 'min-w-36 border-l border-[#30352d] py-1 pl-5 max-md:min-w-0 max-md:pl-3',
  dataLabel: "block font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#888d83]",
  dimensionsValue: "my-1 block font-['DM_Mono',monospace] text-2xl font-medium max-md:text-xl",
  dimensionsUnit: 'text-base text-[#66baff]',
  axis: "block font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#888d83] max-md:text-[.5rem]",
  axisAccent: 'font-normal text-[#66baff]',
  workspace: 'grid grid-cols-[minmax(0,1fr)_18rem] gap-6 pt-7 max-lg:grid-cols-[minmax(0,1fr)_16rem] max-lg:gap-4 max-md:grid-cols-1 max-md:gap-4.5 max-md:pt-5',
  mapSection: 'min-w-0',
  sectionHeading: 'mb-3 flex min-h-8 items-center justify-between',
  sectionTitleWrap: 'flex items-baseline gap-2.5',
  sectionIndex: "font-['DM_Mono',monospace] text-xs text-[#66baff]",
  sectionTitle: 'm-0 text-sm font-medium',
  searchStatus: "max-w-44 overflow-hidden whitespace-nowrap font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#a1a69a] after:ml-1 after:inline-block after:h-3 after:animate-pulse after:border-r after:border-[#66baff] after:align-middle after:content-['']",
  canvasFrame: 'relative flex min-h-72 items-center justify-center overflow-auto border border-[#30352d] bg-[#171a15] bg-[linear-gradient(#ffffff08_0.0625rem,transparent_0.0625rem),linear-gradient(90deg,#ffffff08_0.0625rem,transparent_0.0625rem)] [background-size:1.5rem_1.5rem] p-6 max-md:min-h-64 max-md:overflow-hidden max-md:p-3.5',
  cornerTopLeft: 'absolute top-2 left-2 z-10 size-2 border-t border-l border-[#66baff]',
  cornerTopRight: 'absolute top-2 right-2 z-10 size-2 border-t border-r border-[#66baff]',
  cornerBottomLeft: 'absolute bottom-2 left-2 z-10 size-2 border-b border-l border-[#66baff]',
  cornerBottomRight: 'absolute right-2 bottom-2 z-10 size-2 border-r border-b border-[#66baff]',
  legend: "flex min-h-10 items-end gap-4 font-['DM_Mono',monospace] text-[.5625rem] text-[#a2a69b] max-md:gap-3 max-md:text-[.5rem]",
  legendItem: 'flex items-center gap-1.5',
  agentDot: 'size-2 rounded-full bg-[#ff704d]',
  targetDot: 'size-2 rounded-full bg-white',
  pathDot: 'size-2 bg-[#66baff]',
  coordinates: 'ml-auto text-[#66baff]',
  telemetry: 'relative flex min-w-0 flex-col border border-[#30352d] bg-[#191c17] px-4 pt-3.5 pb-3',
  telemetryHeading: 'mb-2.5 flex min-h-8 items-center justify-between',
  liveStatus: "flex items-center gap-1.5 font-['DM_Mono',monospace] text-[.5625rem] text-[#66baff]",
  liveDot: 'size-1 animate-pulse rounded-full bg-[#66baff]',
  seedBlock: 'border-t border-[#30352d] py-4 pb-3',
  seedValue: "my-2 block font-['DM_Mono',monospace] text-4xl leading-[.98] font-medium tracking-wide text-[#66baff]",
  dataCaption: "block font-['DM_Mono',monospace] text-[.5rem] text-[#5f655b]",
  coordinateList: 'border-t border-[#30352d]',
  coordinateRow: 'flex min-h-16 items-center gap-2.5 border-b border-[#292e26]',
  agentIcon: "grid size-6 shrink-0 place-items-center border border-[#426585] font-['DM_Mono',monospace] text-xs text-[#66baff]",
  targetIcon: "grid size-6 shrink-0 place-items-center border border-[#765249] font-['DM_Mono',monospace] text-xs text-[#ff704d]",
  coordinateInfo: 'min-w-0 flex-1',
  coordinateValue: "mt-1 block whitespace-nowrap font-['DM_Mono',monospace] text-xs",
  coordinateAxis: "font-['DM_Mono',monospace] text-[.5rem] text-[#666d62]",
  metrics: 'grid grid-cols-2 border-b border-[#30352d] py-3.5',
  metricValue: "mt-1 block font-['DM_Mono',monospace] text-lg",
  foodMetric: 'border-l border-[#30352d] pl-3',
  telemetryNote: 'my-auto mt-2 mb-3 flex gap-2 pt-3 text-[#868c81]',
  noteMarker: "font-['DM_Mono',monospace] text-xs text-[#66baff]",
  noteText: 'm-0 text-xs leading-relaxed',
  stamp: "flex justify-between border-t border-[#30352d] pt-2.5 font-['DM_Mono',monospace] text-[.5rem] text-[#73796e]",
  footer: "flex justify-between gap-3 pt-6 pb-5 font-['DM_Mono',monospace] text-[.5rem] tracking-wide text-[#777d72] max-md:flex-col max-md:pt-4",
  credits: 'grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#30352d] py-4 md:grid-cols-5',
  creditsHeading: 'col-span-full m-0 font-[\'DM_Mono\',monospace] text-[.5rem] tracking-widest text-[#777d72]',
  credit: 'flex min-w-0 flex-col gap-1',
  creditHandle: "font-['DM_Mono',monospace] text-xs text-[#66baff]",
  creditName: 'text-xs leading-snug text-[#c8cec1]',
};

const projectAuthors = [
  { handle: 'clfm', name: 'Cleber Lucas Farias' },
  { handle: 'jlas2', name: 'Juliana Luiza de Andrade' },
  { handle: 'less', name: 'Lucas Emanuel Sabino' },
  { handle: 'mfss2', name: 'Maurício Andrey da Silva' },
  { handle: 'vpbm', name: 'Victória Pessoa Barbosa' },
];

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
    <main className={styles.app}>
      <div className={styles.content}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Search Lab, início">
          <span className={styles.brandMark}>S</span>
          <span className={styles.brandName}>INVENÇÃO DE <span className={styles.brandHighlight}>CALEGARIO</span></span>
        </a>
        <div className={styles.headerMeta}>
          <span className={styles.courseMeta}>CIN0024 <i className={styles.slash}>/</i> INTELLIGENCE SYSTEMS</span>
          <span className={styles.connection}><span className={styles.connectionDot} /> SIMULATION ONLINE</span>
        </div>
      </header>

      <section className={styles.intro} id="top">
        <div>
          <p className={styles.eyebrow}><span className={styles.eyebrowRule} /> SEARCH ALGORITHM VISUALIZER <span className={styles.fieldNote}>FIELD NOTE 001</span></p>
          <h1 className={styles.title}>Map the <span className={styles.titleHighlight}>unknown.</span></h1>
          <p className={styles.introCopy}>A study in pathfinding, terrain cost, and controlled randomness.</p>
        </div>
        <div className={styles.dimensions} aria-label="Map dimensions">
          <span className={styles.dataLabel}>ACTIVE GRID</span>
          <strong className={styles.dimensionsValue}>{String(rows).padStart(2, '0')}<small className={styles.dimensionsUnit}> × </small>{String(cols).padStart(2, '0')}</strong>
          <span className={styles.axis}>ROW <b className={styles.axisAccent}>Y</b> / COLUMN <b className={styles.axisAccent}>X</b></span>
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

      <div className={styles.workspace}>
        <section className={styles.mapSection} aria-label="Visualização do mapa">
          <div className={styles.sectionHeading}>
            <div className={styles.sectionTitleWrap}><span className={styles.sectionIndex}>01</span><h2 className={styles.sectionTitle}>Terrain scan</h2></div>
            <span className={styles.searchStatus}>{isUnreachable ? 'PATH / NOT FOUND' : isAutoPlay ? 'SEARCH / RUNNING' : 'SEARCH / STANDBY'}</span>
          </div>
          <div className={styles.canvasFrame}>
            <span className={styles.cornerTopLeft} /><span className={styles.cornerTopRight} />
            <span className={styles.cornerBottomLeft} /><span className={styles.cornerBottomRight} />
            <SimulationCanvas containerRef={containerRef} />
          </div>
          <div className={styles.legend}>
            <span className={styles.legendItem}><i className={styles.agentDot} /> AGENT</span>
            <span className={styles.legendItem}><i className={styles.targetDot} /> TARGET</span>
            <span className={styles.legendItem}><i className={styles.pathDot} /> SEARCH PATH</span>
            <span className={styles.coordinates}>X → / Y ↓</span>
          </div>
        </section>

        <aside className={styles.telemetry} aria-label="Simulation telemetry">
          <div className={styles.telemetryHeading}>
            <div className={styles.sectionTitleWrap}><span className={styles.sectionIndex}>02</span><h2 className={styles.sectionTitle}>Live telemetry</h2></div>
            <span className={styles.liveStatus}><i className={styles.liveDot} /> LIVE</span>
          </div>
          <div className={styles.seedBlock}>
            <span className={styles.dataLabel}>PERLIN NOISE SEED</span>
            <strong className={styles.seedValue}>{telemetry ? String(telemetry.seed).padStart(5, '0') : '-----'}</strong>
            <span className={styles.dataCaption}>MAP ENTROPY / 100K</span>
          </div>
          <div className={styles.coordinateList}>
            <div className={styles.coordinateRow}>
              <span className={styles.agentIcon}>A</span>
              <div className={styles.coordinateInfo}><span className={styles.dataLabel}>AGENT POSITION</span><strong className={styles.coordinateValue}>{telemetry ? `R${String(telemetry.agent.row).padStart(2, '0')} : C${String(telemetry.agent.col).padStart(2, '0')}` : 'R-- : C--'}</strong></div>
              <span className={styles.coordinateAxis}>Y / X</span>
            </div>
            <div className={styles.coordinateRow}>
              <span className={styles.targetIcon}>T</span>
              <div className={styles.coordinateInfo}><span className={styles.dataLabel}>TARGET POSITION</span><strong className={styles.coordinateValue}>{telemetry ? `R${String(telemetry.target.row).padStart(2, '0')} : C${String(telemetry.target.col).padStart(2, '0')}` : 'R-- : C--'}</strong></div>
              <span className={styles.coordinateAxis}>Y / X</span>
            </div>
          </div>
          <div className={styles.metrics}>
            <div><span className={styles.dataLabel}>NODES VISITED</span><strong className={styles.metricValue}>{String(telemetry?.visited ?? 0).padStart(3, '0')}</strong></div>
            <div className={styles.foodMetric}><span className={styles.dataLabel}>FOOD RETRIEVED</span><strong className={styles.metricValue}>{String(foodsCollected).padStart(3, '0')}</strong></div>
          </div>
          <div className={styles.telemetryNote}>
            <span className={styles.noteMarker}>*</span>
            <p className={styles.noteText}>Coordinates update as the agent advances. A new seed generates a unique terrain field.</p>
          </div>
          <div className={styles.stamp}><span>SEARCH / 001</span><span>LAT {telemetry ? `${(telemetry.agent.row / rows * 90).toFixed(2)}°N` : '--.--°N'}</span></div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>BUILT FOR EXPLORATION <i className={styles.slash}>·</i> {ALGORITHMS[selectedAlgorithm].label.toUpperCase()} / PATHFINDING STUDY</span>
        <span>GRID {rows} x {cols} <i className={styles.slash}>·</i> RANDOM SEED {telemetry ? telemetry.seed : '-----'}</span>
      </footer>
      <section className={styles.credits} aria-label="Project contributors">
        <h2 className={styles.creditsHeading}>PROJECT TEAM</h2>
        {projectAuthors.map(({ handle, name }) => (
          <div className={styles.credit} key={handle}>
            <span className={styles.creditHandle}>{handle}</span>
            <span className={styles.creditName}>{name}</span>
          </div>
        ))}
      </section>
      </div>
    </main>
  );
}