# Agente Coletor de Comida — Estratégias de Busca (React + Tailwind + p5.js)

Simulação de um agente que coleta comida em um grid com 4 tipos de terreno
(obstáculo, areia, atoleiro, água), usando diferentes estratégias de busca:
Largura (BFS), Profundidade (DFS), Custo Uniforme (UCS), Gulosa e A*.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Build de produção (gera a pasta `dist/`, que pode ser hospedada em qualquer
serviço de site estático — Vercel, Netlify, GitHub Pages, etc.):
```bash
npm run build
npm run preview   # serve o build de produção localmente, pra conferir
```

## Stack

- **React 19 + Vite** — sem Next.js: como o projeto não tem back-end nem
  rotas, Vite evita a complexidade extra de SSR (o p5.js só funciona no
  navegador, então com Next seria preciso lidar com `"use client"` e
  `dynamic(..., { ssr: false })` — aqui isso simplesmente não existe).
- **Tailwind CSS v4** — plugado direto no Vite via `@tailwindcss/vite`
  (a v4 não usa mais `tailwind.config.js` por padrão: a configuração vive
  no próprio `src/index.css`, com `@import "tailwindcss";`).
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
├── engine/                    # lógica pura, sem nada de React (fácil de testar isolado)
│   ├── Cell.js                  # terreno + estado de busca (visited/g/h/f/parent)
│   ├── Grid.js                  # gera o mapa aleatório, matriz de Cell
│   ├── Agent.js                  # posição em pixels, deslocamento com velocidade variável
│   ├── Food.js                   # posição da comida
│   └── search/
│       ├── search-utils.js         # PriorityQueue + heurísticas + reconstructPath
│       ├── index.js                # mapa { chave -> { label, run } } dos 5 algoritmos
│       ├── bfs.js                  # IMPLEMENTADO — referência de padrão para os demais
│       ├── dfs.js                  # esqueleto com TODOs
│       ├── ucs.js                  # esqueleto com TODOs
│       ├── greedy.js               # esqueleto com TODOs
│       └── astar.js                # esqueleto com TODOs
├── hooks/
│   └── useP5Sketch.js            # cria a instância do p5 e implementa o ciclo do agente
├── components/
│   ├── SimulationCanvas.jsx      # container onde o p5 desenha
│   └── ControlsPanel.jsx         # select de algoritmo, botão reiniciar, contador (Tailwind)
└── App.jsx                     # junta tudo

```

### Por que os algoritmos são "generator functions" (`function*`)?

Cada algoritmo processa **uma célula por vez** e faz `yield` entre cada
uma. Isso é o que permite animar a busca passo a passo: a cada frame do
`p.draw()`, o hook chama `.next()` no generator, processa mais um
pedacinho da busca, e desenha o estado atual do grid (fronteira em
amarelo, visitados em azul, caminho final em verde) antes do próximo frame.

### Por que `algorithmRef` (useRef) em vez de state pro algoritmo?

O loop `draw()` do p5 roda a ~60 quadros por segundo, fora do ciclo de
re-render do React. Se o sketch dependesse de um `state`, cada troca de
algoritmo recriaria a função do sketch (e a instância do p5 inteira). Em
vez disso, o `<select>` escreve num `useRef` (`algorithmRef.current`), e o
sketch só *lê* esse valor no momento de iniciar cada nova busca — sem
precisar recriar nada. Já o contador de comidas *é* um `state` de
propósito, porque ele precisa re-renderizar a UI (o número na tela).

### Ciclo do agente (implementado em `useP5Sketch.js`)

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
- **▶/⏸ Autoplay** — liga/desliga o avanço automático (como era antes,
  a ~60 passos por segundo).
- **⏩ Concluir busca** — pula direto pro resultado final, sem animar (útil
  quando não se quer ver passo a passo naquele momento).

Esses controles funcionam com qualquer algoritmo selecionado, mas hoje só
fazem sentido de verdade no BFS, que é o único totalmente implementado —
os outros (DFS, UCS, Gulosa, A*) ainda são esqueletos com `TODO`, então vão
ficar "parados" na fronteira até serem implementados.

## Status da implementação

- ✅ Estrutura React/Tailwind/p5, grid, agente, comida, movimento com
  velocidade variável, UI e ciclo completo: **prontos e funcionais**.
- ✅ BFS: **implementado** como referência de padrão.
- ⏳ DFS, UCS, Gulosa, A*: **esqueletos com `TODO`s** — a lógica de cada
  um segue o mesmo padrão do BFS, mudando a estrutura de dados da
  fronteira (pilha, fila de prioridade por `g`, por `h`, por `f = g + h`).

## Time

<!-- Preencher no Relatório de Post-mortem: nome de cada integrante e sua responsabilidade -->

- Integrante 1 — responsabilidade
- Integrante 2 — responsabilidade
- Integrante 3 — responsabilidade

## Comandos de Git para começar

```bash
cd buscas-agentes-p5-react
git init
git add .
git commit -m "Estrutura inicial do projeto (React + Tailwind + p5.js)"

# criar o repositório no GitHub antes, depois:
git remote add origin <URL_DO_SEU_REPOSITORIO>
git branch -M main
git push -u origin main
```

Sugestão de fluxo em grupo: cada integrante cria uma branch por
funcionalidade (ex: `feature/dfs`, `feature/astar`) e abre um Pull Request
para revisão antes de mesclar na `main` — evita conflitos e facilita saber
quem fez o quê (útil para a parte de "divisão do trabalho" do post-mortem).