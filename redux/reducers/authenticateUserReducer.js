import { ENABLE_AUTHENTICATION, DISABLE_AUTHENTICATION } from "../actions/types";

const initialState={
    authenticated: false
}
export default function(state=initialState, action){
    switch(action.type){
        case ENABLE_AUTHENTICATION:
            return{
                ...state,
                authenticated: action.payload
            }
            break;
            case DISABLE_AUTHENTICATION:
                return{
                    ...state,
                    authenticated: action.payload
                }
                break;
                default:
                return state
    }
}