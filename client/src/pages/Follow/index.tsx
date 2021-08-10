import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Redirect } from "react-router";
import TopBar from '../../components/TopBar';
import { Map } from "../../components/map";
import socketIOClient from "socket.io-client";
import url from '../../services/url'
import * as types from '../../types/interfaces';
const requests = require('../../services/requests');

const Follow: React.FC = () => {
    const history = useHistory();
    const { deliveryId } = useParams<types.FollowParams>();
    const [auth, setAuth] = useState<boolean>(true);
    const [pageTitle, setPageTitle] = useState<string>("Acompanhar viagem")
    const [positions, setPositions] = useState<types.Position[]>([]);

    useEffect(() => {
        const loggedin = Boolean(localStorage.getItem('loggedin'));
        setAuth(loggedin);
        if (loggedin){
            loadDelivery();
        }
        document.body.setAttribute("class", "");
    }, [])

    const loadDelivery = async () =>{
        let delivery: types.Delivery = await requests.getDelivery(deliveryId);
        if (delivery === null){
            history.push('/');
            return;
        }
        setPageTitle(delivery.description);
        if (delivery.position) setPositions([delivery.position]);
        const socket = socketIOClient(url, {query: {delivery: deliveryId}});
        socket.on("update_location", data => {
            setPositions([data]);
        });
    }

    if (!auth) return (
        <Redirect to="/acessar" />
    )
    else return (
        <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
                <TopBar title={ pageTitle } />

                <div className="container-fluid" style={{width: '550px'}}>
                    <Map positions={positions}/>
                </div>

            </div>
        </div>
    )
}

export default Follow;