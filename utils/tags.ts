/**
 * Finds the difference between the existing tags and the quick tags setting
 * @returns The tag difference between the existing tags and the quickTags
 */
export function getTagDiff(baseTags: string, quickTags: string): string {
	// the quick tags are a space separated list. A negative tag is prefixed with a '-'
	const quickTagsList = quickTags.split(" ");
	const existingTagsSet = new Set(baseTags.split(" "));

	/** @type {string[]} */
	const finalTagDiff = [];

	for (const tag of quickTagsList) {
		if (tag.startsWith("-")) {
			if (existingTagsSet.has(tag.substring(1))) {
				finalTagDiff.push(tag);
			}
		} else {
			if (!existingTagsSet.has(tag)) {
				finalTagDiff.push(tag);
			}
		}
	}
	return finalTagDiff.join(" ").trim();
}
