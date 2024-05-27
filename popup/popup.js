document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("clearDataButton")
		.addEventListener("click", handleClearDataButtonClick);
});

function handleClearDataButtonClick() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "clearData" });
	});
}
