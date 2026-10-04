import test from 'node:test';
import assert from 'node:assert/strict';
import { copyPromptText } from '../clipboard.mjs';

test('copies the prompt text without changing its whitespace', async () => {
    let copied = '';
    const clipboard = { writeText: async (text) => { copied = text; } };

    assert.equal(await copyPromptText('  完整提示詞\n第二行  ', clipboard), true);
    assert.equal(copied, '  完整提示詞\n第二行  ');
});

test('does not invoke the clipboard for empty output', async () => {
    let called = false;
    const clipboard = { writeText: async () => { called = true; } };

    assert.equal(await copyPromptText(' \n ', clipboard), false);
    assert.equal(called, false);
});

test('reports clipboard unavailable or denied as a copy failure', async () => {
    assert.equal(await copyPromptText('prompt', null), false);
    assert.equal(await copyPromptText('prompt', { writeText: async () => { throw new Error('denied'); } }), false);
});
