// React
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

// Redux
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

// Reducers
import authReducer from './api/auth/reducers';

// Actual application
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons']
  }
});

const loggerMiddleware = createLogger();
const store = createStore(
    authReducer,
    /*
    combineReducers({
        authentication: authReducer
    }),
    */
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
