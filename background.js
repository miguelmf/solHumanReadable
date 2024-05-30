// Listen for the extension's runtime.onInstalled event
chrome.runtime.onInstalled.addListener(function () {
	console.log("Extension installed.");
});

// Listen for the extension's runtime.onMessage event
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("Message received in background script:", message);
	if (message.action === "clearData") {
		clearExtensionData();
	}
});

function clearExtensionData() {
	chrome.storage.local.remove("addressMapping", function () {
		console.log("[solHumanReadable] addressMapping cleared from storage!");
	});
}
