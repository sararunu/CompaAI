import { useRef, useState, useEffect, useCallback } from 'react';

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[-¿?¡!.,:;"'…]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function wordSet(text) {
    return new Set(normalize(text).split(' ').filter(w => w.length > 2));
}

// % de palabras del transcript que también aparecen en la respuesta del bot
function isEcho(transcript, botReply, threshold = 0.6) {
    if (!botReply) return false;
    const tWords = wordSet(transcript);
    const bWords = wordSet(botReply);
    if (tWords.size === 0) return false;

    let matches = 0;
    for (const w of tWords) {
        if (bWords.has(w)) matches++;
    }

    return matches / tWords.size >= threshold;
}

// hook solo se encarga del micrófono. No hace fetch ni TTS:
// eso ya lo maneja App.jsx + el efecto speak() de AreaInput.jsx.
export function useVoiceCall({ onUserMessage, isSpeaking, lastBotMessage }) {
    const [active, setActive] = useState(false);
    const recognitionRef = useRef(null);
    const activeRef = useRef(false);
    const isSpeakingRef = useRef(false);
    const lastBotMessageRef = useRef('');

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    useEffect(() => {
        lastBotMessageRef.current = lastBotMessage;
    }, [lastBotMessage]);

    // reacciona a cuando la IA empieza/termina de hablar (estado externo, vía speak())
    useEffect(() => {
        isSpeakingRef.current = isSpeaking;

        if (!activeRef.current) return;

        if (isSpeaking) {
            recognitionRef.current?.stop(); // apaga el micro para no escucharse a sí misma
        } else {
            const t = setTimeout(() => {
                if (recognitionRef.current && activeRef.current) {
                    try { recognitionRef.current.start(); } catch (e) {
                        console.error('Error restarting recognition:', e);
                    }
                }
            }, 100); // espera un poco para que la IA termine de hablar y no se corte
            return () => clearTimeout(t);
        }
    }, [isSpeaking]);

    const cleanupRecognition = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch (e) {
                console.error('Error stopping recognition:', e);
            }
            recognitionRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanupRecognition();
        };
    }, [cleanupRecognition]);

    const createRecognition = useCallback(() => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return null;

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            if (isSpeakingRef.current) return;

            const transcript = event.results[0][0].transcript.trim();
            if (!transcript) return;
            if (isEcho(transcript, lastBotMessageRef.current)) return; // descarta eco

            onUserMessage?.(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setTimeout(() => {
                if (recognitionRef.current && activeRef.current && !isSpeakingRef.current) {
                    try { recognitionRef.current.start(); } catch (e) {
                        console.error('Error restarting recognition after end:', e);
                    }
                }
            }, 300); // espera un poco antes de reiniciar para evitar que se corte la IA al hablar
        };

        return recognition;
    }, [onUserMessage]);

    const stopCall = useCallback(() => {
        cleanupRecognition();
        setActive(false);
    }, [cleanupRecognition]);

    const toggleCall = useCallback(() => {
        if (active) {
            stopCall();
            return;
        }

        const recognition = createRecognition();
        if (!recognition) return;

        recognitionRef.current = recognition;
        setActive(true);
        recognition.start();
    }, [active, createRecognition, stopCall]);

    return { active, toggleCall, stopCall };
}

export default useVoiceCall;