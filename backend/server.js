import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

app.use(cors());
app.use(express.json());

//endpoint para chatear
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        const messages = [
            //----personalización del sistema de la ia para definir su rol y estilo de respuesta
            { role: 'system', content: 'Eres amigable y cercano. Respondes de forma natural y breve.' },
            ...history,
            { role: 'user', content: message }
        ];

        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            //---definir el modelo de ia
            model: 'llama3.2:1b',
            messages,
            stream: false
        });

        res.json({ reply: response.data.message.content });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error al conectar con la IA :v' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});