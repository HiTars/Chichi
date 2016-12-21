/**
 * Created by mengzhu on 2016/12/20.
 */
import React from 'react';
const {
    Component,
    PropTypes,
} = React;

import ReactNative from 'react-native';
const {
    Text,
    View,
    Switch,
    ListView,
    AlertIOS,
    StyleSheet,
    TouchableHighlight,
    PushNotificationIOS,
} = ReactNative;

import { connect } from 'react-redux';
import { Installation } from '../Utils';
import { updateStakeInfo } from '../actions/StakeInfo';

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

class ChichiApp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deviceToken: '',
            switchIsOn: false,
        };

        // Bind callback methods to make `this` the correct context.
        this._subStakeInfo = this._subStakeInfo.bind(this);
    }

    componentWillMount() {
        //PushNotificationIOS.addEventListener('register', this._onRegistered.bind(this));
        //PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
        //PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
        //PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

        PushNotificationIOS.requestPermissions();
    }

    componentDidMount() {
        this.props.updateStakeInfo();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.stakes);
    }

    componentWillUnmount() {
        //PushNotificationIOS.removeEventListener('register', this._onRegistered.bind(this));
        //PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
        //PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
        //PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
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
                    onValueChange={this._subStakeInfo}
                    value={this.state.switchIsOn} />
                <Button
                    onPress={this.props.updateStakeInfo}
                    label="Load Stake Info"
                />
                <ListView
                    dataSource={this.props.stakes}
                    renderRow={(stake) => <Text>{stake.name}: {this._getStatusStr(stake.status)}</Text>}
                />
            </View>
        )
    }

    _getStatusStr(status) {
        switch (status) {
            case '02':
                return '空闲';
            case '04':
                return '充电';
            default:
                return status;
        }
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
        Installation.getCurrent()
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

ChichiApp.propTypes = {
    stakes: PropTypes.object.isRequired,
    updateStakeInfo: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        stakes: ds.cloneWithRows(state.StakeInfo.stakes)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateStakeInfo: () => dispatch(updateStakeInfo())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChichiApp);

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