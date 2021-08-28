import { Request, Response, NextFunction } from "express";
import { decodeAcessToken, getNewUserToken, getNewDriverToken } from "../utils";

//validate requests that needs permissions (user or driver authentication)
const authorize = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //get tokens from requests
        const accessToken = req.header('x-access-token');
        const refreshToken = req.header('x-refresh-token');

        //no access token -> unauthorized
        if (!accessToken) {
            return res.status(401).json({ error: 'No token provided.' });
        }

        const { decoded, expired } = decodeAcessToken(accessToken);

        //valid access token
        if (decoded) {
            // @ts-ignore
            if (decoded.type === role) { //access token compatible with route
                // @ts-ignore
                req.user = decoded;
                return next();
            }
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        //access token expired, but have a refresh token
        if (expired && refreshToken) {
            //generate a new access token
            let newAccessToken;
            if (role === 'user') newAccessToken = await getNewUserToken(refreshToken);
            else if (role === 'driver') newAccessToken = await getNewDriverToken(refreshToken);

            if (newAccessToken) {
                //sends a new access token in response
                res.setHeader("x-access-token", newAccessToken);
                const { decoded } = decodeAcessToken(newAccessToken);

                // @ts-ignore
                req.user = decoded;
                return next();
            }
            return res.status(401).json({ error: 'Failed to generate new access-token' });
        }
        return res.status(401).json({ error: 'Failed to authenticate token.' });
    }
}

export default authorize;