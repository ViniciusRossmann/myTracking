import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router";
import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import DeliveryContainer from '../../components/DeliveryContainer';
import * as types from '../../types/interfaces';
const requests = require('../../services/requests');

const Home: React.FC = () => {
    const [auth, setAuth] = useState<boolean>(true);
    const [items, setItems] = useState<types.Delivery[]>([]);

    useEffect(() => {
        document.body.setAttribute("class", "");
        const loggedin = Boolean(localStorage.getItem('loggedin'));
        setAuth(loggedin);
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
                    <div className="d-sm-flex align-items-center justify-content-between mb-2">
                        <h1 className="h3 mb-0 text-gray-800">Seus rastreamentos:</h1>
                    </div>

                    <ul className="row" style={{padding: '0px'}}>
                        {items.map((item: types.Delivery) =>
                            <DeliveryContainer delivery={item} />
                        )}
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default Home;