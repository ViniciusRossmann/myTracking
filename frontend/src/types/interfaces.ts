export interface User {
    name: string;
    email: string;
    password: string;
    password2?: string;
}

interface Coords{
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
}

export interface Location{
    coords: Coords;
    mocked?: boolean,
    timestamp: number,
}

interface Driver{
    _id: string;
    name: string;
    email: string;
}

export interface Delivery{
    _id: string;
    status: number;
    description: string;
    user: string;
    driver: Driver;
    location?: Location
}

export interface ApiResponse{
    status: boolean;
    msg: string;
    token?: string;
    data?: any
}

export interface FollowParams{
    deliveryId: string;
};

export interface LoginRequest{
    email: string;
    password: string;
}

export interface TopBarProps{
    title: string;
}

export interface DeliveryContainerProps{
    delivery: Delivery;
}