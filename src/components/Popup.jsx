import React from "react";


export default function Popup({ name, isOpen, onClose, children }) {
    React.useEffect(() => {
        const handleCloseEscape = (evt) => {
            if (evt.key === 'Escape') {
                onClose();
            }
        };
        isOpen && document.addEventListener('keydown', handleCloseEscape);
        return () => document.removeEventListener('keydown', handleCloseEscape);
    }, [isOpen, onClose]);

    const handleCloseOverlay = (evt) => {
        if (evt.target === evt.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            onClick={handleCloseOverlay}
            className={`popup popup_${name} ${isOpen && 'popup_opened'}`}
        >
            <div className="popup__container">
                {children}
                <button
                    type="button"
                    aria-label="Закрыть"
                    id="close-add-popup-button"
                    className="button popup__close-button"
                    onClick={onClose}
                />
            </div>
        </div>
    )
}
