import { useState, useEffect } from 'react';
import useChat from './hooks/useChat';
import AreaChat from './components/areaChat/AreaChat';
import AreaInput from './components/areaInput/AreaInput';
import Avatar from './components/Avatar/Avatar';
import Lightfall from './components/lightfall/Lightfall';
import { analyzeMood } from './utils/mood';
import './App.css';

function App() {
  const { enviarMensajeHandler: enviar, loading, clear } = useChat();
  const [mensajes, setMensajes] = useState([]);
  const [lastBotMessage, setLastBotMessage] = useState('');
  const [mood, setMood] = useState('neutral');
  const [speaking, setSpeaking] = useState(false);

  // Cargar voces al inicio
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

  // Cargar historial
  useEffect(() => {
    fetch('http://localhost:4000/api/chat/history')
      .then(r => r.json())
      .then(data => setMensajes(data));
  }, []);

  const handleSend = async (texto) => {
    // Para la IA si está hablando
    speechSynthesis.cancel();
    setSpeaking(false);
    
    setMood('thinking');
    const userMsg = { role: 'user', content: texto };
    setMensajes(prev => [...prev, userMsg]);
    const reply = await enviar(texto);
    setMensajes(prev => [...prev, { role: 'assistant', content: reply }]);
    setLastBotMessage(reply);
    setMood(analyzeMood(reply));
  };

  const handleClear = async () => {
    await clear();
    setMensajes([]);
  };

  return (
    <div className="app-wrapper">
      <div className="app-background">
        <Lightfall
          style={{ width: '100%', height: '100%' }}
          colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
          backgroundColor="#314de2"
          speed={0.1}
          streakCount={2}
          streakWidth={0.7}
          streakLength={1}
          glow={0.3}
          density={0.6}
          twinkle={0.15}
          zoom={3.4}
          backgroundGlow={0.2}
          opacity={1}
          mouseInteraction
          mouseStrength={0.3}
          mouseRadius={0.25}
        />
      </div>

      <div className="app-content">
        <header>
          <h1>Compa</h1>
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que quieres borrar todo el historial?')) {
                handleClear();
              }
            }}
            disabled={loading || mensajes.length === 0}
            style={{
              color: 'white',
              background: (loading || mensajes.length === 0) ? '#5e5c5c' : 'rgba(218, 8, 8, 0.72)',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              marginTop: '1rem',
              cursor: (loading || mensajes.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>

          {/* Avatar centrado en el medio */}
          <div className="avatar-centered">
            <Avatar
              speaking={speaking}
              thinking={loading}
              listening={false}
              mood={mood}
            />
          </div>
        </header>

        <div className="chat-area-wrapper">
          <AreaChat mensajes={mensajes} loading={loading} />
        </div>

        <AreaInput
          onSend={handleSend}
          disabled={loading}
          lastBotMessage={lastBotMessage}
          onSpeakingChange={setSpeaking}
          mood={mood}
        />
      </div>
    </div >
  );
}

export default App;