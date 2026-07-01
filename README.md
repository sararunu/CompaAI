<img width="200" height="auto" alt="compa" src="https://github.com/user-attachments/assets/93546457-2f92-4775-ba94-4dd2dae7ed2b" />
# Compa‑IA

Aplicación local creada con **React + Vite** y **Node.js**, usando **SQLite** como base de datos para la memoria.  
Motor de inferencia: **Ollama (llama3.2:3b)**.
STT/TTS: **Web Speech API** del navegador.

---

## Instrucciones para probarlo

### 1. Instalar Ollama  
Descarga e instala Ollama en tu PC (versión actual: **0.30.11**)  
Página oficial: https://ollama.com

### 2. Iniciar Ollama  
Antes de arrancar el backend, ejecuta:
```text
ollama serve
```
### 3. Descargar el modelo (solo la primera vez)
```text
ollama pull llama3.2:3b
```

### 4. Arrancar el backend
```text
cd backend
npm run dev
```

### 5. Arrancar el frontend
```text
cd frontend
npm run dev
```
(http://localhost:5173)

---

<h2><span style="color:red">Notas</span></h2>

- El comportamiento base de la IA está definido en un **prompt del sistema**. Puedes modificarlo en:  
  `/backend/prompts/system.js`

- Si quieres usar otro modelo de Ollama, cámbialo en la propiedad **model** de:  
  `/backend/server.js` (línea 20)

- Tiene 'Google español' como voz por defecto, si queréis cambiarla, es en `/frontend/src/utils/voice.js` en la línea 29.

  ---
<img width="auto" height="150" alt="compa_happy" src="https://github.com/user-attachments/assets/2852c847-dede-4ed5-9c39-4bf590322789" />
<img width="auto" height="150" alt="compa_sad" src="https://github.com/user-attachments/assets/d9ec79ed-92ca-4d24-a7fc-3fd8ae426567" />
<img width="auto" height="150" alt="compa_thinking" src="https://github.com/user-attachments/assets/59ee0b77-28bc-432e-975d-b137e9a90db8" />
<img width="auto" height="150" alt="compa_excited" src="https://github.com/user-attachments/assets/c54db50d-f74a-4905-ba9d-9473b49b33a8" />
<img width="auto" height="150" alt="compa_angry" src="https://github.com/user-attachments/assets/45a73712-594a-4be8-ac10-c6a62c93a872" />






