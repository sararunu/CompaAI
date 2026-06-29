import { useState, useLayoutEffect, useRef } from 'react';
import './AreaInput.css';

function AreaInput({ onSend, disabled }) {
    const [texto, setTexto] = useState('');
    const inputRef = useRef(null); //referencia al input

    // Foco al montar Y tras cada render (incluye tras setTexto(''))
    // useLayoutEffect es síncrono, se ejecuta antes de pintar 
    useLayoutEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);  // se ejecuta al montar y cuando disabled cambia


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!texto.trim() || disabled) return;
        onSend(texto);
        setTexto('');
    };


    return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                ref={inputRef} //conecta ref al input para el autofoco
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