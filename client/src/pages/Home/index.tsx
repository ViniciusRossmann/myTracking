import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router";
import TopBar from '../../components/TopBar';
import * as types from '../../types/interfaces';
const requests = require('../../services/requests');

const Home: React.FC = () => {
    const [auth, setAuth] = useState<boolean>(true);
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

    if (!auth) return (
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