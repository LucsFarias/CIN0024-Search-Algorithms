// =============================================================
// config.js
// Todas as "constantes ajustáveis" do projeto. Mudou o tamanho do
// grid, os custos de terreno ou as cores? É só mexer aqui.
// =============================================================

// --- Grid ---
// COLS e ROWS agora são parametrizáveis pelo usuário na UI (ver
// ControlsPanel/App) — os valores abaixo são só o ponto de partida e os
// limites aceitos, pra evitar grids grandes demais (lentas de renderizar)
// ou pequenas demais (sem espaço pra busca fazer sentido).
export const DEFAULT_COLS = 40;
export const DEFAULT_ROWS = 25;
export const MIN_GRID_SIZE = 5;
export const MAX_GRID_SIZE = 60;
export const CELL_SIZE = 24;

// --- Tipos de terreno ---
export const TERRAIN = {
  OBSTACLE: 'OBSTACLE',
  SAND: 'SAND',   // custo baixo
  MUD: 'MUD',     // custo médio
  WATER: 'WATER', // custo alto
};

// Custo de energia para atravessar cada terreno
export const TERRAIN_COST = {
  [TERRAIN.SAND]: 10,
  [TERRAIN.MUD]: 50,
  [TERRAIN.WATER]: 100,
  [TERRAIN.OBSTACLE]: Infinity,
};

// --- Geração de terreno via Perlin Noise ---
// Perlin noise (p.noise() do p5) gera um valor "suave" entre 0 e 1 pra
// cada ponto (col, row): pontos vizinhos tendem a ter valores parecidos,
// o que cria manchas contínuas (blobs) em vez do "ruído branco" de sortear
// cada célula de forma totalmente independente. É por isso que o mapa fica
// com cara de terreno de verdade (lagos, paredes rochosas) em vez de
// pixels aleatórios espalhados.
//
// NOISE_SCALE controla o "zoom": quanto MENOR, maiores e mais suaves ficam
// as manchas (mapas com regiões grandes e bem definidas); quanto MAIOR,
// mais picotado/ruidoso fica.
export const NOISE_SCALE = 0.08;

// Faixas de valor de ruído (0 a 1) que definem qual terreno aparece.
// Ex: ruído abaixo de 0.34 -> obstáculo; entre 0.34 e 0.55 -> areia; etc.
// Tudo acima de mudMax vira água. Ajustem esses números pra controlar a
// proporção de cada terreno no mapa final.
export const TERRAIN_NOISE_THRESHOLDS = {
  obstacleMax: 0.34,
  sandMax: 0.55,
  mudMax: 0.75,
};

// Cores de cada terreno
export const TERRAIN_COLOR = {
  [TERRAIN.OBSTACLE]: '#2b2b2b',
  [TERRAIN.SAND]: '#e0c068',
  [TERRAIN.MUD]: '#7a5c3e',
  [TERRAIN.WATER]: '#3b7dd8',
};

// Velocidade base do agente (px/frame) em terreno de custo mínimo.
// A velocidade real escala inversamente com o custo do terreno (agent.js).
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
export const HEURISTIC_TYPE = 'manhattan';