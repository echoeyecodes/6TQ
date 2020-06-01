import { SHOW_SNACKBAR, DISMISS_SNACKBAR } from "../actions/types";

const initalState ={
    visible: false,
    message: null
}

export default function(state=initalState, action){
    switch(action.type){
        case SHOW_SNACKBAR:
            return{
                ...state,
                visible: true,
                message: action.payload
            }
            break;
            case DISMISS_SNACKBAR:
                return{
                    ...state,
                    visible: false,
                    message: action.payload
                }
                break;
                default:
                    return state
    }
}