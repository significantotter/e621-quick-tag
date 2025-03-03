import {
	storageActive,
	storageApiKey,
	storageQuickTags,
	storageUsername,
	storageReason,
} from "@/utils/storage";

const activeInput = document.getElementById("active") as HTMLInputElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;
const quickTagsInput = document.getElementById(
	"quick-tags"
) as HTMLInputElement;
const reasonInput = document.getElementById("reason") as HTMLInputElement;

const updateActive = () => {
	const active = activeInput.checked;
	storageActive.setValue(active);
};
const updateUsername = () => {
	const username = usernameInput.value ?? "";
	storageUsername.setValue(username);
};
const updateApiKey = () => {
	const apiKey = apiKeyInput.value ?? "";
	storageApiKey.setValue(apiKey);
};
const updateQuickTags = () => {
	const quickTags = quickTagsInput.value ?? "";
	storageQuickTags.setValue(quickTags);
};
const updateReason = () => {
	const reason = reasonInput.value ?? "";
	storageReason.setValue(reason);
};

activeInput.onchange = updateActive;
usernameInput.oninput = updateUsername;
apiKeyInput.oninput = updateApiKey;
quickTagsInput.oninput = updateQuickTags;
reasonInput.oninput = updateReason;

// on startup, load the stored values
Promise.all([
	storageApiKey.getValue(),
	storageQuickTags.getValue(),
	storageUsername.getValue(),
	storageActive.getValue(),
	storageReason.getValue(),
]).then(([apiKey, quickTags, username, active, reason]) => {
	apiKeyInput.value = apiKey ?? "";
	quickTagsInput.value = quickTags ?? "";
	usernameInput.value = username ?? "";
	activeInput.checked = active ?? true;
	reasonInput.value = reason ?? "";
});
