import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAttachmentList } from '../attachment-list.mjs';

class TestElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.dataset = {};
        this.attributes = {};
        this.className = '';
        this.type = '';
        this._textContent = '';
    }

    append(...nodes) {
        this.children.push(...nodes);
    }

    replaceChildren(...nodes) {
        this.children = nodes;
    }

    set textContent(value) {
        this._textContent = String(value);
        this.children = [];
    }

    get textContent() {
        return this._textContent;
    }
}

const document = { createElement: (tagName) => new TestElement(tagName) };

test('renders a filename containing HTML as text instead of markup', () => {
    const container = new TestElement('div');
    const filename = '<img src=x onerror=alert(1)>.png';

    renderAttachmentList(document, container, [{ name: filename, size: 128 }]);

    const [row] = container.children;
    const [icon, filenameLabel, removeButton] = row.children;
    assert.equal(row.tagName, 'div');
    assert.equal(icon.tagName, 'span');
    assert.equal(filenameLabel.tagName, 'span');
    assert.equal(filenameLabel.textContent, `${filename} (0.1 KB)`);
    assert.equal(removeButton.dataset.removeFile, '0');
});
