import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers/index'
import {AsyncStorage} from 'react-native'
import {persistStore, persistReducer} from 'redux-persist'
const middleware = [thunk]


const persistConfig ={
    key: 'theme',
    storage: AsyncStorage,
    whitelist: ['user', 'authenticated'],
    blacklist: ['snackbar', 'message']
}

const pReducer = persistReducer(persistConfig, reducer)
const store= createStore(pReducer, {}, applyMiddleware(...middleware))
const persistor = persistStore(store)
/* persistor.purge() */
export {persistor, store}
