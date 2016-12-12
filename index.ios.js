/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  AlertIOS
} from 'react-native';

import AV from 'leancloud-storage';
const APP_ID = 'Jv6ibodNTR8R6XRtdBH3dXgf-gzGzoHsz';
const APP_KEY = 'ldp0Hq4w2wO9FwpjNtsFRwjO';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
const LeancloudInstallation = require('leancloud-installation')(AV);

export default class Chichi extends Component {
    componentDidMount() {
        PushNotificationIOS.addEventListener('register', this._onRegister);
        PushNotificationIOS.requestPermissions();
    }
    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('register', this._onRegister);
    }

    _onRegister(deviceToken) {
        AlertIOS.alert(
            'Registered For Remote Push',
            `Device Token: ${deviceToken}`,
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
        LeancloudInstallation.getCurrent()
            .then(installation => {
                return installation.save({
                    deviceToken: deviceToken
                });
            })
            .then(installation => {
                PushNotificationIOS.presentLocalNotification({
                    alertBody: 'Installation updated.'
                });
            })
            .catch(error => this.log(error));
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Chichi', () => Chichi);
