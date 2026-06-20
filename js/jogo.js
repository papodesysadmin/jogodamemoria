/**
 * Jogo da Memória Acessível - Módulo Principal do Jogo
 * Controla a lógica do jogo e estados
 */

const Jogo = (function() {
    'use strict';

    // Estado do jogo
    let estado = {
        cartas: [],
        paresEncontrados: 0,
        totalPares: 8,
        cartasViradas: [],
        emVerificacao: false,
        tema: 'animais',
        tamanho: 'medio',
        inicioTempo: null,
        tempoJogado: 0,
        intervalos: [],
        pausado: false
    };

    // Elementos do DOM
    let areaJogo = null;
    let elementosUI = {};

    /**
     * Inicializa o jogo
     */
    function init() {
        areaJogo = document.getElementById('area-jogo');
        cachearElementosUI();
        configurarEventListeners();
    }

    /**
     * Cacheia elementos da UI frequentemente usados
     */
    function cachearElementosUI() {
        elementosUI = {
            infoDificuldade: document.getElementById('info-dificuldade'),
            infoPares: document.getElementById('info-pares'),
            modalPausa: document.getElementById('modal-pausa'),
            toast: document.getElementById('toast'),
            toastMensagem: document.getElementById('toast-mensagem'),
            telaJogo: document.getElementById('tela-jogo'),
            telaVitoria: document.getElementById('tela-vitoria'),
            infoVitoriaPares: document.getElementById('info-vitoria-pares'),
            infoVitoriaTempo: document.getElementById('info-vitoria-tempo')
        };
    }

    /**
     * Configura os event listeners
     */
    function configurarEventListeners() {
        // Botão pausar
        document.getElementById('btn-pausar')?.addEventListener('click', pausarJogo);

        // Botão sair do jogo
        document.getElementById('btn-sair-jogo')?.addEventListener('click', () => {
            salvarESair();
        });

        // Botão reiniciar
        document.getElementById('btn-reiniciar')?.addEventListener('click', reiniciarJogo);

        // Modal de pausa
        document.getElementById('btn-continuar')?.addEventListener('click', continuarJogo);
        document.getElementById('btn-reiniciar-pausa')?.addEventListener('click', () => {
            fecharModalPausa();
            reiniciarJogo();
        });
        document.getElementById('btn-sair-pausa')?.addEventListener('click', () => {
            fecharModalPausa();
            salvarESair();
        });

        // Vitóra
        document.getElementById('btn-jogar-novamente')?.addEventListener('click', () => {
            iniciarJogo(estado.totalPares, estado.tema, estado.tamanho);
        });
        document.getElementById('btn-menu-vitoria')?.addEventListener('click', () => {
            salvarESair();
        });

        // Navegação por teclado nas cartas
        areaJogo?.addEventListener('keydown', lidarTecladoCartas);

        // Mantém o tabuleiro equilibrado ao redimensionar a tela
        window.addEventListener('resize', atualizarLayoutTabuleiro);
    }

    /**
     * Obtém a quantidade ideal de colunas para o tabuleiro
     * @param {number} dificuldade - Número de pares da partida
     * @returns {number}
     */
    function obterColunasTabuleiro(dificuldade) {
        const colunasBase = dificuldade >= 12 ? 6 : 4;

        if (window.innerWidth <= 480) return 2;
        if (window.innerWidth <= 760) return Math.min(3, colunasBase);
        if (window.innerWidth <= 1024) return Math.min(4, colunasBase);

        return colunasBase;
    }

    /**
     * Aplica a configuração visual do tabuleiro conforme dificuldade e viewport
     */
    function atualizarLayoutTabuleiro() {
        if (!areaJogo) return;

        const colunas = obterColunasTabuleiro(estado.totalPares);
        areaJogo.style.setProperty('--colunas-tabuleiro', String(colunas));
        areaJogo.dataset.tamanho = estado.tamanho;
        areaJogo.dataset.colunas = String(colunas);
    }

    /**
     * Inicia uma nova partida
     * @param {number} dificuldade - Número de pares
     * @param {string} tema - Tema das imagens
     * @param {string} tamanho - Tamanho das cartas
     */
    function iniciarJogo(dificuldade, tema, tamanho) {
        // Limpa intervalos anteriores
        limparIntervalos();

        // Reinicia estado
        estado = {
            cartas: [],
            paresEncontrados: 0,
            totalPares: dificuldade,
            cartasViradas: [],
            emVerificacao: false,
            tema: tema,
            tamanho: tamanho,
            inicioTempo: Date.now(),
            tempoJogado: 0,
            intervalos: [],
            pausado: false
        };

        // Atualiza UI
        elementosUI.infoDificuldade.textContent = `${dificuldade} pares`;
        atualizarInfoPares();

        // Gera cartas
        estado.cartas = Cards.gerarCartas(dificuldade, tema);

        atualizarLayoutTabuleiro();

        // Limpa e popula área de jogo
        areaJogo.innerHTML = '';
        estado.cartas.forEach((carta, index) => {
            const elemento = Cards.criarElementoCarta(carta, index);
            Cards.atualizarTamanho([elemento], tamanho);
            elemento.addEventListener('click', () => lidarCliqueCarta(elemento));
            areaJogo.appendChild(elemento);
        });

        // Inicia o cronômetro se necessário
        const config = Storage.obterConfiguracoes();
        if (config.temporizadorAtivado) {
            iniciarCronometro();
        }

        // Inicia áudio ambiente se modo calmo
        if (config.modoCalmo && config.somAtivado) {
            Audio.iniciarAmbiente();
        }

        // Navega para tela de jogo
        Navegacao.mostrarTela('tela-jogo');
        Accessibility.anunciar(`Jogo iniciado com ${dificuldade} pares. Encontre todos os pares.`);
    }

    /**
     * Lida com clique em uma carta
     * @param {HTMLElement} cartaElement - Elemento da carta
     */
    function lidarCliqueCarta(cartaElement) {
        if (estado.emVerificacao || estado.pausado) return;
        if (Cards.foiEncontrada(cartaElement)) return;
        if (Cards.estaVirada(cartaElement)) return;

        // Vira a carta
        Cards.virarCarta(cartaElement);
        Audio.tocarFeedback('virar');

        const cartaData = {
            id: parseInt(cartaElement.dataset.id),
            parId: parseInt(cartaElement.dataset.parId),
            elemento: cartaElement
        };

        estado.cartasViradas.push(cartaData);

        // Atualiza label para leitor de tela
        cartaElement.setAttribute('aria-label', `Carta virada, mostra ${estado.cartas.find(c => c.id === cartaData.id)?.simbolo || 'símbolo'}`);

        // Verifica se temos 2 cartas viradas
        if (estado.cartasViradas.length === 2) {
            verificarPar();
        }
    }

    /**
     * Verifica se as duas cartas viradas são um par
     */
    function verificarPar() {
        estado.emVerificacao = true;
        Accessibility.desabilitarCartas(areaJogo.querySelectorAll('.carta'));

        const [carta1, carta2] = estado.cartasViradas;

        if (carta1.parId === carta2.parId) {
            // Par encontrado!
            setTimeout(() => {
                Cards.marcarEncontrada(carta1.elemento);
                Cards.marcarEncontrada(carta2.elemento);
                Cards.adicionarFeedback(carta1.elemento);
                Cards.adicionarFeedback(carta2.elemento);
                Audio.tocarFeedback('acerto');

                estado.paresEncontrados++;
                atualizarInfoPares();

                Accessibility.anunciar(`Par encontrado! ${estado.paresEncontrados} de ${estado.totalPares} pares.`);

                estado.cartasViradas = [];
                estado.emVerificacao = false;
                Accessibility.habilitarCartas(areaJogo.querySelectorAll('.carta'));

                // Verifica vitória
                if (estado.paresEncontrados === estado.totalPares) {
                    Vitoria();
                }
            }, 500);
        } else {
            // Não é par
            setTimeout(() => {
                Cards.desvirarCarta(carta1.elemento);
                Cards.desvirarCarta(carta2.elemento);
                Accessibility.anunciar('Não é par. Tente novamente.');

                estado.cartasViradas = [];
                estado.emVerificacao = false;
                Accessibility.habilitarCartas(areaJogo.querySelectorAll('.carta'));
            }, 1000);
        }
    }

    /**
     * Atualiza a显示 de pares encontrados
     */
    function atualizarInfoPares() {
        elementosUI.infoPares.textContent = `Pares: ${estado.paresEncontrados}/${estado.totalPares}`;
    }

    /**
     * Lida com navegação por teclado nas cartas
     * @param {KeyboardEvent} e
     */
    function lidarTecladoCartas(e) {
        const cartas = areaJogo?.querySelectorAll('.carta');
        if (!cartas || cartas.length === 0) return;

        const cartaAtual = document.activeElement;
        if (!cartaAtual?.classList.contains('carta')) return;

        let cartaDestino = null;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                cartaDestino = Accessibility.navegarCartas('acima', cartas, cartaAtual);
                break;
            case 'ArrowDown':
                e.preventDefault();
                cartaDestino = Accessibility.navegarCartas('abaixo', cartas, cartaAtual);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                cartaDestino = Accessibility.navegarCartas('esquerda', cartas, cartaAtual);
                break;
            case 'ArrowRight':
                e.preventDefault();
                cartaDestino = Accessibility.navegarCartas('direita', cartas, cartaAtual);
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!Cards.estaVirada(cartaAtual) && !Cards.foiEncontrada(cartaAtual)) {
                    lidarCliqueCarta(cartaAtual);
                }
                return;
        }

        if (cartaDestino) {
            cartaDestino.focus();
        }
    }

    /**
     * Mostra mensagem de vitória
     */
    function Vitoria() {
        estado.tempoJogado = Math.floor((Date.now() - estado.inicioTempo) / 1000);

        // Salva sessão
        Storage.adicionarSessao({
            dificuldade: estado.totalPares,
            tema: estado.tema,
            paresEncontrados: estado.paresEncontrados,
            tempoJogado: estado.tempoJogado
        });

        // Atualiza UI de vitória
        elementosUI.infoVitoriaPares.textContent = `Você encontrou ${estado.paresEncontrados} pares!`;
        elementosUI.infoVitoriaTempo.textContent = `Tempo: ${formatarTempo(estado.tempoJogado)}`;

        // Toca som de vitória
        Audio.tocarVitoria();

        // Esconde modal de pausa se aberto
        fecharModalPausa();

        // Mostra tela de vitória
        Navegacao.mostrarTela('tela-vitoria');
        Accessibility.anunciar('Parabéns! Você encontrou todos os pares!');
    }

    /**
     * Formata segundos para mm:ss
     * @param {number} segundos
     * @returns {string}
     */
    function formatarTempo(segundos) {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Inicia o cronômetro
     */
    function iniciarCronometro() {
        // Implementação simples - não mostra tempo na UI por padrão
        // Pode ser expandida para mostrar no header se necessário
    }

    /**
     * Pausa o jogo
     */
    function pausarJogo() {
        if (estado.pausado) return;

        estado.pausado = true;
        estado.tempoJogado = Math.floor((Date.now() - estado.inicioTempo) / 1000);

        Audio.pausar();
        elementosUI.modalPausa.hidden = false;
        Accessibility.anunciar('Jogo pausado');
    }

    /**
     * Fecha o modal de pausa
     */
    function fecharModalPausa() {
        elementosUI.modalPausa.hidden = true;
    }

    /**
     * Continua o jogo
     */
    function continuarJogo() {
        estado.pausado = false;
        estado.inicioTempo = Date.now() - (estado.tempoJogado * 1000);

        Audio.retomar();
        fecharModalPausa();
        Accessibility.anunciar('Jogo continuando');
    }

    /**
     * Reinicia o jogo
     */
    function reiniciarJogo() {
        Audio.pararAmbiente();
        iniciarJogo(estado.totalPares, estado.tema, estado.tamanho);
    }

    /**
     * Salva o progresso e volta ao menu
     */
    function salvarESair() {
        Audio.pararAmbiente();
        Audio.pausar();

        // Salva sessão se jogou algo
        if (estado.paresEncontrados > 0 && estado.inicioTempo) {
            estado.tempoJogado = Math.floor((Date.now() - estado.inicioTempo) / 1000);
            Storage.adicionarSessao({
                dificuldade: estado.totalPares,
                tema: estado.tema,
                paresEncontrados: estado.paresEncontrados,
                tempoJogado: estado.tempoJogado
            });
        }

        limparIntervalos();
        Navegacao.mostrarTela('tela-inicial');
        Accessibility.anunciar('Voltando ao menu principal');
    }

    /**
     * Limpa todos os intervalos
     */
    function limparIntervalos() {
        estado.intervalos.forEach(id => clearInterval(id));
        estado.intervalos = [];
    }

    /**
     * Mostra o toast com mensagem
     * @param {string} mensagem
     */
    function mostrarToast(mensagem) {
        elementosUI.toastMensagem.textContent = mensagem;
        elementosUI.toast.hidden = false;
        elementosUI.toast.classList.add('mostrar');

        setTimeout(() => {
            elementosUI.toast.classList.remove('mostrar');
            setTimeout(() => {
                elementosUI.toast.hidden = true;
            }, 300);
        }, 2000);
    }

    return {
        init,
        iniciarJogo,
        pausarJogo,
        continuarJogo,
        reiniciarJogo
    };
})();
