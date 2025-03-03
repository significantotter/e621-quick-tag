export const storageActive = storage.defineItem<boolean>("sync:active", {
	fallback: true,
});
export const storageUsername = storage.defineItem<string>("sync:username", {
	fallback: "",
});
export const storageApiKey = storage.defineItem<string>("sync:api-key", {
	fallback: "",
});
export const storageQuickTags = storage.defineItem<string>("sync:quick-tags", {
	fallback: "",
});
export const storageReason = storage.defineItem<string>("sync:reason", {
	fallback: "",
});
