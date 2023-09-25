class ApiAuth {
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
    }

    // Проверяет ответ от сервера и преобразует его из json
    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json();
    }

    register({ password, email }) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then(res => this._getResponseData(res))
    };

    authorize({ email, password }) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => this._getResponseData(res))
    };

    // Отправляет запрос на сервер с токеном, который хранится в локальном хранилище
    // и если вернется пользователь, то он запишется в стейт
    getContent(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => this._getResponseData(res))
    }
}

export const apiAuth = new ApiAuth("https://auth.nomoreparties.co");
