import { SHOW_MESSAGE, DISMISS_MESSAGE } from "../actions/types";


const initialState={
    visible: false,
    title: null,
    desc: null,
    image: null
}
export default function(state=initialState, action){
    switch(action.type){
        case SHOW_MESSAGE:
            return{
                ...state,
                visible: true,
                ...action.payload
            }
            break;
            case DISMISS_MESSAGE:
                return{
                    ...state,
                    visible: false,
                    title: null,
                    desc: null,
                    image: null
                }
                break

                default:
                    return state
    }
}