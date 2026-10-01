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
    const current = frontier.dequeue();

    if (current.visited) continue;
    current.visited = true;
    current.inFrontier = false;

    if (current === goalCell) {
      return { found: true, path: reconstructPath(goalCell) };
    }

    for (const neighbor of current.getNeighbors(grid)) {
      if (!neighbor.walkable || neighbor.visited) continue;

      if (!neighbor.inFrontier) {
        neighbor.parent = current;
        neighbor.g = current.g + neighbor.cost;
        neighbor.inFrontier = true;
        frontier.enqueue(neighbor, neighbor.g);
      }
    }

    yield;
  }

  return { found: false, path: [] };
}
