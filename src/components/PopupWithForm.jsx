import Popup from "./Popup";

export default function PopupWithForm({ name, title, buttonText, isOpen, onClose, onSubmit, children }) {
    return (
        <Popup
            name={name}
            isOpen={isOpen}
            onClose={onClose}
        >
            <form name={`${name}`} onSubmit={onSubmit} className="popup__form" noValidate>
                <h2 className="popup__title">{title}</h2>
                {children}
                <button type="submit" aria-label="Сохранить" className="button popup__save-button">
                    {buttonText}
                </button>
            </form>
        </Popup>
    )
}
