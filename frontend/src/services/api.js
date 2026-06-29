export async function enviarMensaje(mensaje, historial) {
    try {
        const res = await fetch('http://localhost:4000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: mensaje, history: historial })
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json(); //aquí está el reply

        if (!data.reply) {
            throw new Error("El backend no devolvió 'reply'");
        }

        return data.reply;
    } catch (error) {
        console.error("Error enviando mensaje:", error);
        return null;
    }
}

export async function clearHistory() {
  const res = await fetch('http://localhost:4000/api/chat/history', {
    method: 'DELETE'
  });
  return res.json();
}

