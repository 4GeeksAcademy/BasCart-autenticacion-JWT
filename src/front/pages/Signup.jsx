import React, { useState } from "react";
import  useGlobalReducer  from "../hooks/useGlobalReducer"; 
import { useNavigate } from "react-router-dom";
import "../index.css"; 

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Signup = () => {
    const { store, dispatch } = useGlobalReducer(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        };

        try {
            const resp = await fetch(`${API_URL}/api/register`, opts);
            const data = await resp.json();

            if (resp.status === 201) {
                
                dispatch({ type: "SET_MESSAGE", payload: data.msg || "Registro exitoso. ¡Ahora puedes iniciar sesión!" });
                navigate("/login"); 
            } else {
                
                dispatch({ type: "SET_MESSAGE", payload: data.msg || "Error al registrarse. Inténtalo de nuevo." });
            }
        } catch (error) {
            console.error("Error al registrarse:", error);
            dispatch({ type: "SET_MESSAGE", payload: "No se pudo conectar con el servidor." });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>Registro de Usuario</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="emailInput"
                                        placeholder="Tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        placeholder="Tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Registrarse</button>
                                </div>
                            </form>
                            {store.message && <div className="alert alert-info mt-3">{store.message}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};