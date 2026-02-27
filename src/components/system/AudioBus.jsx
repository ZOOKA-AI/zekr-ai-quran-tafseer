export function sendAudioEvent(action, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('base44:audio', { detail: { action, ...payload } }));
}

export function onAudioEvent(handler) {
  if (typeof window === 'undefined') return () => {};
  const fn = (e) => handler(e.detail || {});
  window.addEventListener('base44:audio', fn);
  return () => window.removeEventListener('base44:audio', fn);
}