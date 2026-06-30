import { useEffect, useRef } from 'react';
import Mensaje from '../Mensaje.jsx';
import './AreaChat.css';

function AreaChat({ mensajes = [], loading }) {
    const endRef = useRef(null);
    const userScrolledRef = useRef(false);

    useEffect(() => {
        if (!userScrolledRef.current) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mensajes, loading]);

    return (
        <div className="chat-area">
            {mensajes?.map((mensaje, index) => (
                <Mensaje key={index} role={mensaje.role} content={mensaje.content} />
            ))}
            {loading && <Mensaje role="assistant" content="..." />}
            <div ref={endRef} />
        </div>
    );
}

export default AreaChat;