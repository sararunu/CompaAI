import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { speak, startListening } from '../../utils/voice';
import './AreaInput.css';

function AreaInput({ onSend, disabled, lastBotMessage, onSpeakingChange, mood }) {
  const [texto, setTexto] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const moodRef = useRef(mood);

  // actualizar ref cuando mood cambia
  useEffect(() => { moodRef.current = mood; }, [mood]);

  // autofoco
  useLayoutEffect(() => { if (!disabled) inputRef.current?.focus(); }, [disabled]);

  //hablar automáticamente ---lastBotMessage como trigger
  useEffect(() => {
    if (!lastBotMessage) return;
    speak(lastBotMessage, 'es-ES', {
      onStart: () => onSpeakingChange(true),
      onEnd: () => onSpeakingChange(false),
      mood: moodRef.current,
    });
  }, [lastBotMessage, onSpeakingChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim() || disabled) return;
    onSend(texto);
    setTexto('');
  };

  const toggleListen = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    // si el user habla, parar el tts
    window.speechSynthesis.cancel();
    onSpeakingChange(false);
    setListening(true);
    recognitionRef.current = startListening(
      (t) => { setTexto(t); setListening(false); onSend(t); setTexto(''); },
      () => setListening(false)
    );
  };

  const Icons = {
    idle: <i className="fa-solid fa-microphone" />,
    listening: <i className="fa-solid fa-microphone-slash" style={{ color: '#ff4444' }} />
  };

  let btnIcon = Icons.idle;
  let btnClass = 'voice-btn';
  if (listening) { btnIcon = Icons.listening; btnClass += ' listening'; }

  return (
    <form onSubmit={handleSubmit} className="input-area">
      <input ref={inputRef} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribir a Compa..." disabled={disabled || listening} />
      <button type="submit" disabled={disabled || !texto.trim()}>Enviar</button>
      <button type="button" onClick={toggleListen} disabled={disabled} className={btnClass} aria-label={listening ? 'Parar escucha' : 'Hablar'}>
        {btnIcon}
      </button>
    </form>
  );
}

export default AreaInput;