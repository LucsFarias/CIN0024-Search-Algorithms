// =============================================================
// engine/search/index.js
// Um único lugar que lista os algoritmos disponíveis. Tanto o hook
// (useP5Sketch) quanto o componente de UI (ControlsPanel) importam
// daqui — evitando repetir essa lista em dois lugares.
// =============================================================

import { bfs } from './bfs.js';
import { dfs } from './dfs.js';
import { ucs } from './ucs.js';
import { greedy } from './greedy.js';
import { astar } from './astar.js';

export const ALGORITHMS = {
  bfs: { label: 'Largura (BFS)', run: bfs },
  dfs: { label: 'Profundidade (DFS)', run: dfs },
  ucs: { label: 'Custo Uniforme (UCS)', run: ucs },
  greedy: { label: 'Gulosa (Greedy)', run: greedy },
  astar: { label: 'A*', run: astar },
};

export const DEFAULT_ALGORITHM = 'astar';
