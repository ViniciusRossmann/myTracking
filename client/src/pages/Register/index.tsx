import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import User from '../../interfaces/User';
const requests = require('../../services/requests');

const Register: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [loginError, setLoginError] = useState('');

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
        if (!validateData()) return;
        var user: User = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }
        requests.register(user, (status: string, msg: string)=>{
            if (status){
                requests.login(user.email, user.password, (status: string, msg: string)=>{
                    if (status) history.push('/');
                    else history.push('/acessar');
                });
            }
            else setLoginError(msg);
        });
    }

    function validateData(){
        console.log("valida")
        if (formData.password !== formData.password2){
            setLoginError("As senhas informadas não conferem!");
            return false;
        }
        if (formData.name==="" || formData.email==="" || formData.password===""){
            setLoginError("Preencha todos os campos!");
            return false;
        }
        if (!validateEmail(formData.email)){
            setLoginError("Informe um endereço de email válido!");
            return false;
        }
        return true;
    }

    function validateEmail(email: string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-7 col-lg-12 col-md-9">

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
                                    <h5 className="text-gray-900 mb-4">Informe seus dados cadastrais:</h5>
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className='form-control form-control-user'
                                            onChange={handleInputChange}
                                            placeholder='Nome'
                                        />
                                    </div>
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
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                className='form-control form-control-user'
                                                onChange={handleInputChange}
                                                placeholder='Senha'
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <input
                                                type="password"
                                                name="password2"
                                                id="password2"
                                                className='form-control form-control-user'
                                                onChange={handleInputChange}
                                                placeholder='Repetir senha'
                                            />
                                        </div>
                                    </div>
                                    <div className="centered">Já é cadastrado? <Link to="/acessar">Fazer login</Link></div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block btEnter">Cadastrar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;