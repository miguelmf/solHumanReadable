document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("clearDataButton")
		.addEventListener("click", handleClearDataButtonClick);
});

function handleClearDataButtonClick() {
	console.log("Clear Data button clicked");
	chrome.runtime.sendMessage({ action: "clearData" });
}
