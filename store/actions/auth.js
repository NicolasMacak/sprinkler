export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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

        console.log(email, password);
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
        console.log(resData);
        dispatch({ type: LOGIN });
    };
};