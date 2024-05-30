const animals = [
	"Octopus",
	"Tiger",
	"Panda",
	"Dolphin",
	"Elephant",
	"Giraffe",
	"Snake",
	"Lion",
	"Cat",
	"Dog",
	"Horse",
	"Cow",
	"Sheep",
	"Goat",
	"Pig",
	"Bird",
	"Fish",
	"Ant",
	"Spider",
	"Rabbit",
	"Duck",
	"Deer",
	"Frog",
	"Lizard",
	"Snail",
];

const actions = [
	"Jumping",
	"Flying",
	"Climbing",
	"Running",
	"Swimming",
	"Sleeping",
	"Dancing",
	"Singing",
	"Eating",
	"Hiding",
	"Exploring",
	"Building",
	"Laughing",
	"Dreaming",
	"Playing",
];

const stringsNotToReplace = [
	"Tensor Wallet",
	"Coinbase 2",
	"Magic Eden V2 Authority",
];

const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.type = "text/css";
linkElement.href = chrome.runtime.getURL("content-scripts/styles.css");

document.head.appendChild(linkElement);

chrome.storage.local.get("addressMapping", (data) => {
	const addressMapping = data.addressMapping || {};

	function generateHumanReadableName(address) {
		if (addressMapping[address]) {
			return addressMapping[address];
		}
		const animal = animals[Math.floor(Math.random() * animals.length)];
		const action = actions[Math.floor(Math.random() * actions.length)];
		const number = Math.floor(Math.random() * 10);

		const humanReadableName = `${number}-${animal}-${action}`;

		addressMapping[address] = humanReadableName;

		chrome.storage.local.set({ addressMapping: addressMapping });

		return humanReadableName;
	}

	function replaceAddresses(element) {
		const textContent = element.textContent;
		if (stringsNotToReplace.includes(textContent)) {
			return;
		}

		const href = element.getAttribute("href");
		if (!href.startsWith("/account/")) {
			return;
		}
		const address = href.replace("/account/", "");
		const humanReadableName = generateHumanReadableName(address);
		element.innerHTML = humanReadableName;
	}

	function processAllAddresses() {
		const addressElements = document.querySelectorAll(
			'a.text-link[href^="/account/"]',
		);
		addressElements.forEach(replaceAddresses);
	}

	let timeout;
	function debounceProcessAllAddresses() {
		clearTimeout(timeout);
		timeout = setTimeout(processAllAddresses, 0);
	}

	// MutationObserver callback function
	function handleMutations(mutationsList, observer) {
		let shouldProcess = false;
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" || mutation.type === "attributes") {
				shouldProcess = true;
				break;
			}
		}
		if (shouldProcess) {
			debounceProcessAllAddresses();
		}
	}

	const observer = new MutationObserver(handleMutations);
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
	});

	processAllAddresses();
});
