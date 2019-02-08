import React, { Component } from 'react';
import Login from './login/Login';
import Main from './main/Main';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        loading: false,
        username: ''
      }
      this.onLogin = this.onLogin.bind(this);
  }

  onLogin(username) {
    this.setState({username});
  }

  getOutput() {
    if (this.state.loading) {
      return <div>Loading...</div>
    } else if (this.state.username) {
      return <Main username={this.state.username} />
    } else {
      return <Login onLogin={this.onLogin} />
    }
  }

  render() {
    const output = this.getOutput();
    return output;
  }
}


export default App;
