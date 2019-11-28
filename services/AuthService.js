import Buffer from 'buffer';
var AsyncStorage = require('react-native').AsyncStorage;

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      if (err) {
        return cb(err);
      }

      if (!val) {
        return cb();
      }

      const zippedObj = {
        auth: val[0][1],
        user: val[1][1],
      };

      if (!zippedObj[authKey]) {
        return cb();
      }

      const authInfo = {
        header: {
          Authorization: 'Basic ' + zippedObj[authKey],
        },
        user: JSON.parse(zippedObj[userKey]),
      };
      return cb(null, authInfo);
    });
  }

  login(creds, cb) {
    const buffer = new Buffer.Buffer(creds.username + ':' + creds.password);
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
        AsyncStorage.multiSet(
          [[authKey, encodedAuth], [userKey, JSON.stringify(results)]],
          err => {
            if (err) {
              throw err;
            }
            return cb({success: true});
          },
        );
      })
      .catch(err => {
        return cb(err);
      })
      .finally(() => {
        this.setState({showProgress: false});
      });
  }
}

export let authService = new AuthService();
