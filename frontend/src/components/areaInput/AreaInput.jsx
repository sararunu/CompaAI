import { useState } from 'react';
import './AreaInput.css';

function AreaInput({ onSend, disabled }) {
    const [texto, setTexto] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!texto.trim() || disabled) return;
        onSend(texto);
        setTexto('');
    };

    return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Escribir a Compa..."
                disabled={disabled}
            />
            <button type="submit" disabled={disabled || !texto.trim()}>
                Enviar
            </button>
        </form>
    );
}

export default AreaInput;