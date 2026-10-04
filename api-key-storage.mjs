const API_KEY_STORAGE_KEY = 'GEMINI_API_KEY';

const getBrowserStorage = () => {
    try {
        return globalThis.localStorage;
    } catch {
        return null;
    }
};

export const loadStoredApiKey = (storage = getBrowserStorage()) => {
    try {
        return storage?.getItem(API_KEY_STORAGE_KEY) || '';
    } catch {
        return '';
    }
};

export const persistApiKey = (apiKey, remember, storage = getBrowserStorage()) => {
    try {
        if (!storage) return false;
        if (remember && apiKey) {
            storage.setItem(API_KEY_STORAGE_KEY, apiKey);
        } else {
            storage.removeItem(API_KEY_STORAGE_KEY);
        }
        return true;
    } catch {
        return false;
    }
};

export const clearStoredApiKey = (storage = getBrowserStorage()) => {
    try {
        if (!storage) return false;
        storage.removeItem(API_KEY_STORAGE_KEY);
        return true;
    } catch {
        return false;
    }
};
