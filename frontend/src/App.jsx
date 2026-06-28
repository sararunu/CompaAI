import useChat from './hooks/useChat';
import AreaChat from './components/areaChat/AreaChat';
import AreaInput from './components/areaInput/AreaInput';
import Lightfall from './components/lightfall/Lightfall';
import './App.css';

function App() {
  const { mensajes, enviarMensajeHandler: send, loading } = useChat();

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
        <header><h1>Compa</h1></header>
        <AreaChat mensajes={mensajes} loading={loading} />
        <AreaInput onSend={send} disabled={loading} />
      </div>
    </div>
  );
}

export default App;