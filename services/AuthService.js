import Buffer from 'buffer';

class AuthService {
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
        return cb({success: true});
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
