import { useState } from 'react'
import { enviarMensaje } from '../services/api'
import { clearHistory } from '../services/api';

function useChat() {
    //---ahora el back guarda los mensajes
    // const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function enviarMensajeHandler(texto) {
        // const userMensaje = { role: 'user', content: texto };
        // setMensajes(prev => [...prev, userMensaje]);
        setLoading(true);

        try {
            const reply = await enviarMensaje(texto, []); //--historial vacío pq lo maneja el back
            // setMensajes(prev => [...prev, { role: 'assistant', content: reply }]);
            return reply;
        } catch (error) {
            alert('Error, el mensaje no se pudo enviar :v');
            console.error('Error al enviar el mensaje:', error);
        } finally {
            setLoading(false);
        }

    }

    async function clear() {
        await clearHistory();
    }

    return { enviarMensajeHandler, loading, clear };
}

export default useChat;

