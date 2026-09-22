// =============================================================
// engine/search/ucs.js — Busca de Custo Uniforme (Uniform Cost Search)
//
// DICA: em vez do array simples (fila/pilha) do BFS/DFS, usem a
// PriorityQueue de search-utils.js, ordenando pelo custo acumulado
// `g` (energia gasta até ali) — NÃO pela heurística.
//
// É essencialmente o mesmo algoritmo que o A*, mas com h sempre
// igual a 0 (ou seja, f = g). Depois de implementar A* (astar.js),
// pode ser mais fácil "copiar e simplificar" de lá.
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

    // TODO: marcar visited / tirar de inFrontier
    // TODO: se current === goalCell -> return { found: true, path: reconstructPath(goalCell) }

    // TODO: para cada vizinho caminhável:
    //         newG = current.g + neighbor.cost
    //         se newG < neighbor.g (achou um caminho mais barato):
    //           atualizar neighbor.g, neighbor.parent
    //           enqueue(neighbor, newG)

    yield;
  }

  return { found: false, path: [] };
}
