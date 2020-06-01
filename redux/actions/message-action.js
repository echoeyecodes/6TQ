import { SHOW_MESSAGE, DISMISS_MESSAGE } from "./types"


export function showMessage(value){
    return function(dispatch){
        dispatch({type: SHOW_MESSAGE, payload: value})
    }
}

export function dismissMessage(value){
    return function(dispatch){
        dispatch({type: DISMISS_MESSAGE, payload: value})
    }
}