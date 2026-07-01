
function Mensaje({ role, content }) {
    return (
        <div className={`msg ${role}`}>
            <div className="burbuja">{content}</div>
        </div>
    )
}

export default Mensaje;
