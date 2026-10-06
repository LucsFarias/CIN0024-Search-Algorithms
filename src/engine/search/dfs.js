// 

import { reconstructPath } from './search-utils.js';

export function* dfs(grid, startCell, goalCell) {
  startCell.g = 0;

  function* visit(current) {
    if (current.visited) return false;

    current.visited = true;
    current.inFrontier = false;

    if (current === goalCell) {
      return true;
    }

    const neighbors = current.getNeighbors(grid);

    for (const neighbor of neighbors) {
      if (!neighbor.walkable || neighbor.visited) {
        continue;
      }

      neighbor.parent = current;
      neighbor.g = current.g + neighbor.cost;
      neighbor.inFrontier = true;

      yield;

      const found = yield* visit(neighbor);

      if (found) {
        return true;
      }
    }

    return false;
  }

  const found = yield* visit(startCell);

  if (found) {
    return {
      found: true,
      path: reconstructPath(goalCell)
    };
  }

  return {
    found: false,
    path: []
  };
}
