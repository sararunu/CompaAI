import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { speak, startListening } from '../../utils/voice';
import useVoiceCall from '../../hooks/useVoiceCall';
import './AreaInput.css';

function AreaInput({ onSend, disabled, lastBotMessage, speaking, onSpeakingChange, mood, onClearHistory, clearDisabled }) {
  const [texto, setTexto] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const moodRef = useRef(mood);

  const { active: callActive, toggleCall } = useVoiceCall({
    onUserMessage: (text) => onSend(text),
    isSpeaking: speaking,
    lastBotMessage: lastBotMessage?.text,
  });

  useEffect(() => { moodRef.current = mood; }, [mood]);

  useLayoutEffect(() => { if (!disabled) inputRef.current?.focus(); }, [disabled]);

  useEffect(() => {
    if (!lastBotMessage) return;
    speak(lastBotMessage.text, 'es-ES', {
      onStart: () => onSpeakingChange(true),
      onEnd: () => onSpeakingChange(false),
      mood: moodRef.current,
    });
  }, [lastBotMessage?.id, onSpeakingChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim() || disabled) return;
    onSend(texto);
    setTexto('');
  };

  const toggleListen = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    window.speechSynthesis.cancel();
    onSpeakingChange(false);
    setListening(true);
    recognitionRef.current = startListening(
      (t) => { setTexto(t); setListening(false); onSend(t); setTexto(''); },
      () => setListening(false)
    );
  };

  const handleClearClick = () => {
    if (window.confirm('¿Seguro que quieres borrar todo el historial?')) {
      onClearHistory();
    }
  };

  const Icons = {
    idle: <i className="fa-solid fa-microphone" />,
    listening: <i className="fa-solid fa-microphone-slash" style={{ color: '#ff4444' }} />,
  };

  let btnIcon = Icons.idle;
  let btnClass = 'voice-btn';
  if (listening) { btnIcon = Icons.listening; btnClass += ' listening'; }

  return (
    <form onSubmit={handleSubmit} className="input-area">
      <button
        type="button"
        onClick={handleClearClick}
        disabled={clearDisabled}
        className="voice-btn clear-btn"
        aria-label="Borrar historial"
      >
        <i className="fa-solid fa-trash"></i>
      </button>

      <input ref={inputRef} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribir a Compa..." disabled={disabled || listening} />
      <button type="submit" disabled={disabled || !texto.trim()}>Enviar</button>
      <button type="button" onClick={toggleListen} disabled={disabled} className={btnClass} aria-label={listening ? 'Parar escucha' : 'Hablar'}>
        {btnIcon}
      </button>
      <button type="button" onClick={toggleCall} disabled={disabled} className={`voice-btn call-btn ${callActive ? 'active' : ''}`} aria-label={callActive ? 'Colgar llamada' : 'Iniciar llamada'}>
        {callActive ? <i className="fa-solid fa-phone-slash" style={{ color: '#ffffff' }} /> : <i className="fa-solid fa-phone"></i>}
      </button>
    </form>
  );
}

export default AreaInput;