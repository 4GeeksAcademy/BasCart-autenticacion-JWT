import React, { useEffect } from "react";
import  useGlobalReducer  from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import "../index.css";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
            return;
        }

        const getProtectedData = async () => {
            const opts = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                }
            };
            try {
                const resp = await fetch(process.env.BACKEND_URL + "/api/private", opts);
                const data = await resp.json();

                if (resp.status === 200) {
                    dispatch({ type: "SET_MESSAGE", payload: data.msg });
                    dispatch({ type: "SET_TOKEN", payload: { token: store.token, user: data.user } });
                } else if (resp.status === 401) {
                    dispatch({ type: "CLEAR_AUTH" });
                    dispatch({ type: "SET_MESSAGE", payload: data.msg || "Sesión expirada o inválida. Por favor, inicia sesión de nuevo." });
                    navigate("/login");
                } else {
                    dispatch({ type: "SET_MESSAGE", payload: data.msg || "Error al obtener datos protegidos." });
                }
            } catch (error) {
                console.error("Error al obtener datos protegidos:", error);
                dispatch({ type: "SET_MESSAGE", payload: "No se pudo conectar con el servidor para obtener datos protegidos." });
            }
        };
        getProtectedData(); 
    }, [store.token, navigate, dispatch]); 

    return (
        <div className="text-center mt-5">
            {store.token ? (
                <>
                    <h1>¡Bienvenido a tu página privada!</h1>
                    <p>Este contenido solo es visible para usuarios autenticados.</p>
                    {store.message && <p className="alert alert-info">{store.message}</p>}
                    {store.currentUser && <p>Tu email es: {store.currentUser.email}</p>}
                </>
            ) : (
                <h1>Acceso Denegado</h1>
            )}
        </div>
    );
};