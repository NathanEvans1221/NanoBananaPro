import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORY_OPTIONS, CATEGORY_OPTION_DEFAULTS, getCategoryInstructions } from '../category-options.mjs';

test('provides matching option defaults and prompts for each selectable value', () => {
    for (const [categoryId, groups] of Object.entries(CATEGORY_OPTIONS)) {
        for (const group of groups) {
            assert.equal(CATEGORY_OPTION_DEFAULTS[group.key], group.defaultValue);
            assert.ok(group.options.length > 0);
            for (const option of group.options) {
                assert.ok(option.prompt.trim());
                assert.ok(getCategoryInstructions(categoryId, { [group.key]: option.value }).includes(option.prompt));
            }
        }
    }
});

test('includes all manga layouts, including six panels, and color treatment', () => {
    const instructions = getCategoryInstructions('MANGA', {
        mangaLayout: 'SIX_PANEL',
        mangaStyle: 'JAPANESE',
        mangaColor: 'COLOR'
    });

    assert.match(instructions, /六格/);
    assert.match(instructions, /全彩/);
});

test('selected copywriting options change the instructions sent to the model', () => {
    const instructions = getCategoryInstructions('COPYWRITING', {
        copywritingMode: 'AD_COPY',
        copywritingTone: 'CASUAL'
    });

    assert.match(instructions, /廣告文案/);
    assert.match(instructions, /親切自然/);
});

test('falls back to each group default for unknown option values', () => {
    const instructions = getCategoryInstructions('ADVERTISEMENT', { adMode: 'UNKNOWN' });

    assert.match(instructions, /展示台/);
});

test('returns no category-specific instructions for categories without options', () => {
    assert.equal(getCategoryInstructions('POSTER', {}), '');
    assert.equal(getCategoryInstructions('UNKNOWN', {}), '');
});
