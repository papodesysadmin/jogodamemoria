/**
 * Jogo da Memória Acessível - Módulo de Áudio
 * Gerencia sons do jogo com Web Audio API
 */

const Audio = (function() {
    'use strict';

    let contextoAudio = null;
    let gainNode = null;
    let somAtivado = false;
    let volume = 0.5;
    let modoCalmo = false;
    let somAmbienteNodes = [];

    /**
     * Inicializa o sistema de áudio
     */
    function init() {
        const config = Storage.obterConfiguracoes();
        somAtivado = config.somAtivado;
        volume = config.volume / 100;
        modoCalmo = config.modoCalmo;

        // Tenta retomar contexto em qualquer clique no documento para contornar política de autoplay
        document.addEventListener('click', () => {
            if (contextoAudio && contextoAudio.state === 'suspended') {
                contextoAudio.resume();
            }
        }, { once: true });
    }

    /**
     * Cria o contexto de áudio na primeira interação
     */
    function criarContextoSeNecessario() {
        if (contextoAudio) return;

        try {
            contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = contextoAudio.createGain();
            gainNode.connect(contextoAudio.destination);
            gainNode.gain.value = volume;
        } catch (e) {
            console.warn('Web Audio API não suportada:', e);
        }
    }

    /**
     * Reproduz um tom suave para feedback
     * @param {string} tipo - 'acerto' ou 'virar'
     */
    function tocarFeedback(tipo) {
        if (!somAtivado) return;

        criarContextoSeNecessario();
        if (!contextoAudio) return;

        try {
            const oscilador = contextoAudio.createOscillator();
            const gainTemp = contextoAudio.createGain();

            oscilador.connect(gainTemp);
            gainTemp.connect(gainNode);

            if (tipo === 'acerto') {
                // Tom mais alto e pleasant para acerto
                oscilador.frequency.value = 523.25; // C5
                oscilador.type = 'sine';
                gainTemp.gain.value = 0.3;
            } else {
                // Som suave para virar carta
                oscilador.frequency.value = 392.00; // G4
                oscilador.type = 'sine';
                gainTemp.gain.value = 0.15;
            }

            oscilador.start();
            gainTemp.gain.exponentialRampToValueAtTime(0.01, contextoAudio.currentTime + 0.3);
            oscilador.stop(contextoAudio.currentTime + 0.3);
        } catch (e) {
            console.warn('Erro ao tocar som:', e);
        }
    }

    /**
     * Toca som de vitória
     */
    function tocarVitoria() {
        if (!somAtivado) return;

        criarContextoSeNecessario();
        if (!contextoAudio) return;

        try {
            const notas = [523.25, 659.25, 783.99]; // C5, E5, G5 - acorde maior
            notas.forEach((freq, i) => {
                const osc = contextoAudio.createOscillator();
                const gain = contextoAudio.createGain();

                osc.connect(gain);
                gain.connect(gainNode);

                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.value = 0.2;

                osc.start(contextoAudio.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, contextoAudio.currentTime + i * 0.15 + 0.5);
                osc.stop(contextoAudio.currentTime + i * 0.15 + 0.5);
            });
        } catch (e) {
            console.warn('Erro ao tocar vitória:', e);
        }
    }

    /**
     * Inicia o som ambiente no modo calmo (Acordes suaves e baixa frequência)
     */
    function iniciarAmbiente() {
        if (!modoCalmo || !somAtivado) return;

        criarContextoSeNecessario();
        if (!contextoAudio) return;

        if (contextoAudio.state === 'suspended') {
            contextoAudio.resume();
        }

        pararAmbiente();

        try {
            // Criamos um acorde suave de frequências baixas (A2, E3, A3)
            const frequencias = [110, 164.81, 220]; 
            
            frequencias.forEach(freq => {
                const osc = contextoAudio.createOscillator();
                const g = contextoAudio.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // Volume muito baixo para ser apenas um fundo relaxante
                g.gain.value = 0.02; 
                
                osc.connect(g);
                g.connect(gainNode);
                
                osc.start();
                somAmbienteNodes.push({ osc, g });
            });

            // Adiciona um leve ruído marrom (mais suave que o branco) para textura calmante
            const bufferSize = 2 * contextoAudio.sampleRate;
            const noiseBuffer = contextoAudio.createBuffer(1, bufferSize, contextoAudio.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Ajuste de ganho para o ruído marrom
            }

            const noise = contextoAudio.createBufferSource();
            noise.buffer = noiseBuffer;
            noise.loop = true;
            const noiseGain = contextoAudio.createGain();
            noiseGain.gain.value = 0.01; // Quase imperceptível

            noise.connect(noiseGain);
            noiseGain.connect(gainNode);
            noise.start();
            somAmbienteNodes.push({ source: noise, g: noiseGain });

        } catch (e) {
            console.warn('Erro ao iniciar ambiente:', e);
        }
    }

    /**
     * Para o som ambiente suavemente
     */
    function pararAmbiente() {
        somAmbienteNodes.forEach(node => {
            try {
                if (node.g) {
                    node.g.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.5);
                }
                setTimeout(() => {
                    if (node.osc) node.osc.stop();
                    if (node.source) node.source.stop();
                }, 500);
            } catch (e) {
                // Ignora erros ao parar
            }
        });
        somAmbienteNodes = [];
    }

    /**
     * Define se o som está ativado
     * @param {boolean} ativo
     */
    function setSomAtivado(ativo) {
        somAtivado = ativo;
        if (!ativo) {
            pararAmbiente();
        }
    }

    /**
     * Define o volume
     * @param {number} vol - Volume de 0 a 1
     */
    function setVolume(vol) {
        volume = Math.max(0, Math.min(1, vol));
        if (gainNode) {
            gainNode.gain.value = volume;
        }
    }

    /**
     * Define se está em modo calmo
     * @param {boolean} calmo
     */
    function setModoCalmo(calmo) {
        modoCalmo = calmo;
        if (!calmo) {
            pararAmbiente();
        }
    }

    /**
     * Pausa todos os sons
     */
    function pausar() {
        if (contextoAudio && contextoAudio.state === 'running') {
            contextoAudio.suspend();
        }
        pararAmbiente();
    }

    /**
     * Retoma todos os sons
     */
    function retomar() {
        if (contextoAudio && contextoAudio.state === 'suspended') {
            contextoAudio.resume();
        }
        if (modoCalmo && somAtivado) {
            iniciarAmbiente();
        }
    }

    return {
        init,
        tocarFeedback,
        tocarVitoria,
        iniciarAmbiente,
        pararAmbiente,
        setSomAtivado,
        setVolume,
        setModoCalmo,
        pausar,
        retomar
    };
})();
