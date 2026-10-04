import test from 'node:test';
import assert from 'node:assert/strict';
import { extractGeneratedImage, toImageDataUrl } from '../image-response.mjs';

test('extracts a generated image part while ignoring thought images', () => {
    const image = extractGeneratedImage({
        candidates: [{
            content: {
                parts: [
                    { thought: true, inlineData: { mimeType: 'image/png', data: 'thought-image' } },
                    { text: 'Final image' },
                    { inlineData: { mimeType: 'image/png', data: 'final-image' } }
                ]
            }
        }]
    });

    assert.deepEqual(image, { mimeType: 'image/png', data: 'final-image' });
});

test('returns null when the response has no usable generated image', () => {
    assert.equal(extractGeneratedImage(null), null);
    assert.equal(extractGeneratedImage({ candidates: [{ content: { parts: [{ text: 'No image' }] } }] }), null);
    assert.equal(extractGeneratedImage({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'text/plain', data: 'text' } }] } }] }), null);
});

test('creates a data URL using the returned image MIME type', () => {
    assert.equal(toImageDataUrl({ mimeType: 'image/webp', data: 'aW1hZ2U=' }), 'data:image/webp;base64,aW1hZ2U=');
});
