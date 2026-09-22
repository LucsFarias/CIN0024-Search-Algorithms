// =============================================================
// engine/search/greedy.js — Busca Gulosa (Greedy Best-First Search)
//
// DICA: usa a PriorityQueue igual UCS/A*, mas ordena SÓ pela
// heurística h (distância estimada até o objetivo) — ignora
// completamente o custo já percorrido (g). Por isso ela é "gulosa":
// sempre corre na direção que PARECE mais perto do objetivo, mesmo
// que isso signifique atravessar um terreno caro (água).
//
// Usem a função heuristic(cell, goalCell) de search-utils.js.
// =============================================================

import { PriorityQueue, heuristic, reconstructPath } from './search-utils.js';

export function* greedy(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();
  startCell.h = heuristic(startCell, goalCell);
  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.h);

  while (!frontier.isEmpty()) {
    // TODO: tirar da fila o elemento de MENOR h
    const current = null; // <- substituir

    // TODO: marcar visited / tirar de inFrontier
    // TODO: se current === goalCell -> return { found: true, path: reconstructPath(goalCell) }

    // TODO: para cada vizinho caminhável e ainda não visitado:
    //         neighbor.h = heuristic(neighbor, goalCell)
    //         neighbor.parent = current
    //         enqueue(neighbor, neighbor.h)

    yield;
  }

  return { found: false, path: [] };
}
