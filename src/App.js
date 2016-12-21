/**
 * Created by mengzhu on 2016/12/21.
 */
import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';
import { Provider } from 'react-redux';

import Chichi from './containers/Chichi';
import { Store } from './Utils';

export default class App extends Component {
    render() {
        return (
            <Provider store={Store}>
                <NavigatorIOS
                    initialRoute={{
                        component: Chichi,
                        title: 'Chichi',
                        passProps: { title: 'foo' }
                    }}
                    style={{flex: 1}}
                />
            </Provider>
        );
    }
}