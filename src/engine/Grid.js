// =============================================================
// engine/Grid.js
// O ambiente inteiro: matriz `rows` x `cols` de Cell (dimensões agora
// dinâmicas, definidas na hora de criar o Grid — ver useP5Sketch.js).
// Gera o mapa usando Perlin noise e desenha todas as células.
// =============================================================

import Cell from './Cell.js';
import { TERRAIN, NOISE_SCALE, TERRAIN_NOISE_THRESHOLDS } from '../config.js';

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
    p.noiseSeed(Math.floor(Math.random() * 100000));

    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < this.cols; col++) {
        const noiseValue = p.noise(col * NOISE_SCALE, row * NOISE_SCALE);
        rowCells.push(new Cell(row, col, this.#terrainFromNoise(noiseValue)));
      }
      this.cells.push(rowCells);
    }
  }

  // Converte um valor de ruído (0 a 1) no tipo de terreno correspondente,
  // de acordo com as faixas definidas em TERRAIN_NOISE_THRESHOLDS.
  #terrainFromNoise(noiseValue) {
    const { obstacleMax, sandMax, mudMax } = TERRAIN_NOISE_THRESHOLDS;
    if (noiseValue < obstacleMax) return TERRAIN.OBSTACLE;
    if (noiseValue < sandMax) return TERRAIN.SAND;
    if (noiseValue < mudMax) return TERRAIN.MUD;
    return TERRAIN.WATER;
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
    // possível o Perlin noise gerar um mapa sem NENHUMA célula
    // caminhável por puro azar. Nesse caso, varremos o grid inteiro em
    // vez de ficar sorteando pra sempre.
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