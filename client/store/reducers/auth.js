import { LOGIN_SUCCESS, } from '../actions/types';
const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: null,
    // loading: true,
    user: null,
    isLogged: false
};

// this state name is counter! we define it in the combine reducer.
function authReducer(state = initialState, action) {
    console.log("in the reducer")
    const { type, payload } = action
    switch (type) {
        case LOGIN_SUCCESS:
            return {
                // ...state,
                // // isAuthenticated: true,
                // // loading: false,
                user: payload,
                isLogged: true

            }


        default:
            return state;
    }
}
export default authReducer;