import React, {Component} from 'react';
import {connect} from 'react-redux';
import Login from './login/Login';
import Main from './main/Main';
import './App.css';

// API functions
import {isAuthenticated} from './api/auth/actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(isAuthenticated());
  }

  render() {
    return (
      <div>
        {this.props.username && <Main/>}
        {!this.props.username && <Login/>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
    username: state.authentication.username
});

export default connect(mapStateToProps)(App);
