import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Redirect } from "react-router";
import TopBar from '../../components/TopBar';
import { Map } from "../../components/map";
import socketIOClient from "socket.io-client";
import url from '../../services/url'
import * as types from '../../types/interfaces';
import { coord } from "../../components/map/map-types";
const requests = require('../../services/requests');

const Follow: React.FC = () => {
    const history = useHistory();
    const { deliveryId } = useParams<types.FollowParams>();
    const [auth, setAuth] = useState<boolean>(true);
    const [pageTitle, setPageTitle] = useState<string>("Acompanhar viagem")
    const [positions, setPositions] = useState<types.Location[]>([]);
    const [mapZoom, setMapZoom] = useState<number>(13);
    const [mapCenter, setMapCenter] = useState<coord>();

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
        if (delivery.location) {
            setMapCenter({latitude: delivery.location.coords.latitude, longitude: delivery.location.coords.longitude});
            setPositions([delivery.location]);
        }
        const socket = socketIOClient(url, {query: {delivery: deliveryId}});
        socket.on("update_location", data => {
            if(positions.length===0){
                setMapCenter({latitude: data.coords.latitude, longitude: data.coords.longitude});
            }
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

        
        
                    <Map zoom={mapZoom} center={mapCenter} positions={positions}/>
            
            

            </div>
        </div>
    )
}

export default Follow;