/**
 * Jogo da Memória Acessível - Script Principal
 * Inicializa a aplicação e gerencia navegação entre telas
 */

(function() {
    'use strict';

    // Estado atual da aplicação
    let telaAtual = 'tela-inicial';

    /**
     * Inicializa a aplicação
     */
    function init() {
        console.log('Inicializando Jogo da Memória Acessível...');

        // Inicializa módulos
        Accessibility.init();
        Audio.init();
        Jogo.init();

        // Carrega configurações salvas
        const config = Storage.obterConfiguracoes();
        aplicarConfiguracoes(config);

        // Configura event listeners
        configurarNavegacao();
        configurarTelaInicial();
        configurarTelaConfiguracoes();
        configurarTelaRegras();
        configurarTelaHistorico();

        // Mostra tela inicial
        mostrarTela('tela-inicial');

        console.log('Jogo inicializado com sucesso!');
    }

    /**
     * Aplica as configurações carregadas
     * @param {Object} config
     */
    function aplicarConfiguracoes(config) {
        // Escala da interface
        Accessibility.atualizarEscala(config.escalaInterface);

        // Tema, tamanho e dificuldade nos radios
        const temaRadio = document.querySelector(`input[name="tema"][value="${config.temaImagens}"]`);
        if (temaRadio) temaRadio.checked = true;

        const tamanhoRadio = document.querySelector(`input[name="tamanho"][value="${config.tamanhoCartas}"]`);
        if (tamanhoRadio) tamanhoRadio.checked = true;

        const dificuldadeRadio = document.querySelector(`input[name="dificuldade"][value="${config.dificuldade}"]`);
        if (dificuldadeRadio) dificuldadeRadio.checked = true;

        // Toggles
        document.getElementById('toggle-som').checked = config.somAtivado;
        document.getElementById('volume-som').value = config.volume;
        document.getElementById('valor-volume').textContent = `${config.volume}%`;
        document.getElementById('toggle-calmo').checked = config.modoCalmo;
        document.getElementById('toggle-temporizador').checked = config.temporizadorAtivado;
        document.getElementById('escala-interface').value = config.escalaInterface;
        document.getElementById('valor-escala').textContent = `${config.escalaInterface}%`;
        document.getElementById('toggle-reduzir-movimento').checked = config.reduzirMovimento;

        // Mostra/oculta controle de volume baseado no toggle de som
        const controleVolume = document.getElementById('controle-volume');
        if (controleVolume) {
            controleVolume.style.display = config.somAtivado ? 'flex' : 'none';
        }

        // Atualiza módulos de áudio
        Audio.setSomAtivado(config.somAtivado);
        Audio.setVolume(config.volume / 100);
        Audio.setModoCalmo(config.modoCalmo);
    }

    /**
     * Configura a navegação entre telas
     */
    function configurarNavegacao() {
        // Configurações rápidas do header de jogo
        document.getElementById('btn-config-jogo')?.addEventListener('click', () => {
            mostrarTela('tela-configuracoes');
        });
    }

    /**
     * Configura event listeners da tela inicial
     */
    function configurarTelaInicial() {
        document.getElementById('btn-jogar')?.addEventListener('click', () => {
            const config = Storage.obterConfiguracoes();
            Jogo.iniciarJogo(config.dificuldade, config.temaImagens, config.tamanhoCartas);
        });

        document.getElementById('btn-configuracoes')?.addEventListener('click', () => {
            mostrarTela('tela-configuracoes');
        });

        document.getElementById('btn-regras')?.addEventListener('click', () => {
            mostrarTela('tela-regras');
        });

        document.getElementById('btn-historico')?.addEventListener('click', () => {
            atualizarHistorico();
            mostrarTela('tela-historico');
        });
    }

    /**
     * Configura event listeners da tela de configurações
     */
    function configurarTelaConfiguracoes() {
        // Toggle de som mostra/oculta controle de volume
        document.getElementById('toggle-som')?.addEventListener('change', (e) => {
            const controleVolume = document.getElementById('controle-volume');
            if (controleVolume) {
                controleVolume.style.display = e.target.checked ? 'flex' : 'none';
            }
        });

        // Slider de volume
        document.getElementById('volume-som')?.addEventListener('input', (e) => {
            document.getElementById('valor-volume').textContent = `${e.target.value}%`;
        });

        // Slider de escala
        document.getElementById('escala-interface')?.addEventListener('input', (e) => {
            document.getElementById('valor-escala').textContent = `${e.target.value}%`;
            Accessibility.atualizarEscala(parseInt(e.target.value));
        });

        // Botão voltar
        document.getElementById('btn-voltar-config')?.addEventListener('click', () => {
            mostrarTela('tela-inicial');
        });

        // Botão salvar
        document.getElementById('btn-salvar-config')?.addEventListener('click', salvarConfiguracoes);
    }

    /**
     * Salva as configurações do formulário
     */
    function salvarConfiguracoes() {
        const form = document.getElementById('form-configuracoes');
        if (!form) return;

        const formData = new FormData(form);

        const config = {
            temaImagens: formData.get('tema'),
            tamanhoCartas: formData.get('tamanho'),
            dificuldade: parseInt(formData.get('dificuldade')),
            somAtivado: document.getElementById('toggle-som').checked,
            volume: parseInt(document.getElementById('volume-som').value),
            modoCalmo: document.getElementById('toggle-calmo').checked,
            temporizadorAtivado: document.getElementById('toggle-temporizador').checked,
            escalaInterface: parseInt(document.getElementById('escala-interface').value),
            reduzirMovimento: document.getElementById('toggle-reduzir-movimento').checked
        };

        Storage.salvarConfiguracoes(config);

        // Atualiza módulos
        Audio.setSomAtivado(config.somAtivado);
        Audio.setVolume(config.volume / 100);
        Audio.setModoCalmo(config.modoCalmo);
        Accessibility.aplicarPreferencias();

        mostrarToast('Configurações salvas!');
        Accessibility.anunciar('Configurações salvas com sucesso');

        setTimeout(() => {
            mostrarTela('tela-inicial');
        }, 500);
    }

    /**
     * Configura event listeners da tela de regras
     */
    function configurarTelaRegras() {
        document.getElementById('btn-voltar-regras')?.addEventListener('click', () => {
            mostrarTela('tela-inicial');
        });

        document.getElementById('btn-entendi')?.addEventListener('click', () => {
            mostrarTela('tela-inicial');
        });
    }

    /**
     * Configura event listeners da tela de histórico
     */
    function configurarTelaHistorico() {
        document.getElementById('btn-voltar-historico')?.addEventListener('click', () => {
            mostrarTela('tela-inicial');
        });

        document.getElementById('btn-limpar-historico')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
                Storage.limparHistorico();
                atualizarHistorico();
                mostrarToast('Histórico limpo');
                Accessibility.anunciar('Histórico limpo');
            }
        });

        document.getElementById('btn-voltar-menu-historico')?.addEventListener('click', () => {
            mostrarTela('tela-inicial');
        });
    }

    /**
     * Atualiza o conteúdo do histórico
     */
    function atualizarHistorico() {
        const container = document.getElementById('historico-conteudo');
        if (!container) return;

        const historico = Storage.obterHistorico();

        if (historico.sessoes.length === 0) {
            container.innerHTML = `
                <div class="historico-vazio">
                    <p>Nenhuma sessão registrada ainda.</p>
                    <p>Jogue algumas partidas para ver seu progresso aqui!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = historico.sessoes.map(sessao => `
            <div class="sessao-item">
                <div class="sessao-info">
                    <div class="sessao-data">${Storage.formatarData(sessao.data)}</div>
                    <div class="sessao-detalhes">${sessao.dificuldade} pares - Tema: ${sessao.tema}</div>
                </div>
                <span class="sessao-badge">${sessao.paresEncontrados}/${sessao.dificuldade} pares</span>
            </div>
        `).join('');
    }

    /**
     * Mostra uma tela específica
     * @param {string} idTela - ID da tela a mostrar
     */
    function mostrarTela(idTela) {
        // Esconde todas as telas
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativa');
            tela.hidden = true;
        });

        // Mostra a tela selecionada
        const tela = document.getElementById(idTela);
        if (tela) {
            tela.classList.add('ativa');
            tela.hidden = false;

            // Foco no primeiro elemento interactivo
            const primeiroBotao = tela.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (primeiroBotao) {
                setTimeout(() => primeiroBotao.focus(), 100);
            }
        }

        telaAtual = idTela;
    }

    /**
     * Mostra toast temporário
     * @param {string} mensagem
     */
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        const toastMensagem = document.getElementById('toast-mensagem');

        if (toast && toastMensagem) {
            toastMensagem.textContent = mensagem;
            toast.hidden = false;
            toast.classList.add('mostrar');

            setTimeout(() => {
                toast.classList.remove('mostrar');
                setTimeout(() => {
                    toast.hidden = true;
                }, 300);
            }, 2000);
        }
    }

    // Disponibiliza função de navegação globalmente para outros módulos
    window.Navegacao = {
        mostrarTela
    };

    // Inicializa quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
