import React from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";


export default function ProtectedRouteElement({ loggedIn, isLoadingUserAuth, children  }) {
    // Пока происходит проверка авторизации показывает спиннер,
    // чтобы не мелькала форма логина
    if (!isLoadingUserAuth) {
        return <Spinner className="spinner" />
    }

    return (
        loggedIn ? children : <Navigate to="/signin" replace/>
    )
}
