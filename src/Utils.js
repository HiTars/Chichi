/**
 * Created by mengzhu on 2016/12/21.
 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import StakeInfoReducer from './reducers/StakeInfo'

const middleware = applyMiddleware(thunk);

function _createStore(data = {}) {
    const rootReducer = combineReducers({
        //every modules reducer should be define here
        ['StakeInfo']: StakeInfoReducer
    });
    return createStore(rootReducer, data, middleware)
}

import _AV from 'leancloud-storage';
const APP_ID = 'Jv6ibodNTR8R6XRtdBH3dXgf-gzGzoHsz';
const APP_KEY = 'ldp0Hq4w2wO9FwpjNtsFRwjO';
_AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
export const AV = _AV;
export const Installation = require('leancloud-installation')(AV);
export const Store = _createStore();