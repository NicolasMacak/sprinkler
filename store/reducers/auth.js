import { LOGIN, UPDATE } from '../actions/auth';

const initialState = {
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGZlLmNvbSIsInVuaXF1ZV9uYW1lIjoiMSIsIm5iZiI6MTU5MTcxOTE2NCwiZXhwIjoxNTkyMzIzOTY0LCJpYXQiOjE1OTE3MTkxNjR9.oVcwadrTs10cbPUcPmsPIKRy8b4WNmxWB_U5PfHbnPk",
    userId: 6,
    mail: "test@tfe.com",
    nickname: "Nicolaskoooo",
    allowedWateringTypes: [0, 1],
    fillAutomaticRegulation: false

};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                token: action.token,
                userId: action.userId
            };
        case UPDATE:
            return {
                ...state,
                mail: action.mail,
                nickname: action.nickname,
                allowedWateringTypes: action.allowedWateringTypes,
                fillAutomaticRegulation: action.fillAutomaticRegulation
            }
        default:
            return state;

    }
};
