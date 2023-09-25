import React from "react";
import { Link } from "react-router-dom";


export default function Register ({ onRegister }) {
    const [userData, setUserData] = React.useState({});

    // Обработчик события onSubmit
    function handleSubmit(evt) {
        evt.preventDefault();
        onRegister(userData);
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
            <h2 className="auth__title">Регистрация</h2>
            <form
                className="auth__form"
                onSubmit={handleSubmit}
            >
                <input
                    id="email"
                    name="email"
                    type="email"
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
                    Зарегистрироваться
                </button>
                <p className="auth__text">Уже зарегистрированы?&nbsp;
                    <Link className="link auth__link" to="/signin">
                        Войти
                    </Link>
                </p>

            </form>
        </section>
    );
}
