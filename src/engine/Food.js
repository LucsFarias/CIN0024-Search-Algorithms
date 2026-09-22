// =============================================================
// engine/Food.js
// =============================================================

import { CELL_SIZE } from '../config.js';

export default class Food {
  constructor(cell) {
    this.cell = cell;
  }

  show(p) {
    p.push();
    p.noStroke();
    p.fill('#ffffff');
    p.circle(this.cell.centerX(), this.cell.centerY(), CELL_SIZE * 0.35);
    p.pop();
  }
}
