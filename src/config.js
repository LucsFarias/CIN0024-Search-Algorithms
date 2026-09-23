// --- Grid ---
export const COLS = 10;
export const ROWS = 10;
export const CELL_SIZE = 50;

// --- Tipos de terreno ---
export const TERRAIN = {
  OBSTACLE: 'OBSTACLE',
  SAND: 'SAND',   // custo baixo
  MUD: 'MUD',     // custo médio
  WATER: 'WATER', // custo alto
  //NORMAL: 'NORMAL', // custo mínimo (não usado, mas poderia ser)
};

// Custo de energia para atravessar cada terreno
// Preferir dividir por tipo e custo caso queiramos fazer coisas diferentes sla
export const TERRAIN_COST = {
  [TERRAIN.SAND]: 10,
  [TERRAIN.MUD]: 50,
  [TERRAIN.WATER]: 100,
  [TERRAIN.OBSTACLE]: Infinity,
  //[TERRAIN.NORMAL]: 1,
};

// Probabilidade de cada terreno aparecer na geração aleatória (100% total)
export const TERRAIN_PROBABILITY = {
  [TERRAIN.OBSTACLE]: 0.15,
  [TERRAIN.SAND]: 0.45,
  [TERRAIN.MUD]: 0.25,
  [TERRAIN.WATER]: 0.15,
  //[TERRAIN.NORMAL]: 0.0,
};

// Cores de cada terreno (pq sim...) Quero ter uma opção para escolher a paleta de cores tbm
export const TERRAIN_COLOR = {
  [TERRAIN.OBSTACLE]: '#2b2b2b',
  [TERRAIN.SAND]: '#e0c068',
  [TERRAIN.MUD]: '#7a5c3e',
  [TERRAIN.WATER]: '#3b7dd8',
  //[TERRAIN.NORMAL]: '#a0a0a0',
};

// Velocidade base do agente (px/frame) em terreno de custo mínimo.
// A velocidade real escala inversamente com o custo do terreno (agent.js). Mas eu tô achando iso muito chato
export const AGENT_BASE_SPEED = 3;

// Cores de estado da busca, sobrepostas ao terreno
export const SEARCH_COLOR = {
  FRONTIER: 'rgba(255, 230, 0, 0.55)',
  VISITED: 'rgba(120, 120, 255, 0.35)',
  PATH: 'rgba(0, 255, 120, 0.75)',
};

// Quantas células a busca processa por frame durante a animação
export const SEARCH_STEPS_PER_FRAME = 1;

// Heurística usada por Gulosa e A*: 'manhattan' ou 'euclidean'
// gambiarrazinha n sei se vai precisar, quem for fazer oa lgoritmo de ast vai ter que ler essa constante e usar a heurística certa
export const HEURISTIC_TYPE = 'manhattan';
