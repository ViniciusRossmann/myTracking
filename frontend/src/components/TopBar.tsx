import { Link } from 'react-router-dom';
import * as types from '../types/interfaces';
const requests = require('../services/requests');

export default function TopBar(props: types.TopBarProps) {

    const logout = async () => {
        await requests.logout();
        localStorage.clear();
        window.location.reload();
    }

    const onNavigateHome = () => {
        if (props.onNavigateHome) {
            props.onNavigateHome();
        }
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
            <div className="rounded-circle mr-3">
                <Link to="/" onClick={onNavigateHome}>
                    <img alt="" height="60" src="/img/logo.png" />
                </Link>
            </div>
            <h1 className="h3 mb-0 text-gray-800">{props.title}</h1>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600">{localStorage.getItem("user-name")}</span>
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