import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Login from './login/Login';
import Main from './main/Main';
import CallbackHistory from './callback-history/CallbackHistory';
import './App.css';

// API functions
import {checkAuthentication} from './api/auth/actions';
import {setScene} from './api/scene/actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(setScene('login'));
    this.props.dispatch(checkAuthentication());
  }

  render() {
    return (
      <LoadingOverlay active={this.props.isLoading} fadeSpeed={100} spinner text='Loading...'>
        <div>
          {this.props.scene === 'main' && <Main/>}
          {this.props.scene === 'login' && <Login/>}
          {this.props.scene === 'callback-history' && <CallbackHistory/>}
        </div>
      </LoadingOverlay>
    )
  }
}

const mapStateToProps = state => ({
    username: state.authentication.username,
    scene: state.scene.current,
    isLoading: state.authentication.isLoading || state.config.isLoading || state.history.isLoading || state.proxy.isLoading
});

export default connect(mapStateToProps)(App);
