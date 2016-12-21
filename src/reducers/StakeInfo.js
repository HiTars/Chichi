/**
 * Created by mengzhu on 2016/12/20.
 */
import { handleActions } from 'redux-actions';

const initialState = {
    stakes: []
};

export default handleActions({
    ['UPDATE_STAKE_INFO']: (state, action) => {
        const { payload: { stakes } } = action;
        return {
            ...state,
            stakes: stakes
        }
    },
}, initialState)
