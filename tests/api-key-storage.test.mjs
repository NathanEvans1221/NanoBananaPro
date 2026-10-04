import test from 'node:test';
import assert from 'node:assert/strict';
import { clearStoredApiKey, loadStoredApiKey, persistApiKey } from '../api-key-storage.mjs';

const createStorage = (initial = {}) => {
    const values = new Map(Object.entries(initial));
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
        values
    };
};

test('loads an API key saved in browser storage', () => {
    assert.equal(loadStoredApiKey(createStorage({ GEMINI_API_KEY: 'saved-key' })), 'saved-key');
});

test('saves an API key only when the user opted in', () => {
    const storage = createStorage();

    assert.equal(persistApiKey('new-key', true, storage), true);
    assert.equal(storage.getItem('GEMINI_API_KEY'), 'new-key');

    assert.equal(persistApiKey('new-key', false, storage), true);
    assert.equal(storage.getItem('GEMINI_API_KEY'), null);
});

test('clears a saved API key', () => {
    const storage = createStorage({ GEMINI_API_KEY: 'saved-key' });

    clearStoredApiKey(storage);

    assert.equal(storage.getItem('GEMINI_API_KEY'), null);
});

test('handles unavailable browser storage without throwing', () => {
    const unavailableStorage = {
        getItem() { throw new Error('blocked'); },
        setItem() { throw new Error('blocked'); },
        removeItem() { throw new Error('blocked'); }
    };

    assert.equal(loadStoredApiKey(unavailableStorage), '');
    assert.equal(persistApiKey('key', true, unavailableStorage), false);
    assert.equal(clearStoredApiKey(unavailableStorage), false);
});
