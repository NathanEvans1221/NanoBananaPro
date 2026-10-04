import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildAttachmentParts,
    processAttachments,
    validateAttachmentFiles
} from '../attachments.mjs';

const makeFile = ({ name = 'file.png', type = 'image/png', size = 4, text = '', bytes = [1, 2, 3, 4] } = {}) => ({
    name,
    type,
    size,
    text: async () => text,
    arrayBuffer: async () => Uint8Array.from(bytes).buffer
});

test('accepts supported images, plain text, and PDF within count and size limits', () => {
    const result = validateAttachmentFiles([
        makeFile(),
        makeFile({ name: 'notes.txt', type: 'text/plain' }),
        makeFile({ name: 'guide.pdf', type: 'application/pdf' })
    ]);

    assert.deepEqual(result, { valid: true, error: '' });
});

test('rejects unsupported types, empty files, oversized files, and too many attachments', () => {
    assert.equal(validateAttachmentFiles([makeFile({ name: 'page.html', type: 'text/html' })]).valid, false);
    assert.equal(validateAttachmentFiles([makeFile({ size: 0 })]).valid, false);
    assert.equal(validateAttachmentFiles([makeFile({ size: 10 * 1024 * 1024 + 1 })]).valid, false);
    assert.equal(validateAttachmentFiles(Array.from({ length: 6 }, () => makeFile())).valid, false);
});

test('enforces the total attachment size including files already selected', () => {
    const existing = [{ name: 'existing.png', mimeType: 'image/png', size: 8 * 1024 * 1024, data: 'data' }];
    const result = validateAttachmentFiles([makeFile({ size: 5 * 1024 * 1024 })], existing);

    assert.equal(result.valid, false);
});

test('converts text files to text parts and image/PDF files to inline data parts', async () => {
    const processed = await processAttachments([
        makeFile({ name: 'notes.txt', type: 'text/plain', text: 'Use warm colors.' }),
        makeFile({ name: 'reference.png', type: 'image/png' }),
        makeFile({ name: 'guide.pdf', type: 'application/pdf' })
    ]);

    assert.deepEqual(buildAttachmentParts(processed), [
        { text: '\n[附件：notes.txt]\nUse warm colors.' },
        { inlineData: { mimeType: 'image/png', data: 'AQIDBA==' } },
        { inlineData: { mimeType: 'application/pdf', data: 'AQIDBA==' } }
    ]);
});
