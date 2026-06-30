export function analyzeMood(text) {
  const lower = text.toLowerCase();
  
  if (/enfadad[oa]|enojad[oa]|furios[oa]|molest[oa]|irritad[oa]|hart[oa]|rabia|odio|grrr/.test(lower)) return 'angry';
  if (/incre[íi]ble|alucinante|guau|wow|genial[íi]simo|espectacular|flipante|alucina/.test(lower)) return 'excited';
  if (/triste|mal|lo siento|perd[oó]n|disculpa|error|fallo|problema|dif[íi]cil|complicado|no pued|no s[eé]|ups|vaya/.test(lower)) return 'sad';
  if (/genial|bien|feliz|content[oa]|me alegr[oa]|excelente|perfecto|me gust|divertid[oa]|gracios[oa]|ja ja|jaja|jeje|risa/.test(lower)) return 'happy';
  if (/no entiendo|confus|raro|extraño|qu[ée]\?|eh\?|mmm|no s[eé]|mmm/.test(lower)) return 'confused';
  if (/pienso|creo|quiz[áa]s|tal vez|depende|complejo|interesante|curios[oa]|hmm|bueno\.\.\./.test(lower)) return 'thinking';
  
  return 'neutral';
}