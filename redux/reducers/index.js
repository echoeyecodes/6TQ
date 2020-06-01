import {combineReducers} from 'redux'
import snackbarReducer from './snackbar-reducer'
import authenticateUserReducer from './authenticateUserReducer'
import messageReducer from './message-reducer'

export default combineReducers({
    snackbar: snackbarReducer,
    authenticated: authenticateUserReducer,
    message: messageReducer
})
