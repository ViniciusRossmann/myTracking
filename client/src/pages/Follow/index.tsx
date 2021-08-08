import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Redirect, Route } from "react-router";
import TopBar from '../../components/TopBar';
import { Map } from "../../components/map";
import socketIOClient from "socket.io-client";

import url from '../../services/url'
import Position from "../../interfaces/Position";

type FollowParams = {
    deliveryId: string;
};

const Follow: React.FC = (props) => {
    const { deliveryId } = useParams<FollowParams>();
    const [auth, setAuth]: any = useState(true);
    const [positions, setPositions] = useState<Position[]>([]);

    useEffect(() => {
        const loggedin = Boolean(localStorage.getItem('loggedin'));
        setAuth(loggedin);
        if (loggedin){
            const socket = socketIOClient(url, {query: {delivery: deliveryId}});
            socket.on("update_location", data => {
                setPositions([data]);
            });
        }
        document.body.setAttribute("class", "");
    }, [])

    if (auth == null) return (
        null
    )
    else if (!auth) return (
        <Redirect to="/acessar" />
    )
    else return (
        <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
                <TopBar title="Acompanhar" />

                <div className="container-fluid" style={{width: '550px'}}>
                    <Map positions={positions}/>
                </div>

            </div>
        </div>
    )
}

export default Follow;