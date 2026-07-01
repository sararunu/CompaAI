import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';
import { SYSTEM_PROMPT } from './prompts/system.js';
import { loadHistory, saveMessage, clearHistory } from './compa-db.js';

const app = express();
const PORT = process.env.PORT || 4000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MAX_HISTORY = 20;

app.use(cors());
app.use(express.json());

let messageHistory = loadHistory();

async function callOllama(messages) {
    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
        model: 'llama3.2:3b',
        options: {
            temperature: 0.7,
            num_predict: 200,
            repeat_penalty: 1.1
        },
        messages,
        stream: false,
        format: 'json'
    });

    let reply, mood;
    try {
        const parsed = JSON.parse(response.data.message.content);
        reply = parsed.text;
        mood = parsed.mood;
    } catch (e) {
        console.error('Error parsing JSON:', response.data.message.content);
    }

    return { reply, mood, raw: response.data.message.content };
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Mensaje vacío' });
        }

        const baseMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messageHistory,
            { role: 'user', content: message }
        ];

        // console.log('Historial actual:', messageHistory.length, 'mensajes');

        let { reply, mood, raw } = await callOllama(baseMessages);

        // reintento único si el modelo devolvió vacío
        if (!reply) {
            console.warn('Respuesta vacía, reintentando:', raw);
            const retryMessages = [
                ...baseMessages,
                { role: 'user', content: 'Recuerda: responde SOLO con {"text":"...","mood":"..."}, ambas claves rellenas, nunca vacío.' }
            ];
            ({ reply, mood, raw } = await callOllama(retryMessages));
        }

        const wasEmpty = !reply;
        if (wasEmpty) {
            console.warn('JSON parseado pero sin texto útil tras reintento, usando fallback:', { reply, mood, raw });
            reply = 'blah blah blah blah';
            mood = 'angry';
        }
        if (!mood) {
            mood = 'neutral';
        }

        const savedReply = wasEmpty ? '(sin respuesta)' : reply;

        saveMessage('user', message);
        saveMessage('assistant', savedReply);

        messageHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: savedReply }
        );

        if (messageHistory.length > MAX_HISTORY) {
            messageHistory = messageHistory.slice(-MAX_HISTORY);
        }

        res.json({ reply, mood });
    } catch (error) {
        console.error('Error completo:', error);
        if (error.response) {
            console.error('Ollama response:', error.response.data);
        }
        res.status(500).json({ error: 'Error al conectar con la IA :v' });
    }
});

app.delete('/api/chat/history', (req, res) => {
    messageHistory = [];
    clearHistory();
    res.json({ ok: true });
});

app.get('/api/chat/history', (req, res) => {
    res.json(loadHistory());
});

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    import('./compa-db.js').then(({ close }) => close());
    process.exit(0);
});