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
  ListView,
  AlertIOS,
  StyleSheet,
  PushNotificationIOS,
} = ReactNative;

import {connect} from 'react-redux';
import {Flex, WhiteSpace, Button, Switch} from 'antd-mobile';
import {Installation} from '../Utils';
import {updateStakeInfo} from '../actions/StakeInfo';


class ChichiApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      deviceToken: '',
      subStakeInfo: false,
      subGuahaoInfo: false,
    };

    // Bind callback methods to make `this` the correct context.
    this._subStakeInfo = this._subStakeInfo.bind(this);
    this._subGuahaoInfo = this._subGuahaoInfo.bind(this);
  }

  componentWillMount() {
    PushNotificationIOS.addEventListener('register', this._onRegistered.bind(this));
    PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

    PushNotificationIOS.requestPermissions();
  }

  componentDidMount() {
    this.props.updateStakeInfo();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.stakes);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this._onRegistered.bind(this));
    PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  render() {
    return (
      <View style={{
        marginTop: 80,
        margin: 5,
        padding: 5,
        //borderWidth: 1,
        //borderStyle: 'dotted',
        //alignSelf: 'flex-start'
      }}>
        {/*<Button*/}
          {/*onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(42)}*/}
          {/*label="Set app's icon badge to 42"*/}
        {/*/>*/}
        {/*<Button*/}
          {/*onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(0)}*/}
          {/*label="Clear app's icon badge"*/}
        {/*/>*/}
        {/*<Button*/}
          {/*onPress={this._sendNotification}*/}
          {/*label="Send fake notification"*/}
        {/*/>*/}
        {/*<Button*/}
          {/*onPress={this._sendLocalNotification}*/}
          {/*label="Send fake local notification"*/}
        {/*/>*/}
        {/*<Button*/}
          {/*onPress={this._showPermissions.bind(this)}*/}
          {/*label="Show enabled permissions"*/}
        {/*/>*/}
        <Flex>
            <Switch onChange={this._subStakeInfo}
                    checked={this.state.subStakeInfo}/>
            <Button type="primary"
                    size="small"
                    onClick={this.props.updateStakeInfo}
            >
              Load Stake
            </Button>
        </Flex>
        <ListView style={{
          borderWidth: 1,
          borderStyle: 'dotted',
        }}
          dataSource={this.props.stakes}
          renderRow={(stake) => <Text>{stake.name}: {this._getStatusStr(stake.status)}</Text>}
        />
        <Flex>
          <Switch onChange={this._subGuahaoInfo}
                  checked={this.state.subGuahaoInfo}/>
          <Button type="primary"
                  size="small"
                  onClick={this.props.updateStakeInfo}
          >
            Load Guahao
          </Button>
        </Flex>
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
    this.setState({subStakeInfo: value});
    Installation.getCurrent()
      .then(installation => {
        // Installation 的 localStorage 有问题，拿不到缓存的 installation
        return installation.save({
          deviceToken: this.state.deviceToken,
          channels: (value ? ["stakeInfo"] : [])
        });
      })
      .catch(error => this.log(error));
  }

  _subGuahaoInfo(value) {
    this.setState({subGuahaoInfo: value});
    Installation.getCurrent()
      .then(installation => {
        // Installation 的 localStorage 有问题，拿不到缓存的 installation
        return installation.save({
          deviceToken: this.state.deviceToken,
          channels: (value ? ["guahaoInfo"] : [])
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

  _onLocalNotification(notification) {
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