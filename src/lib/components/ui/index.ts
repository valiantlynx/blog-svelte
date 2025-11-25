// Re-export UI components
export { default as Input } from './Input.svelte';
export { default as Modal } from './Modal.svelte';
export { default as ButtonWithIcon } from './ButtonWithIcon.svelte';
export { default as ThemeChanger } from './ThemeChanger.svelte';
export { default as ValiantRichText } from './ValiantRichText.svelte';

// Export getData helper - returns current editor data
let editorData: any = null;

export function setEditorData(data: any) {
	editorData = data;
}

export function getData() {
	return editorData;
}
