import { ENABLE_AUTHENTICATION, DISABLE_AUTHENTICATION } from "./types"

export function userAuthenticated(value){
    return function(dispatch, getState){
        dispatch({type: ENABLE_AUTHENTICATION, payload: value})
    }

}

export function userNotAuthenticated(value){
    return function(dispatch, getState){
        dispatch({type: DISABLE_AUTHENTICATION, payload: value})
    }

}