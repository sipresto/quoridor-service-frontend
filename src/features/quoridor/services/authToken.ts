const TOKEN_KEY = "gameAccessToken"

const readTokenFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("token")
}

const persistToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
}

const readStoredToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export const getToken = (): string | null => {
    const urlToken = readTokenFromUrl()

    if (urlToken) {
        persistToken(urlToken)

        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.toString())

        return urlToken
    }

    return readStoredToken()
}

export const getAuthHeaders = (): Record<string, string> => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}