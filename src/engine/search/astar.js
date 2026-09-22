// =============================================================
// engine/search/astar.js — A* (A-estrela)
//
// É o mesmo esqueleto do UCS, mas ordenando a fila por
// f = g + h  (custo real percorrido + estimativa até o objetivo),
// em vez de só por g. Esse é exatamente o algoritmo do vídeo/tutorial
// "Introduction to A*" anexado como referência na atividade — vale a
// pena comparar a implementação de vocês com a de lá.
//
// Usem heuristic(cell, goalCell) de search-utils.js.
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

    // TODO: marcar visited / tirar de inFrontier
    // TODO: se current === goalCell -> return { found: true, path: reconstructPath(goalCell) }

    // TODO: para cada vizinho caminhável:
    //         tentativeG = current.g + neighbor.cost
    //         se tentativeG < neighbor.g (achou um caminho melhor até o vizinho):
    //           neighbor.parent = current
    //           neighbor.g = tentativeG
    //           neighbor.h = heuristic(neighbor, goalCell)
    //           neighbor.f = neighbor.g + neighbor.h
    //           enqueue(neighbor, neighbor.f)

    yield;
  }

  return { found: false, path: [] };
}
