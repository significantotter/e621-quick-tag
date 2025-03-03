import { defineConfig, UserManifest } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: "webextension-polyfill",
	manifest: {
		manifest_version: 2,
		name: "e6-quick-tag",
		version: "1.0",

		description:
			"Adds a shortcut to quickly tag e621 images with a tag preset.",
		icons: {
			"48": "icon/hashtag.svg",
			"96": "icon/hashtag.svg",
			"128": "icon/hashtag.svg",
		},
		browser_specific_settings: {
			gecko: {
				id: "e6-quick-tag@significantotter",
				strict_min_version: "58.0",
			},
		},
		permissions: ["storage"],
	} satisfies UserManifest,
});
