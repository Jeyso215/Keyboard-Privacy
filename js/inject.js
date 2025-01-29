function sleepRand(time) {
	var now = new Date().getTime();
	var end = (now + (Math.random() * parseInt(time)) + 1);
 	while(new Date().getTime() < end){ /* do nothing */ }
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    if (request.name == "enablePrivacyMode")
	    {
	    	sendResponse({"message":"ok"});
	    	$(":input:text").keydown(function(e) {
				var shouldSleep = Math.round(Math.random()) < 0.5 ? sleepRand(request.KP_dwelltime) : false;
			});

			$(":input:text").keyup(function(e) {
				var shouldSleep = Math.round(Math.random()) < 0.5 ? sleepRand(request.KP_gaptime) : false;
			});

			$('input[type=text], textarea').keyup(function(e) {
				var shouldSleep = Math.round(Math.random()) < 0.5 ? sleepRand(request.KP_gaptime) : false;
			});
	   	}
		
// Heartbeat Monitoring
function startHeartbeat() {
  setInterval(() => {
    chrome.runtime.sendMessage({ type: "heartbeat" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Extension heartbeat failed:", chrome.runtime.lastError);
      } else if (response && response.status !== "ok") {
        console.warn("Extension is not running properly.");
      }
    });
  }, 10000); // Every 10 seconds
}

startHeartbeat();
});
