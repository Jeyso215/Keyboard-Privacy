function sleepRand(time) {
  var now = new Date().getTime();
  var end = now + Math.random() * parseInt(time) + 1;
  while (new Date().getTime() < end) { /* do nothing */ }
}

chrome.storage.sync.get(['KP_dwelltime', 'KP_gaptime'], (settings) => {
  const currentURL = window.location.hostname;

  chrome.storage.sync.get(`KP__${currentURL}`, (result) => {
    if (!result[`KP__${currentURL}`]) {
      setupKeystrokeDelays(settings.KP_dwelltime || 100, settings.KP_gaptime || 100);
    }
  });
});

function setupKeystrokeDelays(dwelltime, gaptime) {
  const inputs = "input[type='text'], textarea";

  $(inputs).on('keydown', (e) => {
    if (Math.random() < 0.5) sleepRand(dwelltime);
  });

  $(inputs).on('keyup', (e) => {
    if (Math.random() < 0.5) sleepRand(gaptime);
  });
}

function startHeartbeat() {
  setInterval(() => {
    chrome.runtime.sendMessage({ type: "heartbeat" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Extension heartbeat failed:", chrome.runtime.lastError);
      } else if (response && response.status !== "ok") {
        console.warn("Extension is not running properly.");
      }
    });
  }, 10000);
}

startHeartbeat();
