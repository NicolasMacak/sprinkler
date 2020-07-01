import { LOGIN, UPDATE } from '../actions/auth';

const initialState = {
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGZlLmNvbSIsInVuaXF1ZV9uYW1lIjoiMSIsIm5iZiI6MTU5MzM2Mjg5NywiZXhwIjoxNTkzOTY3Njk3LCJpYXQiOjE1OTMzNjI4OTd9.83ljVJbskOIiogB7UVTyGxBsbfKPJTr51_EJtiWbDOY",
    userId: 6,
    mail: "test@tfe.com",
    nickname: "Nicolas",
    allowedWateringTypes: [1],
    fillAutomaticRegulation: true,

};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                token: "Bearer " + action.token,
                userId: action.userId,
                nickname: action.nickname,
                allowedWateringTypes: action.allowedWateringTypes,
                fillAutomaticRegulation: action.fillAutomaticRegulation
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
