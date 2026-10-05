// =============================================================
// engine/search/astar.js — A* (A-estrela)
//
// Ordena a fronteira por:
// f = g + h
//
// g = custo real acumulado desde o início
// h = estimativa do custo até o objetivo
// f = custo total estimado
//
// Usa heuristic(cell, goalCell) de search-utils.js.
// =============================================================

import { PriorityQueue, heuristic, reconstructPath } from './search-utils.js';

export function* astar(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();

  // Inicializa a célula inicial
  startCell.g = 0;
  startCell.h = heuristic(startCell, goalCell);
  startCell.f = startCell.g + startCell.h;

  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.f);

  while (!frontier.isEmpty()) {
    // A PriorityQueue já mantém os elementos ordenados
    // pela menor prioridade, então dequeue() retorna
    // a célula com menor f.
    const current = frontier.dequeue();

    // Como uma célula pode ter sido inserida mais de uma vez
    // na fila com custos diferentes, ignoramos entradas antigas.
    if (current.visited) continue;

    current.visited = true;
    current.inFrontier = false;

    // Objetivo encontrado
    if (current === goalCell) {
      return {
        found: true,
        path: reconstructPath(goalCell),
      };
    }

    // Analisa os vizinhos ortogonais
    for (const neighbor of current.getNeighbors(grid)) {
      // Não podemos atravessar obstáculos.
      // Também não precisamos reprocessar células já fechadas.
      if (!neighbor.walkable || neighbor.visited) continue;

      // Custo para chegar ao vizinho passando pela célula atual
      const tentativeG = current.g + neighbor.cost;

      // Só atualizamos o vizinho se encontramos
      // um caminho melhor até ele.
      if (tentativeG < neighbor.g) {
        neighbor.parent = current;

        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goalCell);
        neighbor.f = neighbor.g + neighbor.h;

        neighbor.inFrontier = true;

        // Prioridade do A* = f = g + h
        frontier.enqueue(neighbor, neighbor.f);
      }
    }

    // Pausa a generator function para permitir
    // a animação passo a passo no p5.
    yield;
  }

  // Fronteira esvaziou e não encontramos o objetivo
  return {
    found: false,
    path: [],
  };
}