/**
 * Jogo da Memória Acessível - Módulo de Acessibilidade
 * Gerencia recursos de acessibilidade e navegação por teclado
 */

const Accessibility = (function() {
    'use strict';

    let elementoFocado = null;
    let observer = null;

    /**
     * Inicializa os recursos de acessibilidade
     */
    function init() {
        aplicarPreferencias();
        configurarNavegacaoTeclado();
        configurarFocoTeclado();
        announciar = configurarAnnouncer();
    }

    let announciar = null;

    /**
     * Configura o announcer para leitores de tela
     */
    function configurarAnnouncer() {
        let announcer = document.getElementById('sr-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
        return announcer;
    }

    /**
     * Anuncia uma mensagem para leitores de tela
     * @param {string} mensagem - Mensagem para anunciar
     */
    function anunciar(mensagem) {
        if (announciar) {
            announciar.textContent = '';
            setTimeout(() => {
                announciar.textContent = mensagem;
            }, 100);
        }
    }

    /**
     * Aplica as preferências de acessibilidade do usuário
     */
    function aplicarPreferencias() {
        const config = Storage.obterConfiguracoes();

        // Escala da interface
        document.documentElement.setAttribute('data-escala', config.escalaInterface);

        // Reduzir movimento
        if (config.reduzirMovimento) {
            document.documentElement.style.setProperty('--transicao-suave', 'all 0.01s ease');
            document.documentElement.style.setProperty('--transicao-rapida', 'all 0.01s ease');
        }
    }

    /**
     * Atualiza a escala da interface
     * @param {number} escala - Escala em porcentagem (100-200)
     */
    function atualizarEscala(escala) {
        document.documentElement.setAttribute('data-escala', escala);
    }

    /**
     * Configura a navegação por teclado global
     */
    function configurarNavegacaoTeclado() {
        document.addEventListener('keydown', function(e) {
            // Só processa se não estamos em um campo de input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Tecla Escape para fechar modais ou pausar
            if (e.key === 'Escape') {
                const modal = document.getElementById('modal-pausa');
                if (modal && !modal.hidden) {
                    document.getElementById('btn-continuar').click();
                }
            }
        });
    }

    /**
     * Configura o foco visual para navegação por teclado
     */
    function configurarFocoTeclado() {
        document.addEventListener('mousedown', function(e) {
            // Remove a classe de foco teclado quando usa mouse
            document.body.classList.remove('navegacao-teclado');
        });

        document.addEventListener('keydown', function(e) {
            // Adiciona classe quando usa Tab para navegação
            if (e.key === 'Tab') {
                document.body.classList.add('navegacao-teclado');
            }
        });
    }

    /**
     * Move o foco para o próximo elemento focável
     * @param {HTMLElement} elementoInicial - Elemento inicial
     * @param {boolean} inverso - Se true, move para trás
     */
    function moverFoco(elementoInicial, inverso = false) {
        const focaveis = obtenerElementosFocaveis();
        const indiceAtual = focaveis.indexOf(elementoInicial);

        if (indiceAtual === -1) {
            if (focaveis.length > 0) {
                focaveis[0].focus();
            }
            return;
        }

        let proximoIndice;
        if (inverso) {
            proximoIndice = indiceAtual > 0 ? indiceAtual - 1 : focaveis.length - 1;
        } else {
            proximoIndice = indiceAtual < focaveis.length - 1 ? indiceAtual + 1 : 0;
        }

        focaveis[proximoIndice].focus();
    }

    /**
     * Obtém todos os elementos focáveis na página
     * @returns {NodeList} Elementos focáveis
     */
    function obtenerElementosFocaveis() {
        const seletor = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return document.querySelectorAll(seletor);
    }

    /**
     * Gerencia a carta selecionada por teclado
     * @param {string} direcao - 'acima', 'abaixo', 'esquerda', 'direita'
     * @param {NodeList} cartas - Lista de cartas no tabuleiro
     * @param {HTMLElement} cartaAtual - Carta atualmente selecionada
     */
    function navegarCartas(direcao, cartas, cartaAtual) {
        if (!cartas || cartas.length === 0) return null;

        const cartaIndex = Array.from(cartas).indexOf(cartaAtual);
        if (cartaIndex === -1) return cartas[0];

        const cartasPorLinha = window.innerWidth <= 400 ? 4 : 
                               window.innerWidth <= 600 ? 5 : 6;

        let novoIndex = cartaIndex;

        switch (direcao) {
            case 'acima':
                novoIndex = cartaIndex - cartasPorLinha;
                if (novoIndex < 0) novoIndex = cartaIndex;
                break;
            case 'abaixo':
                novoIndex = cartaIndex + cartasPorLinha;
                if (novoIndex >= cartas.length) novoIndex = cartaIndex;
                break;
            case 'esquerda':
                novoIndex = cartaIndex - 1;
                if (novoIndex < 0) novoIndex = cartas.length - 1;
                break;
            case 'direita':
                novoIndex = cartaIndex + 1;
                if (novoIndex >= cartas.length) novoIndex = 0;
                break;
        }

        return cartas[novoIndex];
    }

    /**
     * Desabilita todas as cartas durante a verificação de par
     * @param {NodeList} cartas - Lista de cartas
     */
    function desabilitarCartas(cartas) {
        cartas.forEach(carta => carta.classList.add('desabilitada'));
    }

    /**
     * Habilita todas as cartas
     * @param {NodeList} cartas - Lista de cartas
     */
    function habilitarCartas(cartas) {
        cartas.forEach(carta => carta.classList.remove('desabilitada'));
    }

    /**
     * Verifica se o usuário prefere contraste alto
     * @returns {boolean}
     */
    function prefereContrasteAlto() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }

    /**
     * Verifica se o usuário prefere movimento reduzido
     * @returns {boolean}
     */
    function prefereMovimentoReduzido() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return {
        init,
        anunciar,
        aplicarPreferencias,
        atualizarEscala,
        navegarCartas,
        desabilitarCartas,
        habilitarCartas,
        prefereContrasteAlto,
        prefereMovimentoReduzido
    };
})();
