// =============================================================
// engine/Grid.js
// O ambiente inteiro: matriz `rows` x `cols` de Cell (dimensões agora
// dinâmicas, definidas na hora de criar o Grid — ver useP5Sketch.js).
// Gera o mapa usando Perlin noise e desenha todas as células.
// =============================================================

import Cell from './Cell.js';
import {
  TERRAIN,
  TERRAIN_COST,
  NOISE_SCALE,
  TERRAIN_NOISE_THRESHOLDS,
  OBSTACLE_BLOB_COUNT,
  OBSTACLE_MIN_RADIUS,
  OBSTACLE_MAX_RADIUS,
  OBSTACLE_EDGE_CLEARANCE,
  OBSTACLE_GENERATION_ATTEMPTS,
} from '../config.js';

export default class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
  }

  // Gera um novo mapa usando Perlin noise (p.noise(), do p5 — por isso
  // recebe `p`, a instância do p5, como parâmetro). Diferente de
  // Math.random() célula a célula, o Perlin noise dá valores parecidos
  // pra pontos vizinhos, criando manchas contínuas (blobs) de cada
  // terreno em vez de pixels espalhados aleatoriamente.
  generate(p) {
    // p.noise() é determinística por padrão (mesma "seed" sempre gera o
    // mesmo mapa). Sorteamos uma seed nova aqui pra cada chamada de
    // generate() produzir um mapa diferente — é isso que garante que
    // "Reiniciar" realmente gera um mapa novo.
    this.seed = Math.floor(Math.random() * 100000);
    p.noiseSeed(this.seed);

    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < this.cols; col++) {
        const noiseValue = p.noise(col * NOISE_SCALE, row * NOISE_SCALE);
        rowCells.push(new Cell(row, col, this.#terrainFromNoise(noiseValue)));
      }
      this.cells.push(rowCells);
    }

    // Os obstáculos são gerados separadamente do Perlin noise.
    // Cada região só é mantida se o mapa continuar conectado.
    this.#generateObstacles();
  }

  // Converte um valor de ruído (0 a 1) no tipo de terreno correspondente,
  // de acordo com as faixas definidas em TERRAIN_NOISE_THRESHOLDS.
  // Obstáculos não são mais definidos aqui: eles são adicionados depois.
  #terrainFromNoise(noiseValue) {
    const { sandMax, mudMax } = TERRAIN_NOISE_THRESHOLDS;

    if (noiseValue < sandMax) return TERRAIN.SAND;
    if (noiseValue < mudMax) return TERRAIN.MUD;
    return TERRAIN.WATER;
  }

  // Gera pequenas regiões de obstáculos no interior do mapa.
  // Cada região é testada antes de ser aceita para garantir que
  // todas as células caminháveis continuem conectadas.
  #generateObstacles() {
    let createdBlobs = 0;

    while (createdBlobs < OBSTACLE_BLOB_COUNT) {
      let blobCreated = false;

      for (
        let attempt = 0;
        attempt < OBSTACLE_GENERATION_ATTEMPTS;
        attempt++
      ) {
        const obstacleCells = this.#createObstacleBlobCandidate();

        if (obstacleCells.length === 0) continue;

        // Guarda o terreno original para desfazer a tentativa,
        // caso o novo obstáculo desconecte o mapa.
        const previousTerrains = obstacleCells.map((cell) => ({
          cell,
          type: cell.type,
        }));

        for (const cell of obstacleCells) {
          this.#setCellTerrain(cell, TERRAIN.OBSTACLE);
        }

        if (this.#isWalkableAreaConnected()) {
          blobCreated = true;
          createdBlobs++;
          break;
        }

        // O mapa ficou desconectado: restaura os terrenos anteriores.
        for (const previous of previousTerrains) {
          this.#setCellTerrain(previous.cell, previous.type);
        }
      }

      // Evita ficar tentando indefinidamente em mapas pequenos ou
      // em situações em que não seja possível adicionar outro blob.
      if (!blobCreated) break;
    }
  }

  // Cria uma região candidata de obstáculos em formato aproximado
  // de elipse, com o centro afastado das bordas do mapa.
  #createObstacleBlobCandidate() {
    const rowRadius = this.#randomInt(
      OBSTACLE_MIN_RADIUS,
      OBSTACLE_MAX_RADIUS
    );

    const colRadius = this.#randomInt(
      OBSTACLE_MIN_RADIUS,
      OBSTACLE_MAX_RADIUS
    );

    const minCenterRow = rowRadius + OBSTACLE_EDGE_CLEARANCE;
    const maxCenterRow =
      this.rows - 1 - rowRadius - OBSTACLE_EDGE_CLEARANCE;

    const minCenterCol = colRadius + OBSTACLE_EDGE_CLEARANCE;
    const maxCenterCol =
      this.cols - 1 - colRadius - OBSTACLE_EDGE_CLEARANCE;

    // Grid pequeno demais para esse tamanho de obstáculo.
    if (
      minCenterRow > maxCenterRow ||
      minCenterCol > maxCenterCol
    ) {
      return [];
    }

    const centerRow = this.#randomInt(minCenterRow, maxCenterRow);
    const centerCol = this.#randomInt(minCenterCol, maxCenterCol);

    const obstacleCells = [];

    for (
      let row = centerRow - rowRadius;
      row <= centerRow + rowRadius;
      row++
    ) {
      for (
        let col = centerCol - colRadius;
        col <= centerCol + colRadius;
        col++
      ) {
        const normalizedRow = (row - centerRow) / rowRadius;
        const normalizedCol = (col - centerCol) / colRadius;

        // Mantém apenas as células dentro da elipse.
        const insideBlob =
          normalizedRow * normalizedRow +
          normalizedCol * normalizedCol <= 1;

        if (!insideBlob) continue;

        const cell = this.getCell(row, col);

        // Se já for obstáculo de um blob anterior, não adiciona de novo.
        if (!cell.walkable) continue;

        obstacleCells.push(cell);
      }
    }

    return obstacleCells;
  }

  // Verifica se todas as células caminháveis continuam conectadas.
  // Fazemos uma BFS simples partindo de uma célula caminhável qualquer.
  #isWalkableAreaConnected() {
    let startCell = null;
    let totalWalkableCells = 0;

    for (const row of this.cells) {
      for (const cell of row) {
        if (!cell.walkable) continue;

        totalWalkableCells++;

        if (startCell === null) {
          startCell = cell;
        }
      }
    }

    if (startCell === null) return false;

    const queue = [startCell];
    const visited = new Set([startCell]);

    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const current = queue[queueIndex];
      queueIndex++;

      for (const neighbor of current.getNeighbors(this)) {
        if (!neighbor.walkable) continue;
        if (visited.has(neighbor)) continue;

        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    return visited.size === totalWalkableCells;
  }

  // Atualiza o terreno da célula e também as propriedades que dependem dele.
  #setCellTerrain(cell, terrain) {
    cell.type = terrain;
    cell.cost = TERRAIN_COST[terrain];
    cell.walkable = terrain !== TERRAIN.OBSTACLE;
  }

  // Retorna um inteiro aleatório entre min e max, inclusive.
  #randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getCell(row, col) {
    return this.cells[row][col];
  }

  getRandomWalkableCell() {
    // Tenta por sorteio primeiro (rápido, é o caso comum)
    for (let attempt = 0; attempt < this.rows * this.cols * 5; attempt++) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      const cell = this.getCell(row, col);
      if (cell.walkable) return cell;
    }

    // Fallback de segurança: em grids muito pequenos, é teoricamente
    // possível o mapa ficar sem NENHUMA célula caminhável por puro azar.
    // Nesse caso, varremos o grid inteiro em vez de ficar sorteando pra sempre.
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.walkable) return cell;
      }
    }

    throw new Error('Nenhuma célula caminhável neste mapa — tente reiniciar.');
  }

  // Chamar antes de iniciar uma nova busca
  resetSearchState() {
    for (const row of this.cells) {
      for (const cell of row) cell.resetSearchState();
    }
  }

  show(p) {
    for (const row of this.cells) {
      for (const cell of row) cell.show(p);
    }
  }
}