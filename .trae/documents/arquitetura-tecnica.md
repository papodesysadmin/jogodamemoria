# Jogo da Memória Acessível - Arquitetura Técnica

## 1. Arquitetura do Sistema

```text
Navegador
├── index.html
├── css/estilos.css
└── js/
    ├── main.js
    ├── jogo.js
    ├── cards.js
    ├── audio.js
    ├── accessibility.js
    └── storage.js

Persistência local
└── localStorage
    ├── jogoMemoria_configuracoes
    └── jogoMemoria_historico

Deploy
├── GitHub
└── Vercel
```

## 2. Stack Tecnológico
- Frontend: HTML5 semântico + CSS3 + JavaScript ES6 vanilla.
- Persistência: `localStorage`.
- Áudio: Web Audio API.
- Deploy: Vercel com configuração em `vercel.json`.
- Repositório remoto: GitHub.

## 3. Estrutura Real do Projeto
```text
jogodamemoria/
├── .trae/
│   └── documents/
│       ├── arquitetura-tecnica.md
│       └── prd.md
├── css/
│   └── estilos.css
├── js/
│   ├── accessibility.js
│   ├── audio.js
│   ├── cards.js
│   ├── jogo.js
│   ├── main.js
│   └── storage.js
├── .gitignore
├── index.html
├── vercel.json
└── README.md
```

## 4. Responsabilidades por Arquivo
| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | Estrutura das telas, formulários, modais e regiões ARIA |
| `css/estilos.css` | Layout, tipografia, grid, responsividade e acessibilidade visual |
| `js/main.js` | Inicialização da aplicação e navegação entre telas |
| `js/jogo.js` | Estado da partida, validação de pares, pausa, vitória e reinício |
| `js/cards.js` | Catálogo de símbolos, embaralhamento e criação das cartas |
| `js/audio.js` | Sons de feedback e áudio ambiente do modo calmo |
| `js/accessibility.js` | Anúncios para leitor de tela, foco e navegação por teclado |
| `js/storage.js` | Persistência local de preferências e histórico |
| `vercel.json` | Configuração explícita do deploy e headers de segurança |

## 5. Modelo de Dados

### 5.1 Configurações
```javascript
{
  temaImagens: "animais" | "objetos" | "natureza",
  tamanhoCartas: "pequeno" | "medio" | "grande",
  dificuldade: 4 | 6 | 8 | 12,
  somAtivado: boolean,
  volume: 0-100,
  modoCalmo: boolean,
  temporizadorAtivado: boolean,
  escalaInterface: 100-200,
  reduzirMovimento: boolean
}
```

### 5.2 Histórico
```javascript
{
  sessoes: [
    {
      data: "2026-06-19T16:00:00.000Z",
      dificuldade: 8,
      tema: "animais",
      paresEncontrados: 8,
      tempoJogado: 120
    }
  ]
}
```

## 6. Fluxo Técnico Principal

### 6.1 Inicialização
1. `main.js` carrega as configurações salvas.
2. `Accessibility.init()`, `Audio.init()` e `Jogo.init()` são chamados.
3. A UI aplica preferências de acessibilidade e áudio.
4. A tela inicial é exibida.

### 6.2 Partida
1. O usuário inicia a partida.
2. `Jogo.iniciarJogo()` gera cartas por meio de `Cards.gerarCartas()`.
3. O tabuleiro é renderizado.
4. Cliques viram cartas e disparam verificação de pares.
5. Ao concluir todos os pares, o histórico é salvo e a tela de vitória é exibida.

## 7. Acessibilidade Implementada
- Estrutura semântica com labels ARIA nas áreas principais.
- Navegação por teclado com suporte a `Tab`, `Enter`, `Espaço` e setas nas cartas.
- Announcer com `aria-live` para comunicar eventos da partida.
- Foco visível em elementos interativos.
- Opção de reduzir movimento e escala de interface.

## 8. Áudio e Autorregulação
- Feedback sintético ao virar carta, acertar par e concluir a partida.
- Modo calmo com acorde suave em baixa frequência e ruído marrom leve.
- Respeito às políticas de autoplay com retomada do contexto de áudio após interação do usuário.

## 9. Deploy e Segurança
- O projeto é estático e não exige build.
- A Vercel publica a raiz do projeto.
- `vercel.json` define:
  - `cleanUrls`
  - `trailingSlash: false`
  - `Content-Security-Policy`
  - `Referrer-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Permissions-Policy`

## 10. Limitações Conhecidas
- O temporizador ainda é apenas uma opção de configuração, sem cronômetro funcional exibido.
- A escala da interface não é totalmente contínua; o CSS aplica degraus predefinidos.
- Os temas visuais usam emojis, não imagens reais.
- A fonte externa do Google Fonts continua como dependência de terceiros.
