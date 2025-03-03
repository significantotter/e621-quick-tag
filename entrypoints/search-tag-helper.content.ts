import {
	storageApiKey,
	storageQuickTags,
	storageUsername,
	storageActive,
	storageReason,
} from "@/utils/storage";
import { getTagDiff } from "@/utils/tags";

function createButtonIfNeeded(tagDiff: string) {
	if (tagDiff === "") return null;

	const button = document.createElement("button");
	button.classList.add("e6-quick-tag-button");
	button.innerHTML = `Quick Tag`;
	button.setAttribute("data-tag-diff", tagDiff);
	return button;
}

async function generateGalleryTagButtons({
	apiKey,
	quickTags,
	username,
	reason,
}: {
	apiKey: string;
	quickTags: string;
	username: string;
	reason: string;
}) {
	// get the relevant page details
	const allPosts = document.querySelectorAll("article");

	// create the quick tag buttons
	const postsWithButtons = Array.from(allPosts)
		.map((post) => {
			const postTags = post.getAttribute("data-tags") ?? "";
			const tagDiff = getTagDiff(postTags, quickTags);
			const button = createButtonIfNeeded(tagDiff);
			if (button) {
				return {
					post,
					button,
				};
			}
			return null;
		})
		.filter((x) => x !== null);

	const buttonEventListener = async (event: Event) => {
		if (!(event.target instanceof HTMLButtonElement)) return;
		const button: HTMLButtonElement = event.target;
		if (!button.parentElement) return;
		const postId = button.parentElement.getAttribute("data-id");

		const response = await fetch(`https://e621.net/posts/${postId}.json`, {
			method: "PATCH",
			headers: {
				Authorization: "Basic " + btoa(`${username}:${apiKey}`),
				"Content-Type": "application/json",
				"User-Agent": "Quicktag/0.1 (by significantotter on e621)",
			},
			body: JSON.stringify({
				post: {
					tag_string_diff: button.getAttribute("data-tag-diff"),
					edit_reason: reason === "" || reason == null ? undefined : reason,
				},
			}),
		});
		if (response.ok) {
			window.location.reload();
		} else {
			alert("Failed to tag post. Check the console for more information.");
			console.warn(response);
		}
	};

	for (const post of postsWithButtons) {
		post.button.addEventListener("click", buttonEventListener);
		post.post.appendChild(post.button);
	}

	// add the buttons to their page elements
}

function teardownDom() {
	document
		.querySelectorAll(".e6-quick-tag-button")
		.forEach((button) => button.remove());
}

// fetch the needed info from storage
async function fetchStorageAndRun() {
	const [apiKey, quickTags, username, reason, active] = await Promise.all([
		storageApiKey.getValue(),
		storageQuickTags.getValue(),
		storageUsername.getValue(),
		storageReason.getValue(),
		storageActive.getValue(),
	]);

	// if we reload, we want to make sure the dom is cleaned up
	teardownDom();

	if (!active || quickTags === "") return;
	await generateGalleryTagButtons({ apiKey, quickTags, username, reason });
}

export default defineContentScript({
	matches: ["*://*.e621.net/posts*"],
	excludeGlobs: [
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
		storageActive.watch((_oldActive, newActive) => {
			if (!newActive) {
				fetchStorageAndRun();
			} else {
				teardownDom();
			}
		});
		storageQuickTags.watch(() => fetchStorageAndRun());
		storageUsername.watch(() => fetchStorageAndRun());
		storageApiKey.watch(() => fetchStorageAndRun());
		storageReason.watch(() => fetchStorageAndRun());

		fetchStorageAndRun();
	},
});
