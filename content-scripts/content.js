const positiveNames = [
	"Sunshine",
	"Smile",
	"Laughter",
	"Joy",
	"Hope",
	"Love",
	"Peace",
	"Kindness",
	"Gratitude",
	"Harmony",
	"Success",
	"Happiness",
	"Bliss",
	"Dream",
	"Miracle",
	"Blessing",
	"Wonder",
	"Radiance",
	"Cheer",
	"Serendipity",
];
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

const colors = [
	"red",
	"blue",
	"green",
	"yellow",
	"orange",
	"purple",
	"pink",
	"brown",
	"cyan",
	"magenta",
	"teal",
	"lime",
	"indigo",
	"maroon",
	"olive",
	"navy",
	"coral",
	"gold",
	"silver",
	"black",
	"aquamarine",
	"lavender",
	"crimson",
	"orchid",
	"turquoise",
	"salmon",
	"tan",
	"slategray",
	"violet",
	"khaki",
	"peru",
	"darkslateblue",
	"thistle",
	"sienna",
	"darkolivegreen",
	"firebrick",
	"mediumvioletred",
	"royalblue",
	"darkorchid",
	"mediumseagreen",
	"tomato",
	"darkgoldenrod",
	"darkkhaki",
	"mediumslateblue",
	"saddlebrown",
	"mediumaquamarine",
	"mediumorchid",
	"darkseagreen",
	"cornflowerblue",
];

const stringsNotToReplace = ["Tensor Wallet", "Coinbase 2"];

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
		const positiveName =
			positiveNames[Math.floor(Math.random() * positiveNames.length)];
		const animal = animals[Math.floor(Math.random() * animals.length)];
		const color = colors[Math.floor(Math.random() * colors.length)];

		const colorClass = color;

		const humanReadableName = `<span class="${colorClass}">${animal}-${positiveName}-${color}</span>`;

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
		const address = href.replace("/account/", "");
		const humanReadableName = generateHumanReadableName(address);
		element.innerHTML = humanReadableName;
	}

	// MutationObserver callback function
	function handleMutations(mutationsList, observer) {
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

	const observer = new MutationObserver(handleMutations);
	observer.observe(document.body, { childList: true, subtree: true });

	const initialAddressElements = document.querySelectorAll(
		'a.text-link[href^="/account/"]',
	);
	initialAddressElements.forEach(replaceAddresses);
});
