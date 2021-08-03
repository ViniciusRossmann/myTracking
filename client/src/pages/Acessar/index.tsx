import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

const Acessar: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        document.body.setAttribute("class", "bg-gradient-primary");
    }, [])

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        var res = await api.post('user_auth', formData, { headers: { 'Content-Type': 'application/json' } });
        console.log(res.data);
        setLoginError(res.data.msg);
        if (res.data.status) {
            localStorage.setItem('loggedin', "true");
            localStorage.setItem('user', formData.login);
            localStorage.setItem('password', formData.password);
            localStorage.setItem('token', res.data.token);
            history.push('/');
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-12 col-md-9">

                    {loginError ? (
                        <div className="card o-hidden border-0 shadow-lg my-3" id="erro">
                            <div className="card-body p-0">
                                <div style={{ padding: "10px", color: "#ff0000", textAlign: "center" }}>
                                    <i className="fa fa-exclamation-circle" />&nbsp;
                                    <span>{loginError}</span>
                                </div>
                            </div>
                        </div>
                    ) : (null)}

                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-2"><b>Bem vindo!</b></h1>
                                    <h5 className="text-gray-900 mb-4">Acompanhe o envio das suas encomendas:</h5>
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="login"
                                            id="login"
                                            className='form-control form-control-user'
                                            onChange={handleInputChange}
                                            placeholder='Email'
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className='form-control form-control-user'
                                            onChange={handleInputChange}
                                            placeholder='Senha'
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block" style={{ marginTop: "1rem" }}>Confirmar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Acessar;