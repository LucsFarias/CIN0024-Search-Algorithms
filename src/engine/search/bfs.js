// =============================================================
// engine/search/bfs.js — Busca em Largura (Breadth-First Search)
//
// Implementação DE REFERÊNCIA. Os outros arquivos (dfs, ucs, greedy,
// astar) devem seguir a MESMA estrutura: uma generator function que
// faz `yield` a cada célula expandida — isso é o que permite animar
// a busca passo a passo no hook useP5Sketch.
//
// Generator function (function*): pode "pausar" no `yield` e retomar
// de onde parou na próxima chamada de `.next()`. Cada `.next()` aqui
// = "processa mais uma célula da busca e desenha o frame atual".
// =============================================================

import { reconstructPath } from './search-utils.js';

export function* bfs(grid, startCell, goalCell) {
  const frontier = []; // usado como fila: push no fim, shift no início (FIFO)
  startCell.g = 0;
  startCell.inFrontier = true;
  frontier.push(startCell);

  while (frontier.length > 0) {
    const current = frontier.shift();

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
        frontier.push(neighbor);
      }
    }

    yield; // pausa aqui: o hook desenha o frame atual antes do próximo .next()
  }

  return { found: false, path: [] };
}
