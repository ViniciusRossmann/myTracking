interface User {
    name: string;
    email: string;
    password: string;
}

interface Position {
    lat: Number;
    long: Number;
}

interface Delivery {
    description: string;
    user_email: string;
    driver_email: string;
    position?: Position;
}

export {
    User,
    Position,
    Delivery
}