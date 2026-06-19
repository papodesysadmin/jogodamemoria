/**
 * Jogo da Memória Acessível - Módulo de Gerenciamento de Cartas
 * Define os símbolos e gera o tabuleiro
 */

const Cards = (function() {
    'use strict';

    // Símbolos por tema - usando emojis universais e claros
    const simbolos = {
        animais: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🐷', '🐮', '🐵'],
        objetos: ['📚', '✏️', '🎨', '🏀', '🎮', '🎧', '📱', '⌨️', '🖱️', '📺', '🧸', '🎁'],
        natureza: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌲', '🌴', '🌈', '☀️', '🌙', '⭐']
    };

    /**
     * Obtém os símbolos de um tema específico
     * @param {string} tema - Nome do tema
     * @param {number} quantidade - Número de pares necessários
     * @returns {Array} Array de símbolos para os pares
     */
    function obterSimbolos(tema, quantidade) {
        const temaSimbolos = simbolos[tema] || simbolos.animais;
        return temaSimbolos.slice(0, quantidade);
    }

    /**
     * Embaralha um array usando Fisher-Yates
     * @param {Array} array - Array a ser embaralhado
     * @returns {Array} Array embaralhado
     */
    function embaralhar(array) {
        const novo = [...array];
        for (let i = novo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [novo[i], novo[j]] = [novo[j], novo[i]];
        }
        return novo;
    }

    /**
     * Gera as cartas para uma partida
     * @param {number} numeroPares - Número de pares
     * @param {string} tema - Tema das imagens
     * @returns {Array} Array de cartas com id, simbolo e parId
     */
    function gerarCartas(numeroPares, tema) {
        const simbolosEscolhidos = obterSimbolos(tema, numeroPares);
        const cartas = [];

        simbolosEscolhidos.forEach((simbolo, indice) => {
            // Adiciona par (duas cartas com mesmo símbolo)
            cartas.push({
                id: indice * 2,
                simbolo: simbolo,
                parId: indice
            });
            cartas.push({
                id: indice * 2 + 1,
                simbolo: simbolo,
                parId: indice
            });
        });

        return embaralhar(cartas);
    }

    /**
     * Cria o elemento HTML de uma carta
     * @param {Object} carta - Dados da carta
     * @param {number} index - Índice na grid
     * @returns {HTMLElement} Elemento da carta
     */
    function criarElementoCarta(carta, index) {
        const elemento = document.createElement('div');
        elemento.className = 'carta medio';
        elemento.setAttribute('role', 'button');
        elemento.setAttribute('tabindex', '0');
        elemento.setAttribute('aria-label', `Carta ${index + 1}, virada para baixo`);
        elemento.dataset.id = carta.id;
        elemento.dataset.parId = carta.parId;
        elemento.dataset.index = index;

        elemento.innerHTML = `
            <div class="carta-inner">
                <div class="carta-face carta-costas" aria-hidden="true"></div>
                <div class="carta-face carta-frente" aria-hidden="true">${carta.simbolo}</div>
            </div>
        `;

        return elemento;
    }

    /**
     * Atualiza o tamanho das cartas
     * @param {NodeList} cartas - Lista de cartas
     * @param {string} tamanho - 'pequeno', 'medio' ou 'grande'
     */
    function atualizarTamanho(cartas, tamanho) {
        cartas.forEach(carta => {
            carta.classList.remove('pequeno', 'medio', 'grande');
            carta.classList.add(tamanho);
        });
    }

    /**
     * Marca uma carta como encontrada
     * @param {HTMLElement} carta - Elemento da carta
     */
    function marcarEncontrada(carta) {
        carta.classList.add('encontrada');
    }

    /**
     * Remove a marcação de encontrada
     * @param {HTMLElement} carta - Elemento da carta
     */
    function desmarcarEncontrada(carta) {
        carta.classList.remove('encontrada');
    }

    /**
     * Adiciona feedback visual suave
     * @param {HTMLElement} carta - Elemento da carta
     */
    function adicionarFeedback(carta) {
        carta.classList.add('feedback');
        setTimeout(() => {
            carta.classList.remove('feedback');
        }, 500);
    }

    /**
     * Vira uma carta
     * @param {HTMLElement} carta - Elemento da carta
     */
    function virarCarta(carta) {
        carta.classList.add('virada');
        const frente = carta.querySelector('.carta-frente');
        if (frente) {
            frente.setAttribute('aria-hidden', 'false');
        }
        const costas = carta.querySelector('.carta-costas');
        if (costas) {
            costas.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Desvira uma carta
     * @param {HTMLElement} carta - Elemento da carta
     */
    function desvirarCarta(carta) {
        carta.classList.remove('virada');
        const frente = carta.querySelector('.carta-frente');
        if (frente) {
            frente.setAttribute('aria-hidden', 'true');
        }
        const costas = carta.querySelector('.carta-costas');
        if (costas) {
            costas.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Verifica se uma carta está virada
     * @param {HTMLElement} carta - Elemento da carta
     * @returns {boolean}
     */
    function estaVirada(carta) {
        return carta.classList.contains('virada');
    }

    /**
     * Verifica se uma carta foi encontrada
     * @param {HTMLElement} carta - Elemento da carta
     * @returns {boolean}
     */
    function foiEncontrada(carta) {
        return carta.classList.contains('encontrada');
    }

    return {
        obterSimbolos,
        embaralhar,
        gerarCartas,
        criarElementoCarta,
        atualizarTamanho,
        marcarEncontrada,
        desmarcarEncontrada,
        adicionarFeedback,
        virarCarta,
        desvirarCarta,
        estaVirada,
        foiEncontrada
    };
})();
