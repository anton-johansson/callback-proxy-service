import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, TextField} from 'react-md';
import {connect} from 'react-redux';
import './Login.css';

// API functions
import {login} from '../api/auth/actions';

class Login extends Component {
  constructor(props) {
      super(props);
      this.usernameRef = React.createRef();
      this.passwordRef = React.createRef();
  }

  handleLogin = () => {
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    this.props.dispatch(login(username, password));
  };

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  }

  render() {
    return (
      <Card className="Login-card">
        <CardTitle title="Login" subtitle="Use your domain credentials" />
        <CardText>
          <TextField id="username" label="Username" type="text" ref={this.usernameRef} onKeyPress={this.onKeyPress} />
          <TextField id="password" label="Password" type="password" ref={this.passwordRef} onKeyPress={this.onKeyPress} />
          <Button raised primary onClick={this.handleLogin}>
            Login
          </Button>
        </CardText>
      </Card>
    );
  }
}

export default connect()(Login);
