import { LIGHT, DARK } from "./types"
import {themes} from '../../Context/ThemeContext'

export function lightTheme(){
    return function(dispatch, getState, extraArguments){
        // Asynchronous code can go here
        dispatch({type: LIGHT, payload: themes.light})
    }
}

export function darkTheme(){
    return function(dispatch, getState, extraArguments){
        dispatch({type: DARK, payload: themes.dark})
    }
}