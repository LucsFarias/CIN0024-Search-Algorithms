// =============================================================
// components/ControlsPanel.jsx
// Select de algoritmo + botão de reiniciar + contador de comidas.
// Recebe tudo via props — não tem estado próprio (fica no App.jsx).
// =============================================================

import { ALGORITHMS } from '../engine/search/index.js';
import { MIN_GRID_SIZE, MAX_GRID_SIZE } from '../config.js';

const styles = {
  panel: 'grid grid-cols-[minmax(12rem,1.15fr)_minmax(9rem,.85fr)_minmax(0,5fr)] items-start gap-2.5 border border-[#30352d] bg-[#171a15] p-3 max-lg:grid-cols-[minmax(11.25rem,1.2fr)_minmax(8rem,.85fr)] max-lg:gap-2.5 max-md:grid-cols-2',
  field: 'flex min-w-0 flex-col gap-1.5',
  fieldLabel: "font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#9da296]",
  algorithmField: 'flex min-w-0 flex-col gap-1.5 max-md:col-span-full',
  select: "h-9.25 min-w-0 border border-[#343a31] bg-[#10120f] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]",
  gridInputs: 'flex gap-1.5 max-md:items-end',
  gridLabel: "flex items-center gap-1.25 font-['DM_Mono',monospace] text-[.5625rem] text-[#888d83] max-md:flex-1",
  numberInput: "h-9.25 w-13.5 min-w-0 border border-[#343a31] bg-[#10120f] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] max-md:w-full",
  actions: 'grid grid-cols-5 gap-x-2.5 gap-y-1.5 max-lg:col-span-full max-md:grid-cols-2',
  actionLabel: "col-span-full flex items-center gap-2 font-['DM_Mono',monospace] text-[.5625rem] tracking-widest text-[#9da296]",
  button: "flex h-10 min-w-0 items-center justify-center whitespace-nowrap border border-[#40463b] bg-[#242820] px-3 font-['DM_Mono',monospace] text-xs text-[#66baff] transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]",
  newMapButton: "flex h-10 min-w-0 items-center justify-center whitespace-nowrap border border-[#66baff] bg-[#66baff] px-3 font-['DM_Mono',monospace] text-xs font-semibold text-[#10120f] shadow-lg shadow-[#66baff33] transition hover:-translate-y-px hover:bg-[#8dccff] hover:shadow-xl hover:shadow-[#66baff55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff] max-md:col-span-full max-md:w-full",
  transport: 'col-span-3 flex gap-2.5 max-md:col-span-full',
  transportButton: "h-10 min-w-0 flex-1 whitespace-nowrap border border-[#40463b] bg-[#242820] px-2.5 font-['DM_Mono',monospace] text-xs text-[#f1f0e9] transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]",
  disabledButton: 'disabled:cursor-not-allowed disabled:opacity-40',
  autoplayButton: "h-10 min-w-0 flex-1 whitespace-nowrap border bg-[#242820] px-2.5 font-['DM_Mono',monospace] text-xs transition hover:-translate-y-px hover:border-[#66baff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66baff]",
  autoplayActive: 'border-[#66baff] text-[#66baff]',
  autoplayPaused: 'border-[#40463b] text-[#f1f0e9]',
  message: "col-span-full m-0 font-['DM_Mono',monospace] text-xs leading-normal",
  warning: 'text-[#ffc477]',
  error: 'text-[#ff8970]',
};

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
    <div className={styles.panel}>
      <label className={styles.algorithmField}>
        <span className={styles.fieldLabel}>01 / SEARCH ALGORITHM</span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className={styles.select}
        >
          {Object.entries(ALGORITHMS).map(([key, { label, implemented }]) => (
            <option key={key} value={key}>
              {label}{!implemented ? ' (ainda não implementado)' : ''}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>02 / GRID SIZE</span>
        <div className={styles.gridInputs}>
        <label className={styles.gridLabel}>
          Y
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={rows}
            onChange={(e) => onRowsChange(Number(e.target.value))}
            className={styles.numberInput}
          />
        </label>
        <label className={styles.gridLabel}>
          X
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={cols}
            onChange={(e) => onColsChange(Number(e.target.value))}
            className={styles.numberInput}
          />
        </label>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.actionLabel}>
          <span>03 / CONTROL PANEL</span>
        </div>
        <button
          type="button"
          onClick={onApplyGridSize}
          title={`Gera um mapa novo com esse tamanho (entre ${MIN_GRID_SIZE} e ${MAX_GRID_SIZE})`}
          className={styles.button}
        >
          APPLY GRID
        </button>

        <button
          type="button"
          onClick={onRestart}
          className={styles.newMapButton}
        >
          ↻ NEW MAP
        </button>

        <div className={styles.transport}>
        <button
          type="button"
          onClick={onStepOnce}
          disabled={isAutoPlay}
          title="Avança um único passo da busca (uma célula expandida)"
          className={`${styles.transportButton} ${styles.disabledButton}`}
        >
          STEP →
        </button>

        <button
          type="button"
          onClick={onToggleAutoPlay}
          title="Liga/desliga o avanço automático da busca"
          className={`${styles.autoplayButton} ${isAutoPlay ? styles.autoplayActive : styles.autoplayPaused}`}
        >
          {isAutoPlay ? 'Ⅱ PAUSE' : '▶ AUTO'}
        </button>

        <button
          type="button"
          onClick={onFinishSearch}
          title="Pula direto para o resultado final da busca, sem animar"
          className={styles.transportButton}
        >
          SKIP →
        </button>
      </div>
      </div>

      {!ALGORITHMS[selectedAlgorithm]?.implemented && (
        <p className={`${styles.message} ${styles.warning}`}>! {ALGORITHMS[selectedAlgorithm].label} is a placeholder. Search is currently implemented for BFS only.</p>
      )}

      {isUnreachable && (
        <p className={`${styles.message} ${styles.error}`}>! TARGET UNREACHABLE / Generate a new map to continue.</p>
      )}
    </div>
  );
}