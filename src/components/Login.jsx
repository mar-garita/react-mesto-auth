import React from "react";


export default function Login({ onLogin }) {
    const [userData, setUserData] = React.useState({});

    // Обработчик события onSubmit
    function handleSubmit(evt) {
        evt.preventDefault();
        onLogin(userData);
    }

    // Управляет инпутами
    function handleChange(evt) {
        const {name, value} = evt.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    return(
        <section className="auth">
            <h2 className="auth__title">Вход</h2>
            <form
                className="auth__form"
                onSubmit={handleSubmit}
            >
                <input
                    id="email"
                    name="email"
                    type="text"
                    className="auth__input"
                    placeholder="Email"
                    required
                    value={userData.email || ""}
                    onChange={handleChange}
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="auth__input"
                    placeholder="Пароль"
                    required
                    value={userData.password || ""}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="button auth__button"
                >
                    Войти
                </button>
            </form>
        </section>
    );
}
