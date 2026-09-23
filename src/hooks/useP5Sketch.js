//boy....a IA que fez essa parte, n me perguntem pfvr

// =============================================================
// hooks/useP5Sketch.js
//
// Por que "instance mode" e não a global (a do editor.p5js.org, com
// setup()/draw() soltos no arquivo)? Porque em React não podemos ter
// funções globais setup()/draw() — cada componente pode ter seu próprio
// sketch, então o p5 precisa ser "instanciado": `new p5(sketchFn, container)`.
// Dentro do sketchFn, tudo que era global vira método de `p` (p.setup,
// p.draw, p.createCanvas, p.fill, etc).
//
// Este hook cria essa instância dentro de um useEffect (efeito colateral
// que mexe fora do React — no caso, no DOM/canvas), guarda uma referência
// pra ela, e a destrói (p.remove()) quando o componente desmonta — isso é
// o "cleanup" que evita vazar instâncias de p5 duplicadas caso o
// componente seja recriado (comum em StrictMode/hot-reload do Vite).
//
// A comunicação com o React funciona em duas mãos usando REFs (não
// state), porque o loop draw() do p5 roda ~60x por segundo e não pode
// depender do ciclo de re-render do React:
//   - algorithmRef: React escreve (quando o usuário troca o <select>),
//                    o sketch só LÊ, no momento de iniciar cada busca.
//   - onFoodCollected: callback que o sketch CHAMA sempre que uma
//                       comida é coletada, pra atualizar o contador
//                       (esse sim vira um state lá no App, pois é
//                       exibido na tela).
// =============================================================

import { useEffect, useRef } from 'react';
import p5 from 'p5';
import Grid from '../engine/Grid.js';
import Agent from '../engine/Agent.js';
import Food from '../engine/Food.js';
import { COLS, ROWS, CELL_SIZE, SEARCH_STEPS_PER_FRAME } from '../config.js';
import { ALGORITHMS, DEFAULT_ALGORITHM } from '../engine/search/index.js';

const STATE = {
  SEARCHING: 'SEARCHING',
  MOVING: 'MOVING',
  NO_PATH: 'NO_PATH',
};

export function useP5Sketch({ containerRef, algorithmRef, onFoodCollected }) {
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let grid, agent, food, state, searchGenerator;

      // Controla se a busca avança sozinha a cada frame (autoplay) ou só
      // quando o usuário clica em "Passo seguinte". Começa pausado (false)
      // por padrão, pra dar tempo de estudar o primeiro passo antes de
      // qualquer coisa se mover.
      let isPlaying = false;

      p.setup = () => {
        p.createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
        restart();
      };

      p.draw = () => {
        p.background('#111');
        grid.show(p);

        if (state === STATE.SEARCHING) {
          if (isPlaying) stepSearch();
        } else if (state === STATE.MOVING) {
          stepMovement();
        }

        food.show(p);
        agent.show(p);
      };

      // --- Controles expostos para o React chamar de fora (ver App.jsx) ---

      // Liga/desliga o avanço automático da busca (o "Autoplay" da UI)
      p.setAutoPlay = (value) => {
        isPlaying = value;
      };

      // Avança exatamente UM passo da busca (uma célula expandida),
      // independente do autoplay estar ligado ou não — é o botão
      // "Passo seguinte". Não faz nada se não estiver em busca no momento
      // (ex: agente já está se movendo até a comida).
      p.stepOnce = () => {
        if (state === STATE.SEARCHING) stepSearch();
      };

      // Roda a busca inteira instantaneamente, sem animação — útil pra
      // "pular" pro resultado final quando não se quer ver passo a passo.
      p.finishSearchInstantly = () => {
        while (state === STATE.SEARCHING) stepSearch();
      };

      p.isSearching = () => state === STATE.SEARCHING;

      // Passo 1 do ciclo: gera um novo mapa e reinicia a simulação.
      // Exposta em p.restartSimulation para o botão "Reiniciar" da UI
      // chamar de fora (ver App.jsx).
      function restart() {
        grid = new Grid();
        spawnAgent();  // passo 3
        spawnFood();   // passos 4 e 5 (e dispara a busca, passo 6)
      }
      p.restartSimulation = restart;

      function spawnAgent() {
        agent = new Agent(grid.getRandomWalkableCell());
      }

      function spawnFood() {
        food = new Food(grid.getRandomWalkableCell());
        startSearch();
      }

      // Passos 6 e 7: dispara a busca do algoritmo atualmente
      // selecionado na UI, do estado atual do agente até a comida.
      function startSearch() {
        grid.resetSearchState();
        const algorithmKey = algorithmRef.current ?? DEFAULT_ALGORITHM;
        const runAlgorithm = ALGORITHMS[algorithmKey].run;
        searchGenerator = runAlgorithm(grid, agent.currentCell, food.cell);
        state = STATE.SEARCHING;
      }

      function stepSearch() {
        let result;
        for (let i = 0; i < SEARCH_STEPS_PER_FRAME; i++) {
          result = searchGenerator.next();
          if (result.done) break;
        }

        if (result.done) {
          const { found, path } = result.value;
          if (found) {
            agent.setPath(path); // passo 7 -> 8
            state = STATE.MOVING;
          } else {
            // objetivo inalcançável (comida cercada de obstáculos)
            state = STATE.NO_PATH;
          }
        }
      }

      function stepMovement() {
        agent.update();
        checkFoodCollision();
      }

      // Passo 9: colisão agente-comida = coleta
      function checkFoodCollision() {
        const reachedFood = !agent.hasPathToFollow() && agent.currentCell === food.cell;
        if (reachedFood) {
          onFoodCollected?.();
          spawnFood(); // passo 10: volta ao passo 4
        }
      }
    };

    // Corrige um efeito colateral do React StrictMode (só em desenvolvimento):
    // ele monta/desmonta/remonta o componente de propósito pra pegar bugs de
    // "cleanup", e isso pode deixar o canvas antigo meio "grudado" no DOM
    // por uma fração de segundo antes do cleanup remover de fato. Limpando
    // o container manualmente aqui garantimos que nunca sobra canvas duplicado,
    // independente da ordem exata de mount/unmount do StrictMode.
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const instance = new p5(sketch, containerRef.current);
    p5InstanceRef.current = instance;

    return () => {
      instance.remove();
      p5InstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // roda só uma vez: o sketch lê algorithmRef.current dinamicamente, não precisa recriar a instância quando o algoritmo muda

  return p5InstanceRef;
}