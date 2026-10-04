export const CATEGORY_OPTIONS = {
    MANGA: [
        {
            key: 'mangaLayout',
            title: '漫畫格式',
            defaultValue: 'SINGLE',
            options: [
                { value: 'SINGLE', label: '單幅', prompt: '版面：單幅完整插畫，單一主場景。' },
                { value: 'FOUR_PANEL', label: '四格', prompt: '版面：四格漫畫，格線清楚並呈現起承轉合。' },
                { value: 'SIX_PANEL', label: '六格', prompt: '版面：六格漫畫，格線清楚並依序推進情節。' },
                { value: 'COVER', label: '封面', prompt: '版面：漫畫單行本封面，主標題區清楚並突出主角。' }
            ]
        },
        {
            key: 'mangaStyle',
            title: '畫風流派',
            defaultValue: 'JAPANESE',
            options: [
                { value: 'JAPANESE', label: '日系', prompt: '風格：日系漫畫線條與網點質感。' },
                { value: 'AMERICAN', label: '美式', prompt: '風格：美式漫畫，粗獷輪廓與強烈明暗。' },
                { value: 'KOREAN', label: '韓漫', prompt: '風格：韓式網路漫畫，全彩且線條俐落。' },
                { value: 'PIXEL', label: '像素', prompt: '風格：像素漫畫，以清楚可辨的像素塊塑形。' }
            ]
        },
        {
            key: 'mangaColor',
            title: '色彩',
            defaultValue: 'BW',
            options: [
                { value: 'BW', label: '黑白', prompt: '色彩：黑白漫畫，以線稿、網點與明暗對比呈現，不使用彩色。' },
                { value: 'COLOR', label: '全彩', prompt: '色彩：全彩漫畫，使用清晰分層的色彩呈現。' }
            ]
        }
    ],
    LINE_STICKER: [
        {
            key: 'stickerLayout',
            title: '貼圖數量',
            defaultValue: 'SINGLE',
            options: [
                { value: 'SINGLE', label: '單張 (1)', prompt: '版面：製作一張置中的 LINE 貼圖，保留透明背景並避免白色外框。' },
                { value: 'SET', label: '套組 (8)', prompt: '版面：製作八張排列整齊的 LINE 貼圖，各有不同表情與繁體中文短句，避免白色外框。' }
            ]
        }
    ],
    ADVERTISEMENT: [
        {
            key: 'adMode',
            title: '拍攝模式',
            defaultValue: 'PODIUM',
            options: [
                { value: 'PODIUM', label: '展示台', prompt: '拍攝模式：產品置於簡潔展示台，呈現棚拍光線與材質細節。' },
                { value: 'HAND_MODEL', label: '手模', prompt: '拍攝模式：以手部自然展示產品，呈現真實膚質並保持產品清晰。' },
                { value: 'FULL_MODEL', label: '模特兒', prompt: '拍攝模式：模特兒在符合產品情境的場景中展示產品。' }
            ]
        }
    ],
    CINEMATIC_3D: [
        {
            key: 'cinematicStyle',
            title: '渲染風格',
            defaultValue: 'HYPER_REALISTIC',
            options: [
                { value: 'HYPER_REALISTIC', label: '極致寫實', prompt: '風格：極致寫實材質與細膩光影。' },
                { value: 'DISNEY', label: '迪士尼', prompt: '風格：迪士尼動畫質感、柔和光線與鮮明表情；不要混入寫實照片風格。' },
                { value: 'PIXAR', label: '皮克斯', prompt: '風格：皮克斯式 3D 動畫造型、柔和光影；不要混入寫實照片風格。' },
                { value: 'CYBERPUNK', label: '賽博龐克', prompt: '風格：賽博龐克場景、霓虹燈光與高科技細節。' }
            ]
        }
    ],
    COPYWRITING: [
        {
            key: 'copywritingMode',
            title: '文案用途',
            defaultValue: 'SOCIAL_MEDIA',
            options: [
                { value: 'SOCIAL_MEDIA', label: '社群貼文', prompt: '用途：社群貼文，提供吸引人的開頭、易讀段落及適合的行動呼籲。' },
                { value: 'AD_COPY', label: '廣告文案', prompt: '用途：廣告文案，聚焦受眾需求、產品價值與明確行動呼籲。' }
            ]
        },
        {
            key: 'copywritingTone',
            title: '文案語氣',
            defaultValue: 'PROFESSIONAL',
            options: [
                { value: 'PROFESSIONAL', label: '專業', prompt: '語氣：專業、清楚且可信。' },
                { value: 'CASUAL', label: '親切', prompt: '語氣：親切自然、像與讀者直接對話。' },
                { value: 'HUMOROUS', label: '幽默', prompt: '語氣：輕鬆幽默，但不偏離主題與品牌情境。' }
            ]
        }
    ]
};

export const CATEGORY_OPTION_DEFAULTS = Object.fromEntries(
    Object.values(CATEGORY_OPTIONS).flatMap((groups) =>
        groups.map((group) => [group.key, group.defaultValue])
    )
);

export const getCategoryInstructions = (categoryId, options = {}) => {
    const groups = CATEGORY_OPTIONS[categoryId] || [];
    return groups.map((group) => {
        const selected = group.options.find((option) => option.value === options[group.key])
            || group.options.find((option) => option.value === group.defaultValue);
        return selected?.prompt || '';
    }).filter(Boolean).join('\n');
};
