# Agente Coletor de Comida — Estratégias de Busca (React + Tailwind + p5.js)

Simulação de um agente que coleta comida em um grid com 4 tipos de terreno
(obstáculo, areia, lama e água), usando diferentes estratégias de busca:
Largura (BFS), Profundidade (DFS), Custo Uniforme (UCS), Gulosa e A*.

## Como rodar

```bash
npm install # ou npm i
npm run dev
```

Abre em `http://localhost:5173`.

Build de produção (gera a pasta `dist/`), que vai ser hospedada para a apresentação. vai estar diretamente ligada á branch `main`, pode ser usada em dev para fins de comparação e desempenho:

```bash
npm run build
npm run preview   
```

## Stack

- **React 19 + Vite** -- Com TailwindCSS pra fins de customização
- **p5.js em "instance mode"** — ver explicação detalhada no topo de
  `src/hooks/useP5Sketch.js`. Resumindo: como não existe mais um único
  arquivo global com `setup()`/`draw()` soltos (isso é o "global mode",
  usado no editor.p5js.org), o p5 é instanciado dentro de um hook React
  (`new p5(sketchFn, container)`), e tudo que seria uma função global vira
  método da instância `p` (`p.setup`, `p.draw`, `p.fill`, etc).

## Arquitetura

```
src/
├── config.js                  # constantes: tamanho do grid, custos, cores, velocidade
├── engine/                    # lógica pura
│   ├── Cell.js                  # terreno + estado de busca (visited/g/h/f/parent)
│   ├── Grid.js                  # gera o mapa aleatório, matriz de Cell
│   ├── Agent.js                  # posição em pixels, deslocamento com velocidade variável
│   ├── Food.js                   # posição da comida
│   └── search/
│       ├── search-utils.js         # PriorityQueue + heurísticas + reconstructPath
│       ├── index.js                # mapa dos 5 algoritmos
│       ├── bfs.js                  # IMPLEMENTADO — referência de padrão para os demais
│       ├── dfs.js                  
│       ├── ucs.js                  
│       ├── greedy.js               
│       └── astar.js                
├── hooks/
│   └── useP5Sketch.js            # cria a instância do p5 e implementa o ciclo do agente (não acho que precisamos mexer)
├── components/
│   ├── SimulationCanvas.jsx      # container onde o p5 desenha
│   └── ControlsPanel.jsx         # select de algoritmo, botão reiniciar, contador
└── App.jsx                     # junta tudo

```

### Por que os algoritmos são "generator functions" (`function*`)?

Cada algoritmo processa **uma célula por vez** e faz `yield` entre cada
uma. Isso é o que permite animar a busca passo a passo: a cada frame do
`p.draw()`, o hook chama `.next()` no generator, processa mais um
pedacinho da busca, e desenha o estado atual do grid (fronteira em
amarelo, visitados em azul, caminho final em verde (vamos mudar a paleta de cores pq eu fiz de qualque jeito, ai tá super feio)) antes do próximo frame.

### Ciclo do agente

1. Mapa gerado aleatoriamente (`Grid`)
2. Usuário escolhe o algoritmo no `<select>` do `ControlsPanel`
3. Agente spawna em célula caminhável aleatória
4. Comida spawna em célula caminhável aleatória (define o objetivo)
5–7. Busca roda do estado atual do agente até a comida, animada frame a frame
8. Agente segue o caminho encontrado, com velocidade menor em terrenos caros
9. Colisão com a comida → contabiliza e remove a comida
10. Volta ao passo 4 (nova comida aparece)

Reiniciar o programa (botão "Reiniciar") sempre gera um mapa novo — cobre
o requisito de demonstrar adaptabilidade.

### Controles de passo a passo da busca

A busca **começa pausada** por padrão, pra dar tempo de estudar cada passo
(fronteira e visitados) antes de qualquer coisa acontecer:

- **⏭ Passo seguinte** — avança exatamente uma célula expandida da busca.
- **▶/⏸ Autoplay** — liga/desliga o avanço automático
- **⏩ Concluir busca** — pula direto pro resultado final, sem animar (útil
  quando não se quer ver passo a passo naquele momento).

Esses controles funcionam com qualquer algoritmo selecionado, mas hoje só
o BFS pode ser usado, que é o único totalmente implementado —
os outros (DFS, UCS, Gulosa, A*) ainda são esqueletos, então vão
ficar "parados" na fronteira até serem implementados.