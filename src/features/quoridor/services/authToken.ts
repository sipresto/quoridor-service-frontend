const TOKEN_KEY = "gameAccessToken"

const readTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("token")
}

const persistToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

const readStoredToken = () => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export const getToken = (): string | null => {
    const urlToken = readTokenFromUrl()
    if (urlToken) {
        persistToken(urlToken)
        return urlToken
    }
    return readStoredToken()
}

export const getAuthHeaders = () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

