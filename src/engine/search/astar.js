// =============================================================
// engine/search/astar.js — A* (A-estrela)
//
// É o mesmo esqueleto do UCS, mas ordenando a fila por
// f = g + h  (custo real percorrido + estimativa até o objetivo),
// em vez de só por g. Ver vídeo que o professor passou sobre A*.
//
// Usar heuristic(cell, goalCell) de search-utils.js.
// =============================================================

import { PriorityQueue, heuristic, reconstructPath } from './search-utils.js';

export function* astar(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();
  startCell.g = 0;
  startCell.h = heuristic(startCell, goalCell);
  startCell.f = startCell.g + startCell.h;
  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.f);

  while (!frontier.isEmpty()) {
    // TODO: tirar da fila o elemento de MENOR f
    const current = null; // <- substituir

    yield;
  }

  return { found: false, path: [] };
}
