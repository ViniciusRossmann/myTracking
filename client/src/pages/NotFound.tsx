import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
                <div className="container-fluid">
                    <div className="text-center">
                        <div className="error mx-auto" data-text="404">404</div>
                        <p className="lead text-gray-800 mb-5">Página não encontrada</p>
                        <p className="text-gray-500 mb-0">Parece que você encontrou uma falha na matrix...</p>
                        <Link to='/'>&larr; Voltar para a página principal</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound;