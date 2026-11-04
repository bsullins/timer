(() => {
  const status = document.getElementById('offlineStatus');
  if (!('serviceWorker' in navigator)) {
    status.textContent = 'Offline saving is unavailable in this browser.';
    return;
  }
  const showReady = () => {
    status.textContent = navigator.onLine ? 'Available offline · Timer & illustrations saved' : 'Offline · Timer & illustrations available';
  };
  const start = async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      await navigator.serviceWorker.ready;
      showReady();
      window.addEventListener('online', showReady);
      window.addEventListener('offline', showReady);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'redundant' && !registration.active) status.textContent = 'Offline saving failed. Reconnect and reload to retry.';
        });
      });
    } catch (_) {
      status.textContent = 'Offline saving unavailable. Reconnect and reload to retry.';
    }
  };
  window.addEventListener('load', start, { once: true });
})();
