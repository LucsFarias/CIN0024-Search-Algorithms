// =============================================================
// engine/search/dfs.js — Busca em Profundidade (Depth-First Search)
//
// DICA: é praticamente idêntica ao bfs.js, com UMA diferença:
// - BFS usa `frontier.shift()` (remove do INÍCIO -> fila, FIFO)
// - DFS usa `frontier.pop()`   (remove do FIM -> pilha, LIFO)
//
// Copiem a estrutura de bfs.js e troquem shift() por pop() como
// ponto de partida — vocês vão notar que o DFS "mergulha" fundo em
// uma direção antes de voltar, bem diferente do padrão "em ondas" do BFS.
// =============================================================

import { reconstructPath } from './search-utils.js';

export function* dfs(grid, startCell, goalCell) {
  const frontier = [];
  startCell.g = 0;
  startCell.inFrontier = true;
  frontier.push(startCell);

  while (frontier.length > 0) {
    // TODO: remover o próximo nó a expandir (pop = pilha/LIFO)
    const current = null; // <- substituir

    // TODO: marcar como visitado, tirar da fronteira

    // TODO: se current === goalCell -> return { found: true, path: reconstructPath(goalCell) }

    // TODO: para cada vizinho caminhável e não visitado ainda:
    //         - definir parent
    //         - marcar inFrontier = true
    //         - empilhar

    yield;
  }

  return { found: false, path: [] };
}
