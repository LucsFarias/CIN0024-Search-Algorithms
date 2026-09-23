import { HEURISTIC_TYPE } from '../../config.js';

export class PriorityQueue {
  constructor() {
    this.items = []; // cada item: { element, priority }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift().element;
  }
}

export function manhattanDistance(cellA, cellB) {
  return Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col);
}

export function euclideanDistance(cellA, cellB) {
  return Math.hypot(cellA.row - cellB.row, cellA.col - cellB.col);
}

export function heuristic(cellA, cellB) {
  return HEURISTIC_TYPE === 'euclidean'
    ? euclideanDistance(cellA, cellB)
    : manhattanDistance(cellA, cellB);
}

// Reconstrói o caminho final percorrendo os ".parent" a partir do
// objetivo até o início, e inverte a ordem. Comum a TODOS os algoritmos.
export function reconstructPath(goalCell) {
  const path = [];
  let current = goalCell;
  while (current !== null) {
    current.onFinalPath = true;
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
}
