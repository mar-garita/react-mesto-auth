const TOKEN_KEY = 'jwt';

// Устанавливает токен в Local storage
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token.token)
}

// Получает токен из Local storage
export const getToken = () => localStorage.getItem(TOKEN_KEY)

// Удаляет токен из Local storage
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}
