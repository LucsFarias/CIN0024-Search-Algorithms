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
  foodsCollected,
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
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-neutral-800 px-4 py-3 shadow-md">
      <label className="flex items-center gap-2 text-sm text-neutral-200">
        Algoritmo de busca:
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className="rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {Object.entries(ALGORITHMS).map(([key, { label, implemented }]) => (
            <option key={key} value={key}>
              {label}{!implemented ? ' (ainda não implementado)' : ''}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2 rounded-md border border-neutral-600 bg-neutral-900/40 px-2 py-1">
        <label className="flex items-center gap-1 text-sm text-neutral-200">
          Linhas:
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={rows}
            onChange={(e) => onRowsChange(Number(e.target.value))}
            className="w-16 rounded-md border border-neutral-600 bg-neutral-700 px-2 py-1 text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <label className="flex items-center gap-1 text-sm text-neutral-200">
          Colunas:
          <input
            type="number"
            min={MIN_GRID_SIZE}
            max={MAX_GRID_SIZE}
            value={cols}
            onChange={(e) => onColsChange(Number(e.target.value))}
            className="w-16 rounded-md border border-neutral-600 bg-neutral-700 px-2 py-1 text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <button
          type="button"
          onClick={onApplyGridSize}
          title={`Gera um mapa novo com esse tamanho (entre ${MIN_GRID_SIZE} e ${MAX_GRID_SIZE})`}
          className="rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Aplicar tamanho
        </button>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Reiniciar (novo mapa)
      </button>

      <div className="flex items-center gap-2 rounded-md border border-neutral-600 bg-neutral-900/40 px-2 py-1">
        <button
          type="button"
          onClick={onStepOnce}
          disabled={isAutoPlay}
          title="Avança um único passo da busca (uma célula expandida)"
          className="rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          ⏭ Passo seguinte
        </button>

        <button
          type="button"
          onClick={onToggleAutoPlay}
          title="Liga/desliga o avanço automático da busca"
          className={`rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isAutoPlay
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-neutral-700 text-neutral-50 hover:bg-neutral-600'
          }`}
        >
          {isAutoPlay ? '⏸ Autoplay: ON' : '▶ Autoplay: OFF'}
        </button>

        <button
          type="button"
          onClick={onFinishSearch}
          title="Pula direto para o resultado final da busca, sem animar"
          className="rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          ⏩ Concluir busca
        </button>
      </div>

      <span className="text-sm text-neutral-300">
        Comidas coletadas: <span className="font-semibold text-emerald-400">{foodsCollected}</span>
      </span>

      {!ALGORITHMS[selectedAlgorithm]?.implemented && (
        <span className="rounded-md bg-amber-900/40 px-2 py-1 text-xs text-amber-300">
          ⚠ Esse algoritmo ainda é só um esqueleto com TODO (veja
          src/engine/search/{selectedAlgorithm}.js) — a busca vai ficar parada na célula inicial até ser implementado.
        </span>
      )}

      {isUnreachable && (
        <span className="rounded-md bg-red-900/50 px-2 py-1 text-xs text-red-300">
          ⚠ A comida ficou cercada de obstáculos e não tem caminho até o agente. Clique em "Reiniciar" pra sortear um mapa novo.
        </span>
      )}
    </div>
  );
}