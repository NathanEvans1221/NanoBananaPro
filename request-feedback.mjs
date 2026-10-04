export const getRequestErrorMessage = (error, operation) => {
    const details = [error?.status, error?.code, error?.message].filter(Boolean).join(' ').toLowerCase();

    if (/\b401\b|\b403\b|api[_ -]?key|unauthori[sz]ed|permission denied/.test(details)) {
        return '金鑰無效或目前沒有使用此模型的權限，請檢查 API Key 與模型存取設定。';
    }
    if (/\b429\b|quota|resource_exhausted|rate.?limit/.test(details)) {
        return '已達 API 使用配額或頻率限制，請稍後再試或檢查帳戶用量。';
    }
    if (error instanceof TypeError || /network|failed to fetch|connection|timeout/.test(details)) {
        return '無法連線至 Gemini API，請檢查網路後重試。';
    }

    return operation === 'image'
        ? '圖片生成失敗，請稍後重試並確認模型設定。'
        : '提示詞產生失敗，請稍後重試。';
};

export const createRequestController = (onChange = () => {}) => {
    let busy = false;

    return {
        begin(label) {
            if (busy) return false;
            busy = true;
            onChange(true, label);
            return true;
        },
        finish() {
            if (!busy) return;
            busy = false;
            onChange(false, '');
        },
        isBusy() {
            return busy;
        }
    };
};
