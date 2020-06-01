import { SHOW_SNACKBAR, DISMISS_SNACKBAR } from "./types"

export function showSnackBar(value){
    return function(dispatch, getState){
        dispatch({type: SHOW_SNACKBAR, payload: value})
    }
}

export function dismissSnackbar(value){
    return function(dispatch, getState){
        dispatch({type: DISMISS_SNACKBAR, payload: value})
    }
}