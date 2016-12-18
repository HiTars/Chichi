const React = require('react');
const {
    Component,
} = React;

const ReactNative = require('react-native');
const {
    AppRegistry,
    NavigatorIOS,
} = ReactNative;

import HomeScene from './src/components/HomeScene';

class Chichi extends Component {

    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                    component: HomeScene,
                    title: 'Chichi',
                    passProps: { title: 'foo' }
                }}
                style={{flex: 1}}
            />
        )
    }

}

AppRegistry.registerComponent('Chichi', () => Chichi);
