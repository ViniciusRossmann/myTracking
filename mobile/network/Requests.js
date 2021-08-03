import Endpoints from './Endpoints'

async function driverLogin(login, password, callback) {
    try {
        let response = await fetchWithTimeout(Endpoints.api + 'driver_auth',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            });

        if (response.status != 200) {
            callback("request status error", null);
            return;
        }

        let json_response = await response.json();
        if (!json_response.status) {
            callback(json_response.msg, null);
            return;
        }
        else callback(json_response.msg, json_response.token);
    }
    catch(error) {
        console.log(error);
        callback("could not complete operation", null);
    }
}

async function fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

module.exports = { driverLogin };