import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Redirect, Route } from "react-router";
import api from '../../services/api';

interface deliver {
    _id: string,
    cliente: string,
    cpf: string,
    cep: string,
    status: string,
    latitude: string,
    longitude: string
}

const Home: React.FC = () => {
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState({nome: ""});
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchAPI() {
            var res = await api.post('/current-session', {}, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
            setAuth(res.data.status);
            if(res.data.status){
                setUser(res.data.user);
                res = await api.post('/get-deliveries', {}, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
                setItems(res.data.data);
            }
        }
        document.body.setAttribute("class", "");
        fetchAPI()
    }, [])

    const logout = () => {
        api.post('/logout', {}, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
        window.location.reload();
    }

    if (auth == null) return (
        null
    )
    else if (!auth) return (
        <Redirect to="/acessar" />
    )
    else return (
        <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                        <i className="fa fa-bars"></i>
                    </button>
                    <h1 className="h3 mb-0 text-gray-800">Acompanhe o envio das suas encomendas</h1>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-gray-600">{user.nome}</span>
                                <img className="img-profile rounded-circle"
                                    src="/img/undraw_profile.svg"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                                <a className="dropdown-item" onClick={() => {logout()}}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Sair
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>

                <div className="container-fluid">
                    <ul>
                        {items.map((item: deliver) => 
                            <div>{item._id} | {item.status}</div>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Home;