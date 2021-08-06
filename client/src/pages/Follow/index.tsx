import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Redirect, Route } from "react-router";
import TopBar from '../../components/TopBar';
import { Map } from "../../components/map";

import Position from "../../interfaces/Position";

const Follow: React.FC = () => {
    const [auth, setAuth]: any = useState(true);
    const [positions, setPositions] = useState<Position[]>([{lat: -40.356023, long: -20.355142}]);

    useEffect(() => {
        const loggedin = Boolean(localStorage.getItem('loggedin'));
        setAuth(loggedin);
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