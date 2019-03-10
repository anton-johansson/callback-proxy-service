import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Login from './login/Login';
import Main from './main/Main';
import './App.css';

// API functions
import {checkAuthentication} from './api/auth/actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(checkAuthentication());
  }

  render() {
    return (
      <LoadingOverlay active={this.props.isLoading} fadeSpeed={100} spinner text='Loading...'>
        <div>
          {this.props.username && <Main/>}
          {!this.props.username && <Login/>}
        </div>
      </LoadingOverlay>
    )
  }
}

const mapStateToProps = state => ({
    username: state.authentication.username,
    isLoading: state.authentication.isLoading || state.config.isLoading || state.proxy.isLoading
});

export default connect(mapStateToProps)(App);
