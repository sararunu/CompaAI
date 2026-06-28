import { useState } from 'react'
import { enviarMensaje } from '../services/api'

function useChat() {
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function enviarMensajeHandler(texto) {
        const userMensaje = { role: 'user', content: texto };

        setMensajes(prev => [...prev, userMensaje]);
        setLoading(true);

        try {
            const reply = await enviarMensaje(texto, mensajes);
            setMensajes(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            alert('Error, el mensaje no se pudo enviar :v');
            console.error('Error al enviar el mensaje:', error);
        } finally {
            setLoading(false);
        }

    }

    return { mensajes, enviarMensajeHandler, loading };
}

export default useChat;

