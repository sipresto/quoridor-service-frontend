const TOKEN_KEY = "gameAccessToken"

const readTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    console.log('readTokenFromUrl - token found:', !!token);
    if (token) {
        console.log('Token length:', token.length);
    }

    return token;
}

const persistToken = (token: string) => {
    console.log('Persisting token to localStorage, length:', token.length);
    localStorage.setItem(TOKEN_KEY, token);
}

const readStoredToken = () => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    console.log('readStoredToken - found:', !!token, 'length:', token?.length);
    return token;
}

export const getToken = (): string | null => {
    console.log('getToken called');
    const urlToken = readTokenFromUrl();

    if (urlToken) {
        console.log('Using URL token');
        persistToken(urlToken);

        // Clean URL by removing token parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());

        return urlToken;
    }

    console.log('Using stored token');
    return readStoredToken();
}

export const getAuthHeaders = () => {
    const token = getToken();
    console.log('getAuthHeaders - token present:', !!token);
    return token ? { Authorization: `Bearer ${token}` } : {};
}