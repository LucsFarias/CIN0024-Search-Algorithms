// =============================================================
// components/ControlsPanel.jsx
// Select de algoritmo + botão de reiniciar + contador de comidas.
// Recebe tudo via props — não tem estado próprio (fica no App.jsx).
// =============================================================

import { ALGORITHMS } from '../engine/search/index.js';

export default function ControlsPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  onRestart,
  foodsCollected,
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
          {Object.entries(ALGORITHMS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onRestart}
        className="rounded-md border border-neutral-600 bg-neutral-700 px-3 py-1.5 text-sm text-neutral-50 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Reiniciar (novo mapa)
      </button>

      <span className="text-sm text-neutral-300">
        Comidas coletadas: <span className="font-semibold text-emerald-400">{foodsCollected}</span>
      </span>
    </div>
  );
}
