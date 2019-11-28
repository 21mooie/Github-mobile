import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

import Buffer from 'buffer';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProgress: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../assets/images/Octocat.png')}
        />
        <Text style={styles.heading}>Github browser</Text>
        <TextInput
          onChangeText={text => this.setState({username: text})}
          style={styles.input}
          placeholder="Github username"
        />
        <TextInput
          onChangeText={text => this.setState({password: text})}
          style={styles.input}
          placeholder="Github password"
          secureTextEntry={true}
        />
        <TouchableHighlight onPress={this.onLoginPressed} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableHighlight>
        <ActivityIndicator
          animating={this.state.showProgress}
          size="large"
          style={styles.loader}
        />
      </View>
    );
  }

  onLoginPressed = () => {
    console.log('Attempting to log in with username ' + this.state.username);
    this.setState({showProgress: true});

    const buffer = new Buffer.Buffer(
      this.state.username + ':' + this.state.password,
    );
    const encodedAuth = buffer.toString('base64');

    fetch('https://api.github.com/user', {
      headers: {
        Authorization: 'Basic ' + encodedAuth,
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        if (response.status === 401) {
          throw {
            badCredentials: response.status === 401,
            unknownError: response.status !== 401,
          };
        }
        throw 'Unknown error';
      })
      .then(response => {
        return response.json();
      })
      .then(results => {
        console.log(results);
      })
      .catch(err => {
        console.log('login failed: ' + err);
        this.setState(err);
      })
      .finally(() => {
        this.setState({showProgress: false});
      });
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 66,
    height: 55,
  },
  heading: {
    fontSize: 30,
    marginTop: 10,
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec',
    alignSelf: 'stretch',
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20,
  },
});
