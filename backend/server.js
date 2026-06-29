import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';
import { SYSTEM_PROMPT } from './prompts/system.js';
// import { loadHistory, saveHistory, clearHistory } from './storage.js';
import { loadHistory, saveMessage, clearHistory } from './compa-db.js';

const app = express();
const PORT = process.env.PORT || 4000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

app.use(cors());
app.use(express.json());

//cargar historial
let messageHistory = loadHistory();

//endpoint para chatear
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const messages = [
            //----en content, se define la personalidad de respuesta de la ia
            //está definido en prompts/system.js
            { role: 'system', content: SYSTEM_PROMPT },
            ...messageHistory,
            { role: 'user', content: message }
        ];

        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            //---definir el modelo de ia
            model: 'llama3.2:3b',
            options: {
                temperature: 0.7,
                num_predict: 100,
                repeat_penalty: 1.1
            },
            messages,
            stream: false
        });

        const reply = response.data.message.content;

        //guardar en bbdd
        saveMessage('user', message);
        saveMessage('assistant', reply);

        //actualizar historial (en ram)
        messageHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: reply }
        );
        // saveHistory(messageHistory);

        res.json({ reply: reply });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error al conectar con la IA :v' });
    }
});

//endpoint para limpiar historial
app.delete('/api/chat/history', (req, res) => {
    messageHistory = [];
    clearHistory();
    res.json({ ok: true });
});

//cargar historial; -añadir al app.jsx
app.get('/api/chat/history', (req, res) => {
    res.json(messageHistory);
});

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});

// Cerrar BD al apagar
process.on('SIGINT', () => {
    import('./compa-db.js').then(({ close }) => close());
    process.exit(0);
});