import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Redirect, Route } from "react-router";
import TopBar from '../../components/TopBar';
import * as types from '../../interfaces/interfaces';
const requests = require('../../services/requests');

const Home: React.FC = () => {
    const [auth, setAuth]: any = useState(null);
    const [user, setUser] = useState({nome: ""});
    const [items, setItems] = useState<types.Delivery[]>([]);

    useEffect(() => {
        const loggedin = Boolean(localStorage.getItem('loggedin'));
        setAuth(loggedin);
        document.body.setAttribute("class", "");
        if (loggedin) loadDeliveries();
    }, [])

    const loadDeliveries = async () => {
        var data: types.Delivery[] = await requests.getDeliveries();
        setItems(data);
    }

    const logout = () => {
        localStorage.clear();
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
                <TopBar title="myTracking" />

                <div className="container-fluid">
                    <ul>
                        {items.map((item: types.Delivery) => 
                            <div key={item._id}>{item._id} | {item.description}</div>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Home;