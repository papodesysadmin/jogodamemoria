# Jogo da Memória Acessível - Documento de Requisitos do Produto (PRD)

## 1. Visão Geral do Produto
Jogo da memória acessível para web, desenvolvido para uso em navegador em celulares, tablets e computadores, com foco em acessibilidade cognitiva, previsibilidade visual e autorregulação.

- Público-alvo principal: pessoas com TEA, TDAH, epilepsia e perfis com necessidades sensoriais e cognitivas semelhantes.
- Proposta de valor: oferecer uma atividade estruturada, calma e sem punição, útil para treino de memória, foco e regulação emocional.
- Escopo atual: aplicação estática em HTML, CSS e JavaScript, sem backend e com persistência apenas local.

## 2. Objetivos do Produto

### 2.1 Objetivos Terapêuticos e de Uso
- Estimular memória de trabalho e concentração com progressão simples de dificuldade.
- Apoiar momentos de pausa e autorregulação por meio de interface previsível e modo calmo.
- Reduzir sobrecarga cognitiva com fluxo enxuto, sem anúncios, sem pop-ups e sem pressão por erro.

### 2.2 Objetivos Técnicos
- Funcionar como aplicação web leve e sem instalação.
- Manter compatibilidade com navegação por teclado e tecnologias assistivas.
- Preservar privacidade com armazenamento local e sem coleta de dados pessoais.

## 3. Funcionalidades Implementadas

### 3.1 Jogo Principal
- Dificuldade configurável com 4, 6, 8 ou 12 pares.
- Geração dinâmica de cartas e embaralhamento automático.
- Verificação de pares com feedback visual suave.
- Fluxos de pausa, reinício, saída e tela final de vitória.

### 3.2 Personalização e Configurações
- Seleção de tema por símbolos: animais, objetos e natureza.
- Ajuste de tamanho das cartas: pequeno, médio e grande.
- Ativação e desativação de sons.
- Controle de volume.
- Ativação do modo calmo.
- Opção de temporizador mantida na interface, porém ainda sem contagem funcional exibida.
- Controle de escala da interface até 200% com aplicação parcial por faixas predefinidas.
- Alternativa para reduzir movimento.

### 3.3 Autorregulação
- Modo calmo com áudio sintético ambiente de baixa intensidade.
- Feedback sonoro suave para virar carta, acerto e vitória.
- Histórico privado de sessões salvo localmente.

### 3.4 Acessibilidade
- Estrutura semântica com ARIA.
- Região de anúncio para leitores de tela.
- Navegação por teclado entre botões e cartas.
- Indicadores visuais de foco.
- Layout responsivo com grid centralizado para as cartas.

## 4. Funcionalidades Parciais ou Não Implementadas
- Temporizador opcional ainda não possui cronômetro funcional visível.
- Não há sistema de conquistas.
- Não há imagens reais ou biblioteca de assets; os temas usam emojis e símbolos inline.
- A tela de regras é textual e não contém ilustrações dedicadas.

## 5. Fluxo Principal do Usuário

### 5.1 Fluxo Atual
```text
Tela inicial
→ abrir configurações, regras ou histórico
→ iniciar partida
→ virar cartas e validar pares
→ pausar, reiniciar ou continuar
→ concluir a partida
→ visualizar mensagem final
→ voltar ao menu ou jogar novamente
```

### 5.2 Comportamento Esperado
- O usuário consegue iniciar uma partida com um clique.
- O tabuleiro continua funcional após cada jogada, sem necessidade de refresh.
- O histórico fica disponível apenas naquele navegador.

## 6. Design e Experiência

### 6.1 Direção Visual
- Interface minimalista e consistente.
- Paleta calma em azul, verde e neutros claros.
- Tipografia sans-serif legível com base em 16px.
- Transições suaves para evitar estímulos abruptos.

### 6.2 Layout
- Cabeçalho fixo no jogo com status da partida.
- Grid centralizada para o tabuleiro.
- Rodapé fixo com ações secundárias no modo de jogo.
- Telas distintas para início, configurações, regras, histórico e vitória.

## 7. Privacidade e Segurança
- Não há autenticação, backend ou coleta remota de dados.
- Preferências e histórico são armazenados em `localStorage`.
- O projeto usa fonte externa do Google Fonts, o que representa dependência de terceiros de baixo risco, mas relevante para privacidade de rede.

## 8. Estado Atual da Entrega
- Jogo funcional e publicado na Vercel.
- Repositório GitHub criado e sincronizado.
- `vercel.json` configurado com headers básicos de segurança.
- Documentação ajustada ao estado real do projeto.
