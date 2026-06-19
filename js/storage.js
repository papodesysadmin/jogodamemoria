/**
 * Jogo da Memória Acessível - Módulo de Persistência Local
 * Gerencia configurações e histórico de sessões no LocalStorage
 */

const Storage = (function() {
    'use strict';

    const CHAVE_CONFIGURACOES = 'jogoMemoria_configuracoes';
    const CHAVE_HISTORICO = 'jogoMemoria_historico';

    // Configurações padrão
    const configuracoesDefault = {
        temaImagens: 'animais',
        tamanhoCartas: 'medio',
        dificuldade: 8,
        somAtivado: false,
        volume: 50,
        modoCalmo: false,
        temporizadorAtivado: false,
        escalaInterface: 100,
        reduzirMovimento: false
    };

    /**
     * Obtém as configurações salvas ou as padrão
     * @returns {Object} Configurações do usuário
     */
    function obterConfiguracoes() {
        try {
            const salvas = localStorage.getItem(CHAVE_CONFIGURACOES);
            if (salvas) {
                const parsed = JSON.parse(salvas);
                return { ...configuracoesDefault, ...parsed };
            }
        } catch (e) {
            console.warn('Erro ao carregar configurações:', e);
        }
        return { ...configuracoesDefault };
    }

    /**
     * Salva as configurações no LocalStorage
     * @param {Object} config - Configurações a salvar
     */
    function salvarConfiguracoes(config) {
        try {
            localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(config));
        } catch (e) {
            console.warn('Erro ao salvar configurações:', e);
        }
    }

    /**
     * Atualiza apenas algumas configurações
     * @param {Object} parcial - Configurações parciais a atualizar
     */
    function atualizarConfiguracoes(parcial) {
        const atual = obterConfiguracoes();
        salvarConfiguracoes({ ...atual, ...parcial });
    }

    /**
     * Obtém o histórico de sessões
     * @returns {Object} Histórico com array de sessões
     */
    function obterHistorico() {
        try {
            const salvas = localStorage.getItem(CHAVE_HISTORICO);
            if (salvas) {
                return JSON.parse(salvas);
            }
        } catch (e) {
            console.warn('Erro ao carregar histórico:', e);
        }
        return { sessoes: [] };
    }

    /**
     * Adiciona uma nova sessão ao histórico
     * @param {Object} sessao - Dados da sessão
     */
    function adicionarSessao(sessao) {
        try {
            const historico = obterHistorico();
            historico.sessoes.unshift({
                data: new Date().toISOString(),
                dificuldade: sessao.dificuldade,
                tema: sessao.tema,
                paresEncontrados: sessao.paresEncontrados,
                tempoJogado: sessao.tempoJogado
            });

            // Limita a 50 sessões
            if (historico.sessoes.length > 50) {
                historico.sessoes = historico.sessoes.slice(0, 50);
            }

            localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
        } catch (e) {
            console.warn('Erro ao salvar sessão:', e);
        }
    }

    /**
     * Limpa todo o histórico
     */
    function limparHistorico() {
        try {
            localStorage.removeItem(CHAVE_HISTORICO);
        } catch (e) {
            console.warn('Erro ao limpar histórico:', e);
        }
    }

    /**
     * Formata a data para exibição
     * @param {string} isoString - Data ISO
     * @returns {string} Data formatada
     */
    function formatarData(isoString) {
        const data = new Date(isoString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return {
        obterConfiguracoes,
        salvarConfiguracoes,
        atualizarConfiguracoes,
        obterHistorico,
        adicionarSessao,
        limparHistorico,
        formatarData
    };
})();
