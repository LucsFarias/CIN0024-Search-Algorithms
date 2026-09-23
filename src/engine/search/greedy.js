import { PriorityQueue, heuristic, reconstructPath } from './search-utils.js';

export function* greedy(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();
  startCell.h = heuristic(startCell, goalCell);
  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.h);

  while (!frontier.isEmpty()) {
    // TODO: tirar da fila o elemento de MENOR h
    const current = null; // <- substituir

    yield;
  }

  return { found: false, path: [] };
}
