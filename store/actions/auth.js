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
            throw new Error('CONFLICT');
        }

        // const resData = await response.json();
        // console.log(resData);
        // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
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
            throw new Error('PASS');
        }

        const resData = await response.json();

        let userSettings = JSON.parse(resData.user.userSettings);

        // console.log("resDATA", resData);

        if (userSettings === null) {
            userSettings = {
                allowedWateringTypes: [0, 1, 2],
                fillAutomaticRegulation: true
            };
        }

        dispatch({
            type: LOGIN,
            token: resData.token,
            userId: resData.user.userId,
            nickname: resData.user.nickname,
            allowedWateringTypes: userSettings.allowedWateringTypes,
            fillAutomaticRegulation: userSettings.fillAutomaticRegulation
        });
    };
};

export const update = (userId, token, mail, nickname, allowedWateringTypes, fillAutomaticRegulation) => {
    return async dispatch => {

        // console.log(userId, mail, nickname, allowedWateringTypes, fillAutomaticRegulation);

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