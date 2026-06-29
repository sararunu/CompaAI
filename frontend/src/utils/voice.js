// //añadir voz con webspeech api
// //--convertir voz a texto de respuesta ia
// // export function speak(text, lang = 'es-ES') {
// //     if (!window.speechSynthesis) return;

// //     // cancelar habla anterior
// //     window.speechSynthesis.cancel();

// //     const utterance = new SpeechSynthesisUtterance(text);
// //     utterance.lang = lang;
// //     utterance.rate = 1.0;      // velocidad lectura (0.1 - 10)
// //     utterance.pitch = 0.8;     // tono (0 - 2) grave-agudo
// //     utterance.volume = 1.0;    // volumen (0 - 1)

// //     // elegir voz
// //     const voices = window.speechSynthesis.getVoices();
// //     const spanishVoice = voices.find(v => v.lang.startsWith('es'));
// //     if (spanishVoice) utterance.voice = spanishVoice;

// //     window.speechSynthesis.speak(utterance);
// // }
// // Variable para almacenar las voces globalmente una vez cargadas
// let voicesCache = [];

// if (typeof window !== 'undefined' && window.speechSynthesis) {
//     window.speechSynthesis.onvoiceschanged = () => {
//         voicesCache = window.speechSynthesis.getVoices();
//     };
//     voicesCache = window.speechSynthesis.getVoices();
// }

// export function speak(text) {
//     if (!window.speechSynthesis) return;

//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);

//     // Forzamos el idioma local a castellano (España)
//     utterance.lang = 'es-ES'; 
//     utterance.rate = 1.0;      
//     utterance.pitch = 1.0; // Tono normal para evitar distorsión de fonemas
//     utterance.volume = 1.0;    

//     const voices = voicesCache.length ? voicesCache : window.speechSynthesis.getVoices();

//     // FILTRADO CON PRIORIDAD EN CASTELLANO (es-ES)
//     let selectedVoice = 
//         // Prioridad 1: Voz de España de alta calidad (Google o Microsoft Edge)
//         voices.find(v => v.lang === 'es-ES' && (v.name.includes('Google') || v.name.includes('Natural'))) ||
//         // Prioridad 2: Cualquier otra voz de España (nativa del sistema)
//         voices.find(v => v.lang === 'es-ES') ||
//         // Prioridad 3: Cualquier voz en español (México, Argentina, etc.) si no hay de España
//         voices.find(v => v.lang.startsWith('es'));

//     if (selectedVoice) {
//         utterance.voice = selectedVoice;
//     }

//     window.speechSynthesis.speak(utterance);
// }



// //escucha al user y convertir voz a texto
// export function startListening(onResult, onError, lang = 'es-ES') {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (!SpeechRecognition) {
//     onError('Navegador no soporta reconocimiento de voz :v');
//     return null;
//   }

//   const recognition = new SpeechRecognition();
//   recognition.lang = lang;
//   recognition.continuous = false; //para q pare al acabar de hablar
//   recognition.interimResults = false;
//   recognition.maxAlternatives = 1;

//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript;
//     onResult(transcript);
//   };

//   recognition.onerror = (event) => onError(event.error);
//   recognition.onend = () => {}; //--se para solo

//   recognition.start();
//   return recognition;
// }

// Variable para almacenar las voces globalmente una vez cargadas

// 1. Añadimos el parámetro 'gender' (puedes pasarle 'female' o 'male')
// Por defecto lo dejamos en 'female' (mujer), pero puedes cambiarlo
// export function speak(text, gender = 'female') {
//     if (!window.speechSynthesis) return;

//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);

//     // Forzamos el idioma local a castellano (España)
//     utterance.lang = 'es-ES'; 
//     utterance.rate = 1.0;      
//     utterance.pitch = 1.0; // Tono normal para evitar distorsión de fonemas
//     utterance.volume = 1.0;    

//     const voices = voicesCache.length ? voicesCache : window.speechSynthesis.getVoices();

//     // 2. Filtramos primero SOLO las voces que sean estrictamente de España
//     const spanishVoices = voices.filter(v => v.lang === 'es-ES');

//     // Nombres típicos de voces de mujer y hombre en Windows, Mac, Android y Chrome
//     const femaleNames = ['Helena', 'Laura', 'Alba', 'Elvira', 'Dalia', 'Google español'];
//     const maleNames = ['Álvaro', 'Jorge', 'Enrique', 'Pablo', 'David'];

//     let selectedVoice = null;

//     // 3. Buscamos según el género que hayas pedido
//     if (gender === 'female') {
//         // Busca una voz de España que contenga un nombre de mujer
//         selectedVoice = spanishVoices.find(v => femaleNames.some(name => v.name.includes(name)));
//     } else {
//         // Busca una voz de España que contenga un nombre de hombre
//         selectedVoice = spanishVoices.find(v => maleNames.some(name => v.name.includes(name)));
//     }

//     // 4. PLANES DE RESPALDO (Por si el navegador no tiene esos nombres exactos)
//     if (!selectedVoice) {
//         // Si no encuentra el género, pilla la primera de España que haya
//         selectedVoice = spanishVoices[0]; 
//     }
//     if (!selectedVoice) {
//         // Si no hay de España, pilla cualquier cosa en español (Latinoamérica, etc.)
//         selectedVoice = voices.find(v => v.lang.startsWith('es'));
//     }

//     // Asignamos la voz encontrada
//     if (selectedVoice) {
//         utterance.voice = selectedVoice;
//     }

//     window.speechSynthesis.speak(utterance);
// }
// frontend/src/utils/voice.js
export function speak(text, lang = 'es-ES', {onStart, onEnd} = {}) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0; // velocidad lectura (0.1 - 10)
  utterance.pitch = 0.9; // tono (0 - 2) grave-agudo
  utterance.volume = 1.0; // volumen (0 - 1)

  // === AQUÍ: SELECCIÓN DE VOZ ===
  /*
  //--en consola navegador para ver opciones de voz:
    speechSynthesis.getVoices()
    .filter(v => v.lang.startsWith('es'))
    .forEach((v, i) => console.log(i, v.name, v.lang, v.default ? '★ DEFAULT' : ''));
    */
  const voices = window.speechSynthesis.getVoices();

  // Opción A: Primera voz que coincida con el idioma
  // const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])); // 'es-ES' -> 'es'

  // Opción B: Voz específica por nombre (ej. "Google Español", "Microsoft Helena")
  const voice = voices.find(v => v.name === 'Google español');

  // Opción C: Voz más natural (preferir "Google" o Microsoft" / "Microsoft" / "Apple" sobre nativas)
  // const preferred = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Microsoft')));
  // const voice = preferred || voices.find(v => v.lang.startsWith('es'));

  if (voice) {
    utterance.voice = voice;
    
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.(); // también limpia si hay error

    console.log('Usando voz:', voice.name, voice.lang);
  } else {
    console.warn('No hay voz para', lang, '- voces disponibles:', voices.map(v => v.name));
  }
  // === FIN SELECCIÓN ===

  window.speechSynthesis.speak(utterance);
}

//escucha al user y convertir voz a texto
export function startListening(onResult, onError, lang = 'es-ES') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError('Navegador no soporta reconocimiento de voz :v');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false; //para q pare al acabar de hablar
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => onError(event.error);
  recognition.onend = () => { }; //--se para solo

  recognition.start();
  return recognition;
}

