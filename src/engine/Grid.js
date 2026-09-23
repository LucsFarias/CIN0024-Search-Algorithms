import Cell from './Cell.js';
import { ROWS, COLS, TERRAIN, TERRAIN_PROBABILITY } from '../config.js';

export default class Grid {
  constructor() {
    this.cells = [];
    this.generate();
  }

  // Gera um novo mapa sorteando o terreno de cada célula de acordo com
  // TERRAIN_PROBABILITY. É uma geração célula a célula,
  // independente. Se quisermos mapas mais "naturais" (lagos e obstáculos
  // em blocos, em vez de pixels espalhados), pesquisar sobre Perlin
  // Noise — o p5 tem p.noise() pronto pra isso. Alguém pode ficar com isso
  generate() {
    this.cells = [];
    for (let row = 0; row < ROWS; row++) {
      const rowCells = [];
      for (let col = 0; col < COLS; col++) {
        rowCells.push(new Cell(row, col, this.#sortTerrainType()));
      }
      this.cells.push(rowCells);
    }
  }

  #sortTerrainType() {
    const r = Math.random();
    let acc = 0;
    for (const type of Object.keys(TERRAIN_PROBABILITY)) {
      acc += TERRAIN_PROBABILITY[type];
      if (r <= acc) return type;
    }
    return TERRAIN.SAND; // fallback de segurança
  }

  getCell(row, col) {
    return this.cells[row][col];
  }

  getRandomWalkableCell() {
    let cell;
    do {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      cell = this.getCell(row, col);
    } while (!cell.walkable);
    return cell;
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
