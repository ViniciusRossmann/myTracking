import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import * as types from '../../types/interfaces';
const requests = require('../../services/requests');

const Login: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState<types.LoginRequest>({
        email: '',
        password: ''
    });
    const [loginError, setLoginError] = useState<string>("");

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
        if (formData.email === "" || formData.password === ""){
            setLoginError("Informe um email e senha válidos!");
            return;
        }
        requests.login(formData, (status: number, msg: string)=>{
            if(status==200) history.push('/');
            else setLoginError(msg);
        });
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
                                            name="email"
                                            id="email"
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
                                    <div className="centered">Não é cadastrado? <Link to="/cadastro">Cadastre-se</Link></div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block btEnter">Confirmar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;