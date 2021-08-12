import React from 'react';
import * as types from '../types/interfaces';

const logout = (): void => {
    localStorage.clear();
    window.location.reload();
}

export default function TopBar(props: types.TopBarProps){
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>
            <h1 className="h3 mb-0 text-gray-800">{props.title}</h1>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600">Nome</span>
                        <img className="img-profile rounded-circle"
                            src="/img/undraw_profile.svg" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        <a className="dropdown-item" onClick={logout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Sair
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    );
}