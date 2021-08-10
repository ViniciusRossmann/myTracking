export interface User {
    name: string;
    email: string;
    password: string;
}

export interface Position{
    lat: number;
    long: number;
}

export interface Delivery{
    _id: string;
    description: string;
    user_email: string;
    driver_email: string;
    position?: Position
}

export interface ApiResponse{
    status: boolean;
    msg: string;
    token?: string;
    data?: any
}