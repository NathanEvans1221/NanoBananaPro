export const copyPromptText = async (text, clipboard = globalThis.navigator?.clipboard) => {
    if (typeof text !== 'string' || !text.trim() || typeof clipboard?.writeText !== 'function') {
        return false;
    }

    try {
        await clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};
