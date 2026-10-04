export const extractGeneratedImage = (response) => {
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return null;

    const imagePart = parts.find((part) =>
        !part.thought &&
        typeof part.inlineData?.mimeType === 'string' &&
        part.inlineData.mimeType.startsWith('image/') &&
        typeof part.inlineData.data === 'string' &&
        part.inlineData.data.length > 0
    );

    if (!imagePart) return null;

    return {
        mimeType: imagePart.inlineData.mimeType,
        data: imagePart.inlineData.data
    };
};

export const toImageDataUrl = ({ mimeType, data }) => `data:${mimeType};base64,${data}`;
