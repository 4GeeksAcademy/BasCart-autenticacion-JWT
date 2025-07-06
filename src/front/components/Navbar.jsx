import React from "react";
import { Link, useNavigate } from "react-router-dom";
import  useGlobalReducer  from "../hooks/useGlobalReducer"; 

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "CLEAR_AUTH" });
        navigate("/login"); 
    };

    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <Link to="/">
                <span className="navbar-brand mb-0 h1 ms-3">React Flask Boilerplate</span>
            </Link>
            <div className="ml-auto">
                {!store.token ? ( 
                    <>
                        <Link to="/signup">
                            <button className="btn btn-primary me-2">Registro</button>
                        </Link>
                        <Link to="/login">
                            <button className="btn btn-success me-2">Iniciar Sesión</button>
                        </Link>
                    </>
                ) : ( 
                    <button onClick={handleLogout} className="btn btn-danger me-2">
                        Cerrar Sesión
                    </button>
                )}
            </div>
        </nav>
    );
};