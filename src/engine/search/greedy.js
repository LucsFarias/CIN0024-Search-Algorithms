import { PriorityQueue, heuristic, reconstructPath } from './search-utils.js';

export function* greedy(grid, startCell, goalCell) {
  const frontier = new PriorityQueue();
  startCell.g = 0;
  startCell.h = heuristic(startCell, goalCell);
  startCell.inFrontier = true;
  frontier.enqueue(startCell, startCell.h);

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
        neighbor.h = heuristic(neighbor, goalCell);
        neighbor.inFrontier = true;
        frontier.enqueue(neighbor, neighbor.h);
      }
    }

    yield;
  }

  return { found: false, path: [] };
}