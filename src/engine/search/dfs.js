// =============================================================
//
// É praticamente idêntica ao bfs.js, com UMA diferença:
// - BFS usa `frontier.shift()` (remove do INÍCIO -> fila, FIFO)
// - DFS usa `frontier.pop()`   (remove do FIM -> pilha, LIFO)
//
// Copiem a estrutura de bfs.js e troquem shift() por pop() como
// ponto de partida
import { reconstructPath } from './search-utils.js';

export function* dfs(grid, startCell, goalCell) {
  const frontier = [];
  startCell.g = 0;
  startCell.inFrontier = true;
  frontier.push(startCell);

  while (frontier.length > 0) {
    const current = frontier.pop(); 

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
        neighbor.inFrontier = true;
        frontier.push(neighbor);
      }
    }

    yield;
  }

  return { found: false, path: [] };
}
