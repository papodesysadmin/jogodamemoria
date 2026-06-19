# Jogo da Memória Acessível

Jogo da memória acessível para web, pensado para oferecer uma experiência calma, previsível e leve, com foco em pessoas com TEA, TDAH, epilepsia e perfis com necessidades cognitivas e sensoriais semelhantes.

## Objetivo

O projeto busca unir:

- exercício cognitivo com progressão simples
- interface sem sobrecarga visual
- recursos de autorregulação
- acessibilidade para teclado e leitor de tela
- privacidade local, sem backend e sem coleta de dados pessoais

## Acesso

- Produção na Vercel: [jogodamemoria-chi.vercel.app](https://jogodamemoria-chi.vercel.app)
- Repositório GitHub: [papodesysadmin/jogodamemoria](https://github.com/papodesysadmin/jogodamemoria)

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- Web Audio API
- LocalStorage
- Vercel

## Funcionalidades Implementadas

- jogo da memória com 4, 6, 8 ou 12 pares
- temas por símbolos: animais, objetos e natureza
- ajuste de tamanho das cartas
- histórico local de partidas
- tela de regras com linguagem simples
- navegação por teclado
- anúncios para leitor de tela
- modo calmo com áudio sintético suave
- sons de feedback para jogadas e vitória
- escala de interface e redução de movimento

## Estrutura do Projeto

```text
jogodamemoria/
├── .trae/documents/
├── css/
│   └── estilos.css
├── js/
│   ├── accessibility.js
│   ├── audio.js
│   ├── cards.js
│   ├── jogo.js
│   ├── main.js
│   └── storage.js
├── index.html
├── vercel.json
└── README.md
```

## Como Executar Localmente

Como o projeto é estático, basta servir os arquivos por um servidor HTTP simples.

Exemplo com Python:

```bash
python3 -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Deploy

O projeto está preparado para deploy na Vercel com configuração explícita em `vercel.json`.

Principais pontos da configuração:

- `cleanUrls`
- `trailingSlash: false`
- headers básicos de segurança
- política de conteúdo para scripts, estilos, fontes e mídia

### Status da Automação com Git

- o projeto local já está vinculado a um projeto existente da Vercel
- a CLI da Vercel consegue operar o deploy manualmente
- a tentativa de conectar automaticamente o projeto da Vercel ao repositório GitHub via `vercel git connect` falhou por permissão de integração
- para habilitar deploy automático por commit, pode ser necessário autorizar o acesso da Vercel ao repositório `papodesysadmin/jogodamemoria` no painel/integrations da Vercel

## Segurança e Privacidade

- não utiliza backend
- não armazena dados pessoais
- salva apenas preferências do jogo e histórico local no navegador
- não expõe tokens, segredos ou chaves no código-fonte

Observação:

- o projeto usa Google Fonts, o que adiciona uma dependência externa de fonte

## Limitações Atuais

- o temporizador ainda não está implementado de forma funcional
- os temas usam emojis, não imagens dedicadas
- a escala da interface é aplicada em faixas predefinidas no CSS

## Documentação Interna

- PRD: `.trae/documents/prd.md`
- Arquitetura: `.trae/documents/arquitetura-tecnica.md`

## Próximos Passos Sugeridos

- transformar o temporizador em funcionalidade real
- substituir emojis por imagens acessíveis e consistentes
- hospedar fontes localmente para reduzir dependências externas
- consolidar automação de deploy por commit com integração Git na Vercel
