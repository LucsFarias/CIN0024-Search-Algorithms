// =============================================================
// engine/Cell.js
// Uma célula do grid: guarda o terreno (estático) e o estado usado
// pelos algoritmos de busca (dinâmico, resetado a cada nova busca).
//
// Nota sobre p5 em "instance mode": como estamos dentro do React,
// não existem funções globais como fill()/rect() (isso só existe no
// "global mode" do p5, usado no editor.p5js.org). Por isso os métodos
// de desenho recebem `p` (a instância do p5) e chamam p.fill(), p.rect()
// etc.
// =============================================================

import { TERRAIN, TERRAIN_COST, TERRAIN_COLOR, CELL_SIZE, ROWS, COLS, SEARCH_COLOR } from '../config.js';

export default class Cell {
  constructor(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.cost = TERRAIN_COST[type];
    this.walkable = type !== TERRAIN.OBSTACLE;

    this.resetSearchState();
  }

  // Chamado toda vez que uma NOVA busca começa (o mapa continua o
  // mesmo, mas o estado da busca anterior não pode "vazar")
  resetSearchState() {
    this.visited = false;
    this.inFrontier = false;
    this.onFinalPath = false;
    this.parent = null;

    this.g = Infinity;
    this.h = 0;
    this.f = Infinity;
  }

  // 4 vizinhos ortogonais (cima, baixo, esquerda, direita) dentro do grid
  getNeighbors(grid) {
    const neighbors = [];
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dRow, dCol] of deltas) {
      const r = this.row + dRow;
      const c = this.col + dCol;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        neighbors.push(grid.getCell(r, c));
      }
    }
    return neighbors;
  }

  centerX() {
    return this.col * CELL_SIZE + CELL_SIZE / 2;
  }
  centerY() {
    return this.row * CELL_SIZE + CELL_SIZE / 2;
  }

  show(p) {
    p.push();
    p.noStroke();
    p.fill(TERRAIN_COLOR[this.type]);
    p.rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    if (this.onFinalPath) {
      p.fill(SEARCH_COLOR.PATH);
      p.rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if (this.visited) {
      p.fill(SEARCH_COLOR.VISITED);
      p.rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else if (this.inFrontier) {
      p.fill(SEARCH_COLOR.FRONTIER);
      p.rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    p.stroke('#00000055');
    p.noFill();
    p.rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    p.pop();
  }
}
