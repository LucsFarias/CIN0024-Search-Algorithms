// =============================================================
// components/ControlsPanel.jsx
// Select de algoritmo + botão de reiniciar + contador de comidas.
// Recebe tudo via props — não tem estado próprio (fica no App.jsx).
// =============================================================

import { ALGORITHMS } from '../engine/search/index.js';
import { MIN_GRID_SIZE, MAX_GRID_SIZE } from '../config.js';

export default function ControlsPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  onRestart,
  isAutoPlay,
  onToggleAutoPlay,
  onStepOnce,
  onFinishSearch,
  rows,
  cols,
  onRowsChange,
  onColsChange,
  onApplyGridSize,
  isUnreachable,
}) {
  return (
    <div className="grid grid-cols-[minmax(12rem,1.15fr)_minmax(9rem,.85fr)_minmax(0,5fr)] items-start gap-2.5 border border-[#30352d] bg-[#171a15] p-3 max-lg:grid-cols-[minmax(11.25rem,1.2fr)_minmax(8rem,.85fr)] max-lg:gap-2.5 max-md:grid-cols-2">
      <label className="flex min-w-0 flex-col gap-1.5 max-md:col-span-full">
        <span className="font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#9da296]">01 / SEARCH ALGORITHM</span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className="h-9.25 min-w-0 border border-[#343a31] bg-[#10120f] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]"
        >
          {Object.entries(ALGORITHMS).map(([key, { label, implemented }]) => (
            <option key={key} value={key}>
              {label}{!implemented ? ' (ainda não implementado)' : ''}
            </option>
          ))}
        </select>
      </label>

      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#9da296]">02 / GRID SIZE</span>
        <div className="flex gap-1.5 max-md:items-end">
        <label className="flex items-center gap-1.25 font-['DM_Mono',monospace] text-[.5625rem] text-[#888d83] max-md:flex-1">
          Y
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={rows}
            onChange={(e) => onRowsChange(Number(e.target.value))}
            className="h-9.25 w-13.5 min-w-0 border border-[#343a31] bg-[#10120f] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] max-md:w-full"
          />
        </label>
        <label className="flex items-center gap-1.25 font-['DM_Mono',monospace] text-[.5625rem] text-[#888d83] max-md:flex-1">
          X
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={cols}
            onChange={(e) => onColsChange(Number(e.target.value))}
            className="h-9.25 w-13.5 min-w-0 border border-[#343a31] bg-[#10120f] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] max-md:w-full"
          />
        </label>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-x-2.5 gap-y-1.5 max-lg:col-span-full max-md:grid-cols-2">
        <div className="col-span-full flex items-center gap-2 font-['DM_Mono',monospace] text-[.5625rem] tracking-widest">
          <span className="text-[#9da296]">03 / CONTROL PANEL</span>
        </div>
        <button
          type="button"
          onClick={onApplyGridSize}
          title={`Gera um mapa novo com esse tamanho (entre ${MIN_GRID_SIZE} e ${MAX_GRID_SIZE})`}
          className="flex h-10 min-w-0 items-center justify-center whitespace-nowrap border border-[#40463b] bg-[#242820] px-3 font-['DM_Mono',monospace] text-xs text-[#66baff] transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]"
        >
          APPLY GRID
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="flex h-10 min-w-0 items-center justify-center whitespace-nowrap border border-[#66baff] bg-[#66baff] px-3 font-['DM_Mono',monospace] text-xs font-semibold text-[#10120f] shadow-lg shadow-[#66baff33] transition hover:-translate-y-px hover:bg-[#8dccff] hover:shadow-xl hover:shadow-[#66baff55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff] max-md:col-span-full max-md:w-full"
        >
          ↻ NEW MAP
        </button>

        <div className="col-span-3 flex gap-2.5 max-md:col-span-full">
        <button
          type="button"
          onClick={onStepOnce}
          disabled={isAutoPlay}
          title="Avança um único passo da busca (uma célula expandida)"
          className="h-10 min-w-0 flex-1 whitespace-nowrap border border-[#40463b] bg-[#242820] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          STEP →
        </button>

        <button
          type="button"
          onClick={onToggleAutoPlay}
          title="Liga/desliga o avanço automático da busca"
          className={`h-10 min-w-0 flex-1 whitespace-nowrap border bg-[#242820] px-2.5 font-['DM_Mono',monospace] text-xs transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff] ${isAutoPlay ? 'border-[#66baff] text-[#66baff]' : 'border-[#40463b] text-[#f1f0e9]'}`}
        >
          {isAutoPlay ? 'Ⅱ PAUSE' : '▶ AUTO'}
        </button>

        <button
          type="button"
          onClick={onFinishSearch}
          title="Pula direto para o resultado final da busca, sem animar"
          className="h-10 min-w-0 flex-1 whitespace-nowrap border border-[#40463b] bg-[#242820] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]"
        >
          SKIP →
        </button>
      </div>
      </div>

      {!ALGORITHMS[selectedAlgorithm]?.implemented && (
        <p className="col-span-full m-0 font-['DM_Mono',monospace] text-xs leading-normal text-[#ffc477]">! {ALGORITHMS[selectedAlgorithm].label} is a placeholder. Search is currently implemented for BFS only.</p>
      )}

      {isUnreachable && (
        <p className="col-span-full m-0 font-['DM_Mono',monospace] text-xs leading-normal text-[#ff8970]">! TARGET UNREACHABLE / Generate a new map to continue.</p>
      )}
    </div>
  );
}