import React, {Component} from 'react';
import {Button, DialogContainer} from 'react-md'
import {connect} from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Login from './login/Login';
import Main from './main/Main';
import CallbackHistory from './callback-history/CallbackHistory';
import './App.css';

// API functions
import {checkAuthentication} from './api/auth/actions';
import {popError} from './api/error/actions';
import {setScene} from './api/scene/actions';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(setScene('login'));
    this.props.dispatch(checkAuthentication());
  }

  onRemoveError = () => {
    this.props.dispatch(popError());
  };

  render() {
    const errorMessage = this.props.errorMessages.length > 0 && this.props.errorMessages[0];
    const hasError = errorMessage && errorMessage.length > 0;
    console.log('errorMessage', errorMessage);
    console.log('hasError', hasError);
    return (
      <LoadingOverlay active={this.props.isLoading} fadeSpeed={100} spinner text='Loading...'>
        <DialogContainer
          id='error'
          title='Error occurred'
          visible={hasError}
          onHide={this.onRemoveError}
          modal
          width='40%'
          focusOnMount={false}>
          <div>{errorMessage}</div>
          <div>
            <Button raised primary onClick={this.onRemoveError}>
              OK
            </Button>
          </div>
        </DialogContainer>
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
    errorMessages: state.error.errorMessages,
    scene: state.scene.current,
    isLoading: state.authentication.isLoading || state.config.isLoading || state.history.isLoading || state.proxy.isLoading
});

export default connect(mapStateToProps)(App);
