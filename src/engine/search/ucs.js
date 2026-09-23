// =============================================================
//
// Em vez do array simples (fila/pilha) do BFS/DFS, usem a
// PriorityQueue de search-utils.js, ordenando pelo custo acumulado
// `g` (energia gasta até ali) — NÃO pela heurística.
//
// É essencialmente o mesmo algoritmo que o A*
// =============================================================

import { PriorityQueue, reconstructPath } from './search-utils.js';

export function* ucs(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();
  startCell.g = 0;
  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.g);

  while (!frontier.isEmpty()) {
    // TODO: tirar da fila o elemento de MENOR g (frontier.dequeue() já faz isso)
    const current = null; // <- substituir

    yield;
  }

  return { found: false, path: [] };
}
