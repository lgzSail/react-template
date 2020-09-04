import { createStore, combineReducers } from 'redux';

import indexReducer from './reducer';
import headerReducer from './reducer/header';

const rootReducers = combineReducers({ indexReducer, headerReducer })

const store = createStore(rootReducers);
export default store;