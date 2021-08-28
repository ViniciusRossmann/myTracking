import { Request } from 'express';

interface Coords{
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
}

interface Location{
    coords: Coords;
    mocked?: boolean;
    timestamp: number;
}

interface SessionUser{
    type: string; //'user' or 'driver'
    _id: string;
    name: string;
    email: string;
} 

interface RequestWithSession extends Request {
    user?: SessionUser;
}

export {
    Location,
    RequestWithSession
}