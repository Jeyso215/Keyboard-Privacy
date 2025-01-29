var siteURL;

$("#settings_save").on("click", function() {
	var settings = {};
	settings.KP_dwelltime = $("#dwelltime").val();
	settings.KP_gaptime = $("#gaptime").val();
	chrome.storage.sync.set(settings, function() {
		console.log("Settings updated");
	});
});

var whitelistSite = function(url) {
	var obj = {};
	obj["KP__" + url] = "true";
	chrome.storage.sync.set(obj, function() {
		console.log(url + " has been whitelisted.");
	});
}

var removeWhitelistSite = function(url) {
	chrome.storage.sync.remove("KP__" + url, function() {
		console.log(url + " has been removed from whitelist.");
	});
}

var setDisabledPrivacy = function() {

	$("#header").addClass("aos-header-error");
	$("#header").addClass("aos-i-open");
	$("#header").removeClass("aos-i-closed");
	$("#header").removeClass("aos-header-ok");
	$("#status").text('disabled');
	$("#status2").text('disabled');
	$("#togglePrivacy").addClass("aos-button-ok");
	$("#togglePrivacy").removeClass("aos-button-error");
	$("#togglePrivacy").text("enable");
	chrome.action.setIcon({path: 'icons/icon_safe.png'});
}

var setEnabledPrivacy = function() {

	$("#header").removeClass("aos-header-error");
	$("#header").addClass("aos-header-ok");
	$("#header").addClass("aos-i-closed");
	$("#header").removeClass("aos-i-open");
	$("#status").text('enabled');
	$("#status2").text('enabled');
	$("#togglePrivacy").addClass("aos-button-error");
	$("#togglePrivacy").removeClass("aos-button-ok");
	$("#togglePrivacy").text("disable");
	chrome.action.setIcon({path: 'icons/icon_safe.png'});
}

var togglePrivacy = function() {

	if($("#status").text() == "disabled") {
		setEnabledPrivacy();
		removeWhitelistSite(siteURL);
	} else {
		setDisabledPrivacy();
		whitelistSite(siteURL);
	}	

}

$("#togglePrivacy").on("click", function(e) {
	e.preventDefault();
	togglePrivacy();
	chrome.tabs.getSelected(null, function(tab) {
    	chrome.tabs.reload(tab.id);
    	setTimeout(function() {window.close();}, 1000);
	});
});

chrome.storage.sync.get("KP_dwelltime", function(data){
			$("#dwelltime").val(data.KP_dwelltime);
});

chrome.storage.sync.get("KP_gaptime", function(data){
			$("#gaptime").val(data.KP_gaptime);
});

chrome.tabs.query({active: true, 'lastFocusedWindow': true}, function(Tabs) {
			$("#url").text(Tabs[0].url.split("/")[2]);
			siteURL = Tabs[0].url.split("/")[2];
			chrome.storage.sync.get("KP__" + Tabs[0].url.split("/")[2], function(items){
				if(items["KP__" + Tabs[0].url.split("/")[2]]) {
					setDisabledPrivacy();
				}
				else {
					setEnabledPrivacy();
				}});

});
