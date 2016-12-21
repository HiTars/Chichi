/**
 * Created by mengzhu on 2016/12/20.
 */
import { AV } from '../Utils';

export function updateStakeInfo() {
    return (dispatch, getState) => {
        const query = new AV.Query('StakeTerm');
        query.find().then((stakes) => {;
            dispatch({
                type: 'UPDATE_STAKE_INFO',
                payload: {
                    stakes: JSON.parse(JSON.stringify(stakes))
                }
            });
        }, (error) => {
            // 异常处理
        });
    }
}