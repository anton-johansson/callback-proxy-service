import React, { Component } from 'react';
import { Button, Card, CardTitle, CardText, TextField } from 'react-md';
import {connect} from 'react-redux';
import ky from 'ky';
import './Login.css';
import {login} from '../api/auth/actions';

class Login extends Component {
  constructor(props) {
      super(props);
      this.onLogin = props.onLogin;
      this.usernameRef = React.createRef();
      this.passwordRef = React.createRef();
      this.state = {
          username: '',
          loading: true,
      };
  }

  handleLogin = () => {
    this.setState({
      loading: true
    });

    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;

    this.props.dispatch(login(username, password));
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

const mapStateToProps = state => ({
    username: state.username
});

export default connect(mapStateToProps)(Login);
