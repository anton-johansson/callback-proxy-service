import React, { Component } from 'react';
import { Button, Card, CardTitle, CardText, TextField } from 'react-md';
import ky from 'ky';
import './Login.css';

class Login extends Component {
  constructor(props) {
      super(props);
      this.onLogin = props.onLogin;
      this.usernameRef = React.createRef();
      this.passwordRef = React.createRef();
      this.state = {
          username: '',
          loading: true
      };
  }

  componentDidMount = () => {
    console.log('Checking for authentication');
    ky.get('http://localhost:8181/api/is-authenticated')
      .then(response => {
        if (response.status === 200) {
          const authentication = response.json();
          console.log('Is authenticated as', authentication.username);
          this.setState({
            username: authentication.username,
            loading: false
          });
        } else {
          console.log('Not authenticated');
          this.setState({
            loading: false
          });
        }
      })
      .catch(err => {
        console.log('Error checking authentication:', err);
      })
  };

  handleLogin = () => {
    this.setState({
      loading: true
    });

    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    const options = {
      json: {
        username,
        password
      }
    }
    ky.post('http://localhost:8181/api/authenticate', options)
      .then(response => {
        if (response.status === 200) {
          console.log('Successfully authenticated');
          this.setState({
            loading: false,
            username: username
          });
          this.onLogin(username);
        } else {
          console.log('Could not authenticate');
        }
      })
      .catch(err => {
        console.log('Error authenticating:', err);
      });
  };

  render() {
    return (
      <Card className="Login-card">
        <CardTitle title="Login" subtitle="Use your domain credentials" />
        <CardText>
          <TextField id="username" label="Username" type="text" ref={this.usernameRef} />
          <TextField id="password" label="Password" type="password" ref={this.passwordRef} />
          <Button raised primary onClick={this.handleLogin}>
            Login
          </Button>
        </CardText>
      </Card>
    );
  }
}

export default Login;
