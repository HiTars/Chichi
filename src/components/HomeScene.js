const React = require('react');
const {
    Component,
    PropTypes,
} = React;

const ReactNative = require('react-native');
const {
    Text,
    View,
    Switch,
    AlertIOS,
    StyleSheet,
    TouchableHighlight,
    PushNotificationIOS,
} = ReactNative;

import AV from 'leancloud-storage';
const APP_ID = 'Jv6ibodNTR8R6XRtdBH3dXgf-gzGzoHsz';
const APP_KEY = 'ldp0Hq4w2wO9FwpjNtsFRwjO';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
const LeancloudInstallation = require('leancloud-installation')(AV);

class Button extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'white'}
                style={styles.button}
                onPress={this.props.onPress}>
                <Text style={styles.buttonLabel}>
                    {this.props.label}
                </Text>
            </TouchableHighlight>
        );
    }
}

export default class HomeScene extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        navigator: PropTypes.object.isRequired,
    };

    state = {
        deviceToken: '',
        switchIsOn: false,
    };

    componentWillMount() {
        PushNotificationIOS.addEventListener('register', this._onRegistered.bind(this));
        PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
        PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
        PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

        PushNotificationIOS.requestPermissions();
    }

    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('register', this._onRegistered.bind(this));
        PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
        PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
        PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
    }

    render() {
        return (
            <View style={{marginTop: 100, alignSelf: 'center'}}>
                <Button
                    onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(42)}
                    label="Set app's icon badge to 42"
                />
                <Button
                    onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(0)}
                    label="Clear app's icon badge"
                />
                <Button
                    onPress={this._sendNotification}
                    label="Send fake notification"
                />
                <Button
                    onPress={this._sendLocalNotification}
                    label="Send fake local notification"
                />
                <Button
                    onPress={this._showPermissions.bind(this)}
                    label="Show enabled permissions"
                />
                <Switch
                    onValueChange={this._subStakeInfo.bind(this)}
                    value={this.state.switchIsOn} />
            </View>
        )
    }

    _subStakeInfo(value) {
        this.setState({switchIsOn: value});
        LeancloudInstallation.getCurrent()
            .then(installation => {
                // Installation 的 localStorage 有问题，拿不到缓存的 installation
                return installation.save({
                    deviceToken: this.state.deviceToken,
                    channels: (value ? ["stakeInfo"] : [])
                });
            })
            .catch(error => this.log(error));
    }

    _sendNotification() {
        require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
            aps: {
                alert: 'Sample notification',
                badge: '+1',
                sound: 'default',
                category: 'REACT_NATIVE'
            },
        });
    }

    _sendLocalNotification() {
        require('RCTDeviceEventEmitter').emit('localNotificationReceived', {
            aps: {
                alert: 'Sample local notification',
                badge: '+1',
                sound: 'default',
                category: 'REACT_NATIVE'
            },
        });
    }

    _onRegistered(deviceToken) {
        this.setState({deviceToken: deviceToken});
        LeancloudInstallation.getCurrent()
            .then(installation => {
                return installation.save({
                    deviceToken: deviceToken
                });
            })
            .catch(error => this.log(error));
    }

    _onRegistrationError(error) {
        AlertIOS.alert(
            'Failed To Register For Remote Push',
            `Error (${error.code}): ${error.message}`,
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    _onRemoteNotification(notification) {
        AlertIOS.alert(
            'Push Notification Received',
            'Alert message: ' + JSON.stringify(notification.getMessage()),
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    _onLocalNotification(notification){
        AlertIOS.alert(
            'Local Notification Received',
            'Alert message: ' + JSON.stringify(notification.getMessage()),
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }

    _showPermissions() {
        PushNotificationIOS.checkPermissions((permissions) => {
            AlertIOS.alert(
                'Permissions',
                'Permissions: ' + JSON.stringify(permissions),
                [{
                    text: 'Dismiss',
                    onPress: null,
                }]
            );
        });
    }

}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        color: 'blue',
    },
});