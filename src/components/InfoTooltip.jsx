import React from "react";
import Popup from "./Popup";
import IconAuthPositive from "../images/auth_positive.svg?react";
import IconAuthNegative from "../images/auth_negative.svg?react";


export default function InfoTooltip({ isOpen, onClose, errorMessage }) {
    return (
        <Popup
            name="info-tooltip"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="popup-info">
                {errorMessage ? <IconAuthNegative /> : <IconAuthPositive />}
                <h2 className="popup-info__title">
                    {!errorMessage ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
                </h2>
            </div>
        </Popup>
    )
}
