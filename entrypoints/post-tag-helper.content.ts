import {
	storageActive,
	storageApiKey,
	storageQuickTags,
	storageUsername,
} from "@/utils/storage";
import { getTagDiff } from "@/utils/tags";

const generateSidebarTagButton = async ({
	username,
	apiKey,
	tagDiff,
}: {
	username: string;
	apiKey: string;
	tagDiff: string;
}) => {
	// get the relevant page details
	const sidebar = document.getElementById("sidebar");
	const currentPostMeta: HTMLMetaElement | null = document.querySelector(
		'meta[name="post-id"]'
	);
	if (!sidebar || !currentPostMeta) return;
	const currentPostId = currentPostMeta.content;

	// create the quick tag button
	const tagButton = document.createElement("button");
	tagButton.id = "e6-quick-tag-button";
	tagButton.innerHTML = `Tag with "${tagDiff}"`;

	// set up the click event listener for the button
	tagButton.onclick = async function () {
		const response = await fetch(
			`https://e621.net/posts/${currentPostId}.json`,
			{
				method: "PATCH",
				headers: {
					Authorization: "Basic " + btoa(`${username}:${apiKey}`),
					"Content-Type": "application/json",
					"User-Agent": "Quicktag/0.1 (by significantotter on e621)",
				},
				body: JSON.stringify({
					post: {
						tag_string_diff: tagDiff,
					},
				}),
			}
		);
		if (response.ok) {
			window.location.reload();
		} else {
			alert("Failed to tag post. Check the console for more information.");
			console.warn(response);
		}
		// window.location.reload();
	};

	// add the button to the sidebar
	sidebar.prepend(tagButton);
};

// Tears down the DOM objects created by this helper
function teardownDom() {
	let existingButton = document.getElementById("e6-quick-tag-button");
	if (existingButton) {
		existingButton.remove();
	}
}

// fetch the needed info from storage
async function fetchStorageAndRun() {
	const [apiKey, quickTags, username, active] = await Promise.all([
		storageApiKey.getValue(),
		storageQuickTags.getValue(),
		storageUsername.getValue(),
		storageActive.getValue(),
	]);

	// check if this has the tags we're looking for already
	const allTags: NodeListOf<HTMLElement> =
		document.querySelectorAll(".search-tag");
	const allTagsText = Array.from(allTags)
		.map((tag) => tag.innerText)
		.join(" ");
	const tagDiff = getTagDiff(allTagsText, quickTags);

	// if we reload, we want to make sure not to add a duplicate button
	teardownDom();

	if (!active || tagDiff === "") return;
	generateSidebarTagButton({ apiKey, tagDiff, username });
}

export default defineContentScript({
	matches: ["*://*.e621.net/posts*"],
	includeGlobs: [
		"**/posts/0*",
		"**/posts/1*",
		"**/posts/2*",
		"**/posts/3*",
		"**/posts/4*",
		"**/posts/5*",
		"**/posts/6*",
		"**/posts/7*",
		"**/posts/8*",
		"**/posts/9*",
	],
	main() {
		storageActive.watch((oldActive, newActive) => {
			if (newActive === false) {
				teardownDom();
			} else {
				fetchStorageAndRun();
			}
		});
		storageQuickTags.watch(fetchStorageAndRun);
		storageUsername.watch(fetchStorageAndRun);
		storageApiKey.watch(fetchStorageAndRun);

		fetchStorageAndRun();
	},
});
