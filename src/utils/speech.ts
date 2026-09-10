// Speech synthesis utility for senior-friendly audio narration

let isAudioEnabled = true;

export function setAudioEnabled(enabled: boolean) {
  isAudioEnabled = enabled;
  if (!enabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getAudioEnabled(): boolean {
  return isAudioEnabled;
}

export function speakText(text: string, force = false) {
  if ((!isAudioEnabled && !force) || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown or special symbols
  const cleanText = text
    .replace(/[#*`_\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ko-KR';
  // Speak slightly slower and clearer for seniors
  utterance.rate = 0.88;
  utterance.pitch = 1.0;

  // Try to find a good Korean voice if available
  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KR'));
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
