export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const UPDATE = 'UPDATE';

export const signup = (email, nickname, password) => {
    return async dispatch => {

        console.log(email, nickname, password);
        const response = await fetch(
            'http://35.206.95.251:80/users/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    nickname: nickname,
                    password: password
                })
            });

        if (!response.ok) {
            throw new Error('An Error has occured!');
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    };
};

export const login = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            'http://35.206.95.251:80/users/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

        if (!response.ok) {
            throw new Error('Je to v riti!');
        }

        const resData = await response.json();
        dispatch({ type: LOGIN });
    };
};

export const update = (userId, token, mail, nickname, allowedWateringTypes, fillAutomaticRegulation) => {
    return async dispatch => {

        console.log(userId, mail, nickname, allowedWateringTypes, fillAutomaticRegulation);

        fetch('http://35.206.95.251:80/users',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    id: userId,
                    email: mail,
                    nickname: nickname,
                    userSettings: JSON.stringify({
                        fillAutomaticRegulation: fillAutomaticRegulation,
                        allowedWateringTypes: allowedWateringTypes
                    })
                })
            })
            // .then((response) => response.json())
            // .then((responseJson) => console.log(responseJson))
            .catch((error) => {
                console.error(error);
            })
        dispatch({ type: UPDATE, mail, nickname, fillAutomaticRegulation, allowedWateringTypes });
    };
};