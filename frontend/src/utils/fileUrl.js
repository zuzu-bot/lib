const apiBaseUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const resolveFileUrl = (filePath) => {
    if (!filePath) return '#';
    if (/^https?:\/\//i.test(filePath)) return filePath;

    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
};
