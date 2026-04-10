const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const googleClientId = (rawGoogleClientId || '')
    .toString()
    .trim()
    .replace(/^['\"]|['\"]$/g, '');

export const isGoogleAuthEnabled = googleClientId.length > 0;
