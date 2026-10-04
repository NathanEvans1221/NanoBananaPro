export const MAX_ATTACHMENT_COUNT = 5;
export const MAX_ATTACHMENT_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENT_TOTAL_BYTES = 12 * 1024 * 1024;

const getAttachmentKind = (file) => {
    const mimeType = (file.mimeType || file.type || '').toLowerCase();
    if (['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) return 'image';
    if (mimeType === 'application/pdf') return 'document';
    if (mimeType === 'text/plain' || (!mimeType && /\.txt$/i.test(file.name))) return 'text';
    return '';
};

export const validateAttachmentFiles = (files, existingAttachments = []) => {
    const allFiles = [...existingAttachments, ...files];
    if (allFiles.length > MAX_ATTACHMENT_COUNT) {
        return { valid: false, error: `最多可上傳 ${MAX_ATTACHMENT_COUNT} 個附件。` };
    }

    for (const file of files) {
        if (!getAttachmentKind(file)) {
            return { valid: false, error: `不支援的檔案格式：${file.name}` };
        }
        if (!Number.isFinite(file.size) || file.size <= 0) {
            return { valid: false, error: `檔案不可為空：${file.name}` };
        }
        if (file.size > MAX_ATTACHMENT_FILE_BYTES) {
            return { valid: false, error: `單一檔案不可超過 10 MB：${file.name}` };
        }
    }

    const totalBytes = allFiles.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_ATTACHMENT_TOTAL_BYTES) {
        return { valid: false, error: '附件總大小不可超過 12 MB。' };
    }

    return { valid: true, error: '' };
};

const toBase64 = (bytes) => {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
};

export const processAttachments = async (files) => Promise.all(files.map(async (file) => {
    const kind = getAttachmentKind(file);
    if (kind === 'text') {
        return { kind, name: file.name, size: file.size, text: await file.text() };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    return {
        kind,
        name: file.name,
        mimeType: kind === 'document' ? 'application/pdf' : (file.mimeType || file.type).toLowerCase(),
        size: file.size,
        data: toBase64(bytes)
    };
}));

export const buildAttachmentParts = (attachments) => attachments.map((attachment) => {
    if (attachment.kind === 'text') {
        return { text: `\n[附件：${attachment.name}]\n${attachment.text}` };
    }
    return {
        inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.data
        }
    };
});
