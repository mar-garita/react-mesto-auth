import { Link, useLocation } from "react-router-dom";
import Logo from "../images/logo.svg?react";
import MenuButton from "../images/menu-icon.svg?react";
import CloseMenuButton from "../images/close_icon.svg?react";

export default function Header({ menuIsOpen, loggedIn, userEmail, onLogout, handleMenuOpen }) {
    const location = useLocation();

    return (
        <>
            {loggedIn && menuIsOpen && (
                <div className="header__container_mobile">
                    <p className="header__email">{userEmail}</p>
                    <Link to="signin" className="link header__logout" onClick={onLogout}>
                        Выйти
                    </Link>
                </div>
            )}

            <header className="header page__section">
                <div className="header__container">

                    <Logo alt="Логотип" className="logo"/>

                    <div className="header__wrapper">
                        {!loggedIn && location.pathname === "/signin" && (
                            <Link to="/signup" className="link header__link">
                                Регистрация
                            </Link>
                        )}
                        {!loggedIn && location.pathname === "/signup" && (
                            <Link to="/signin" className="link header__link">
                                Войти
                            </Link>
                        )}
                        {loggedIn && (
                            <div className="header__wrapper_desktop">
                                <p className="header__email">{userEmail}</p>
                                <Link to="signin" className="link header__logout" onClick={onLogout}>
                                    Выйти
                                </Link>
                            </div>
                        )}
                    </div>
                    {!loggedIn ? null : (menuIsOpen ?
                        <CloseMenuButton className="button header__menu-icon" onClick={handleMenuOpen} /> :
                        <MenuButton className="button header__menu-icon" onClick={handleMenuOpen} />
                    )}
                </div>
            </header>
        </>
    );
}
