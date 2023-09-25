import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

import { api } from "../utils/Api";
import { apiAuth } from "../utils/ApiAuth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { getToken, removeToken, setToken } from "../utils/token";


export default function App() {
    // ----------------------------- Переменные состояния ---------------------------- //

    // Отвечают за видимость попапов с формой
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);

    // Отвечает за видимость попапа с картинкой
    const [selectedCard, setSelectedCard] = React.useState(null);

    // Индикатор загрузки запросов для кнопки сабмита в попапах
    const [isLoadingAddPlace, setIsLoadingAddPlace] = React.useState(false);
    const [isLoadingEditAvatar, setIsLoadingEditAvatar] = React.useState(false);
    const [isLoadingEditProfile, setIsLoadingEditProfile] = React.useState(false);

    const [isLoadingContent, setIsLoadingContent] = React.useState(false);
    const [isLoadingUserAuth, setIsLoadingUserAuth] = React.useState(false);

    // Отвечает за информацию о пользователе
    const [currentUser, setCurrentUser] = React.useState({});
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');

    // Отвечает за список карточек
    const [cards, setCards] = React.useState([]);
    // Отвечает за карточку, выбранную для удаления
    const [cardToDelete, setCardToDelete] = React.useState({});

    // Ошибка при регистрации/ авторизации
    const [authErrorMessage, setAuthErrorMessage] = React.useState(false);

    // Мобильное меню
    const [menuIsOpen, setMenuIsOpen] = React.useState(false);


    // useEffect вызывает колбэк (получающий с сервера данные пользователя и данные карточек)
    // после того, как компонент App будет смонтирован
    React.useEffect(() => {
        setIsLoadingContent(true);
        Promise.all([
            api.getInitialCards(),
            api.getUserInfo()
        ])
            .then(([cards, user]) => {
                setCards(cards);
                setCurrentUser(user);
                setIsLoadingContent(true);
        })
            .catch(err => console.log(err))
            .finally(() => setIsLoadingContent(false));
    }, [])

    // Проверка токена
    React.useEffect(() => {
        checkToken();
    }, [])

    function checkToken() {
        const token = getToken();
        apiAuth.getContent(token)
            .then(res => {
                if (res) {
                    setIsLoadingUserAuth(true);
                    setUserLoggedIn(true);
                    setUserEmail(res.data.email);
                }
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoadingUserAuth(true));
    }

    //-------------------------------- Обработчики событий ---------------------------------- //

    // Открывают попапы с формой
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    // Открывает попап с картинкой
    function handleCardClick(card) {
        setSelectedCard(card);
    }

    // Закрывает все попапы
    function closeAllPopups() {
        setIsConfirmationPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
        setIsInfoTooltipPopupOpen(false);
    }

    // Управляет мобильным меню
    function handleMenuOpen() {
        setMenuIsOpen(!menuIsOpen);
    }

    //------------------------------------ Авторизация -------------------------------------- //

    const navigate = useNavigate();

    // Регистрация
    const onRegister = (dataRegister) => {
        apiAuth.register(dataRegister)
            .then(() => {
                setAuthErrorMessage(false);
                setIsInfoTooltipPopupOpen(true);
                navigate('/signin', { replace: true });
            })
            .catch(() => {
                setAuthErrorMessage(true);
                setIsInfoTooltipPopupOpen(true);
            });
    }

    // Авторизация
    const onLogin = (dataLogin) => {
        apiAuth.authorize(dataLogin)
            .then(data => {
                setToken(data);
                setUserLoggedIn(true);
                setUserEmail(dataLogin.email);
            })
            .catch(() => {
                setAuthErrorMessage(true);
                setIsInfoTooltipPopupOpen(true);
            });
    }

    // Логаут
    const onSignOut = () => {
        removeToken();
        setUserLoggedIn(false);
        setMenuIsOpen(false);
    };

    //------------------------------------- Карточки --------------------------------------- //

    // Добавляет новую карточку
    function handleAddPlaceSubmit(newCard) {
        // включает индикатор загрузки
        setIsLoadingAddPlace(true);
        api.createCard(newCard)
            .then(newCardData => {
                setCards([newCardData, ...cards]);
                closeAllPopups();
            })
            .catch(err => console.error(err))
            .finally(() => {
                // выключает индикатор загрузки
                setIsLoadingAddPlace(false);
            })
    }

    // Лайк/дизлайк
    function handleCardLike(card) {
        // Проверка, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(user => user._id === currentUser._id);

        // Отправка запроса в API и получение обновлённых данных карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then(newCard => {
                setCards(cards => cards.map(element => element._id === card._id ? newCard : element));
            })
            .catch(err => console.error(err));
    }

    // Открывает попап подтверждения при клике на иконку удаления карточки
    function handleDeleteCardClick(card) {
        setIsConfirmationPopupOpen(true);
        setCardToDelete(card);
    }

    // Удаляет карточку при нажатии на кнопку "Да" в попапе подтверждения
    function handleDeleteCard(card) {
        api.deleteCard(card._id)
            .then(() => {
                // Перезаписывает массив cards, в который добавляются все карточки кроме удаленной
                setCards(cards => cards.filter(element => element._id !== card._id));
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    //------------------------------------- Профиль --------------------------------------- //

    // Обновляет профиль пользователя
    function handleUpdateUser(newUserData) {
        setIsLoadingEditProfile(true);
        // newUserData – объект вида {name: 'userName', about: 'userDescription'}
        api.updateProfile(newUserData)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoadingEditProfile(false);
            })
    }

    // Обновляет аватар пользователя
    function handleUpdateAvatar(newAvatar) {
        setIsLoadingEditAvatar(true);
        // newAvatar – объект вида {avatar: 'https://pictures.com'}
        api.updateAvatar(newAvatar)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoadingEditAvatar(false);
            })
    }


    return (
        // «Внедряем» данные из contexts с помощью провайдера контекста
        <CurrentUserContext.Provider value={currentUser}>
            {/* Поддерево, в котором будет доступен контекст */}
            <div className="App">
                <div className="page">
                    <Header
                        menuIsOpen={menuIsOpen}
                        loggedIn={userLoggedIn}
                        userEmail={userEmail}
                        onLogout={onSignOut}
                        handleMenuOpen={handleMenuOpen}
                    />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute
                                    loggedIn={userLoggedIn}
                                    isLoadingUserAuth={isLoadingUserAuth}
                                >
                                    <Main
                                        onEditProfile={handleEditProfileClick}
                                        onEditAvatar={handleEditAvatarClick}
                                        onAddPlace={handleAddPlaceClick}
                                        onCardClick={handleCardClick}
                                        onCardLike={handleCardLike}
                                        onCardDelete={handleDeleteCardClick}
                                        cards={cards}
                                        isLoadingContent={isLoadingContent}
                                    />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/signin"
                            element={
                                userLoggedIn ?
                                    <Navigate to='/' replace /> :
                                    <Login onLogin={onLogin} />
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                userLoggedIn ?
                                    <Navigate to='/' replace /> :
                                    <Register onRegister={onRegister} />
                            }
                        />
                    </Routes>

                    {userLoggedIn && <Footer />}
                </div>

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    isLoading={isLoadingEditProfile}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    isLoading={isLoadingEditAvatar}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    isLoading={isLoadingAddPlace}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />
                <ConfirmationPopup
                    isOpen={isConfirmationPopupOpen}
                    onClose={closeAllPopups}
                    card={cardToDelete}
                    onCardDelete={handleDeleteCard}
                />
                <ImagePopup
                    isOpen={selectedCard}
                    card={selectedCard}
                    onClose={closeAllPopups}
                />
                <InfoTooltip
                    isOpen={isInfoTooltipPopupOpen}
                    onClose={closeAllPopups}
                    errorMessage={authErrorMessage}
                />
            </div>
        </CurrentUserContext.Provider>
    )
}
