import { Route, BrowserRouter } from 'react-router-dom';
import React from 'react';
import Acessar from './pages/Acessar';
import Home from './pages/Home';

const src: React.FC = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={Acessar} path="/acessar" exact />
    </BrowserRouter>
  )
}

export default src;