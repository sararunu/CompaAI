import useChat from './hooks/useChat';
import AreaChat from './components/areaChat/AreaChat';
import AreaInput from './components/areaInput/AreaInput';
import Lightfall from './components/lightfall/Lightfall';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const { enviarMensajeHandler: enviar, loading, clear } = useChat();
  const [mensajes, setMensajes] = useState([]);

  // Cargar historial al montar
  useEffect(() => {
    fetch('http://localhost:4000/api/chat/history')
      .then(r => r.json())
      .then(data => setMensajes(data));
  }, []);

  // Enviar mensaje y actualizar UI local
  const enviarMensajeHandler = async (texto) => {
    const userMsg = { role: 'user', content: texto };
    setMensajes(prev => [...prev, userMsg]);
    const reply = await enviar(texto);
    setMensajes(prev => [...prev, { role: 'assistant', content: reply }]);
  };

  const handleClear = async () => {
    await clear();
    setMensajes([]);  // limpia UI local
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
            onClick={handleClear}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Limpiar chat
          </button></header>
        <AreaChat mensajes={mensajes} loading={loading} />
        <AreaInput onSend={enviarMensajeHandler} disabled={loading} />
      </div>
    </div>
  );
}

export default App;