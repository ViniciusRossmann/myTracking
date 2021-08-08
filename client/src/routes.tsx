import { Route, BrowserRouter } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Follow from './pages/Follow';

const src: React.FC = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={Login} path="/acessar" exact />
      <Route component={Register} path="/cadastro" exact />
      <Route component={Follow} path="/follow/:deliveryId" />
    </BrowserRouter>
  )
}

export default src;