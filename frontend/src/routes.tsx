import { Route, BrowserRouter, Switch } from 'react-router-dom';
import React from 'react';
import { Redirect } from "react-router";
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Follow from './pages/Follow';
import NotFound from './pages/NotFound';

const src: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Home} path="/" exact />
        <Route component={Login} path="/acessar" exact />
        <Route component={Register} path="/cadastro" exact />
        <Route component={Follow} path="/follow/:deliveryId" />
        <Route component={NotFound} path="/404"/>
        <Redirect to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default src;