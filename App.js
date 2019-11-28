/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Login from './screens/Login';
import {authService} from './services/AuthService';

var createReactClass = require('create-react-class');

var App = createReactClass({
  getInitialState: function() {
    return {
      isLoggedIn: false,
      checkingAuth: true,
    };
  },

  componentDidMount: function() {
    // eslint-disable-next-line handle-callback-err
    authService.getAuthInfo((err, authInfo) => {
      this.setState({
        checkingAuth: false,
        isLoggedIn: authInfo != null,
      });
    });
  },

  render: function() {
    if (this.state.checkingAuth) {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
        />
      );
    }
    if (!this.state.isLoggedIn) {
      return <Login onLogin={this.onLoginMain} />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}> Welcome </Text>
        </View>
      );
    }
  },

  onLoginMain: function() {
    console.log('route to main');
    this.setState({isLoggedIn: true});
  },
});

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

export default App;
