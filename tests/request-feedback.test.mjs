import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequestController, getRequestErrorMessage } from '../request-feedback.mjs';

test('classifies authentication and access errors without exposing raw details', () => {
    const message = getRequestErrorMessage({ status: 403, message: 'secret=abc123 denied' }, 'image');

    assert.match(message, /金鑰|權限/);
    assert.doesNotMatch(message, /abc123|secret/);
});

test('classifies quota and network errors', () => {
    assert.match(getRequestErrorMessage({ status: 429 }, 'prompt'), /配額|頻率/);
    assert.match(getRequestErrorMessage(new TypeError('Failed to fetch'), 'image'), /網路/);
});

test('uses a safe generic message for unknown errors', () => {
    const message = getRequestErrorMessage(new Error('token=private-key'), 'prompt');

    assert.match(message, /提示詞.*失敗/);
    assert.doesNotMatch(message, /private-key/);
});

test('prevents overlapping requests and allows a later request after finish', () => {
    const changes = [];
    const controller = createRequestController((busy, label) => changes.push({ busy, label }));

    assert.equal(controller.begin('第一個請求'), true);
    assert.equal(controller.begin('重複請求'), false);
    assert.equal(controller.isBusy(), true);
    controller.finish();
    assert.equal(controller.isBusy(), false);
    assert.equal(controller.begin('下一個請求'), true);
    assert.deepEqual(changes, [
        { busy: true, label: '第一個請求' },
        { busy: false, label: '' },
        { busy: true, label: '下一個請求' }
    ]);
});
