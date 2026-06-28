import { useEffect, useRef } from 'react';
import Mensaje from '../Mensaje.jsx';
import './AreaChat.css';

function AreaChat({ mensajes, loading }) {
    const endRef = useRef(null);  //---ref al final de la lista, no re-renderiza
    const userScrolledRef = useRef(false);

    //autoscroll cuando cambien mensajes o loading
    useEffect(() => {
        if (!userScrolledRef.current) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mensajes, loading]);

    return (
        <div className="chat-area">
            {mensajes.map((mensaje, index) => (
                <Mensaje key={index} role={mensaje.role} content={mensaje.content} />
            ))}
            {loading && <Mensaje role="assistant" content="..." />}
            <div ref={endRef} />  {/* ancla al final */}
        </div>
    );
}

export default AreaChat;