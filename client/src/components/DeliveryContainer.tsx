import { Link } from 'react-router-dom';
import * as types from '../types/interfaces';
const requests = require('../services/requests');

const descStatus: { [key: number]: string } = {
    0: 'Não iniciada',
    1: 'Em andamento',
    2: 'Finalizada',
    3: 'Cancelada'
}

export default function DeliveryContainer(props: types.DeliveryContainerProps) {
    return (
        <div className="col-lg-4">
            <div className="card shadow mb-4">
                <div className="card-header py-3 ">
                    <h6 className="m-0 font-weight-bold text-primary">{props.delivery.description}</h6>
                </div>
                <div className="card-body">
                    <p>Entregador: {props.delivery.driver.name}</p>
                    <p>Status: {descStatus[props.delivery.status]}</p>
                    {props.delivery.status === 1 ? (
                        <Link to={`/follow/${props.delivery._id}`} className="btn btn-info btn-icon-split" >
                            <span className="icon text-white-50">
                                <i className="fas fa-map-marker-alt"></i>
                            </span>
                            <span className="text">Acompanhar</span>
                        </Link>
                    ) : (null)
                    }

                </div>
            </div>
        </div>
        //<Link to={`/follow/${props.delivery._id}`}>{props.delivery.description}</Link>
    );
}