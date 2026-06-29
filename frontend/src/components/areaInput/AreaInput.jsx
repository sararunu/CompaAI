import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import './AreaInput.css';
import { speak, startListening } from '../../utils/voice';

function AreaInput({ onSend, disabled, lastBotMessage }) {
    const [texto, setTexto] = useState('');
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    // const [iconPhase, setIconPhase] = useState(0); //alterna 0-1  ← YA NO SE USA (animación CSS)

    const inputRef = useRef(null); //referencia al input
    const recognitionRef = useRef(null);
    // const phaseTimerRef = useRef(null);  ← YA NO SE USA

    // Foco al montar Y tras cada render (incluye tras setTexto(''))
    // useLayoutEffect es síncrono, se ejecuta antes de pintar 
    useLayoutEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);  // se ejecuta al montar y cuando disabled cambia

    //hablar automáticamente el último mensaje del bot
    // useEffect(() => {
    //     if (lastBotMessage) speak(lastBotMessage);
    // }, [lastBotMessage]);
    useEffect(() => {
        if (!lastBotMessage) return;
        speak(lastBotMessage, 'es-ES', {
            onStart: () => setSpeaking(true),
            onEnd: () => { setSpeaking(false); /* setIconPhase(0); */ }
        });
    }, [lastBotMessage]);

    // Alternar iconos mientras habla (onda) ← AHORA ES PURAMENTE CSS
    // useEffect(() => {
    //     if (speaking) {
    //         phaseTimerRef.current = setInterval(() => setIconPhase(p => 1 - p), 300);
    //     } else {
    //         clearInterval(phaseTimerRef.current);
    //     }
    //     return () => clearInterval(phaseTimerRef.current);
    // }, [speaking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!texto.trim() || disabled) return;
        onSend(texto);
        setTexto('');
    };

    const toggleListen = () => {
        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }
        setListening(true);
        recognitionRef.current = startListening(
            (transcript) => {
                // setTexto(transcript); //lo muestra en el input
                setListening(false);
                onSend(transcript); //enviar mensaje automáticamente
            },
            (err) => {
                console.error('Error voz:', err);
                setListening(false);
            }
        );
    };

    const Icons = {
        idle: <i className="fa-solid fa-microphone" />,
        listening: <i className="fa-solid fa-microphone-slash" style={{ color: '#ff4444' }} />,
        wave1: <i className="fa-solid fa-volume-high"></i>,
    };

    return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                ref={inputRef}
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Escribir a Compa..."
                disabled={disabled || listening || speaking}
            />
            <button type="submit" disabled={disabled || !texto.trim()}>
                Enviar
            </button>

            <button
                type="button"
                onClick={toggleListen}
                disabled={disabled || speaking}
                className={`voice-btn ${listening ? 'listening' : ''} ${speaking ? 'speaking' : ''}`}
                aria-label={listening ? 'Parar escucha' : speaking ? 'Hablando...' : 'Hablar'}
            >
                {/* Estado idle / listening: icono único */}
                {!speaking && !listening && Icons.idle}
                {listening && Icons.listening}

                {/* Estado speaking: AMBOS iconos superpuestos para cross-fade */}
                {speaking && (
                    <span className="wave-pair">
                        <span className="wave-icon wave-1">{Icons.wave1}</span>
                    </span>
                )}
            </button>
        </form>
    );
}

export default AreaInput;