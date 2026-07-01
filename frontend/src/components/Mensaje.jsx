function Mensaje({ role, content }) {
    if (content === '...') {
        return (
            <div className={`msg ${role}`}>
                <div className="burbuja">
                    <span className="typing-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`msg ${role}`}>
            <div className="burbuja">{content}</div>
        </div>
    );
}

export default Mensaje;