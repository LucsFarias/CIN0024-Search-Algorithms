// =============================================================
// engine/Agent.js
// O agente coletor. Posição em PIXELS (x, y)
//
// A velocidade em cada trecho depende do custo do terreno de DESTINO: (n sei se vale a pena)
// terreno caro (água) = anda devagar, terreno barato (areia) = rápido.
// =============================================================

import { CELL_SIZE, AGENT_BASE_SPEED } from '../config.js';

export default class Agent {
  constructor(cell) {
    this.setCell(cell);
    this.path = [];
    this.pathIndex = 0;
  }

  setCell(cell) {
    this.currentCell = cell;
    this.x = cell.centerX();
    this.y = cell.centerY();
  }

  setPath(path) {
    this.path = path;
    this.pathIndex = 0;
  }

  hasPathToFollow() {
    return this.pathIndex < this.path.length;
  }

  update() {
    if (!this.hasPathToFollow()) return;

    const targetCell = this.path[this.pathIndex];
    const targetX = targetCell.centerX();
    const targetY = targetCell.centerY();

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    // Quanto maior o custo do terreno, menor a velocidade.
    const speed = AGENT_BASE_SPEED * (10 / targetCell.cost);

    if (distance <= speed) {
      this.x = targetX;
      this.y = targetY;
      this.currentCell = targetCell;
      this.pathIndex++;
    } else {
      this.x += (dx / distance) * speed;
      this.y += (dy / distance) * speed;
    }
  }

  show(p) {
    p.push();
    p.noStroke();
    p.fill('#ff3b30');
    p.circle(this.x, this.y, CELL_SIZE * 0.6);
    p.pop();
  }
}
