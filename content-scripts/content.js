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
		timeout = setTimeout(processAllAddresses, 5);
	}

	// I am using two different mutation observers. One for debouncing and one for instant mode. The debouncing one is to deal with cached pages, i.e., when changing to a page to which we have already been, for example, the previous page. This is, however, a bit slow due to the debounce. You can see the addresses being replaced/refreshed in the page. Hence the need for the "instant", which performs much faster, but does not work when going to a previous page. I couldn't make the "instant" work for previous pages, the page would just "hang" and CPU/memory would spike.
	function handleMutationsForDebounce(mutationsList, observer) {
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

	function handleMutationsForInstant(mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === 1) {
						const addressElements = node.querySelectorAll(
							'a.text-link[href^="/account/"]',
						);
						addressElements.forEach(replaceAddresses);
					}
				}
			}
		}
	}

	const observerDebounce = new MutationObserver(handleMutationsForDebounce);
	observerDebounce.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
	});

	const observerInstant = new MutationObserver(handleMutationsForInstant);
	observerInstant.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
	});

	processAllAddresses();
});
