export function speak(text, lang = 'es-ES', { onStart, onEnd, mood = 'neutral' } = {}) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  //control voz de moods
  const prosody = {
    neutral: { rate: 1.0, pitch: 1.0, volume: 1.0 },
    happy: { rate: 1.05, pitch: 1.15, volume: 1.0 },
    sad: { rate: 0.9, pitch: 0.9, volume: 0.9 },
    angry: { rate: 1.25, pitch: 1.1, volume: 1.0 },
    excited: { rate: 1.1, pitch: 1.25, volume: 1.0 },
    thinking: { rate: 0.9, pitch: 0.95, volume: 0.95 },
    confused: { rate: 0.95, pitch: 1.05, volume: 0.95 },
    friendly: { rate: 1.05, pitch: 1.05, volume: 1.0 },
    serious: { rate: 0.9, pitch: 0.9, volume: 1.0 },
  };

  const p = prosody[mood] || prosody.neutral;
  utterance.rate = p.rate;
  utterance.pitch = p.pitch;
  utterance.volume = p.volume;

  // voz
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.name === 'Google español') ||
    voices.find(v => v.lang === 'es-ES') ||
    voices.find(v => v.lang.startsWith('es'));

  if (voice) utterance.voice = voice;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function startListening(onResult, onError, lang = 'es-ES') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError('Navegador no soporta reconocimiento de voz :v');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => onError(event.error);
  recognition.onend = () => { };

  recognition.start();
  return recognition;
}