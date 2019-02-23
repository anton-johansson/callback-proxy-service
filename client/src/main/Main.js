import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, TextField} from 'react-md';
import {connect} from 'react-redux';
import './Main.css';
import {getEndpointSuggestion} from '../util';

// API functions
import {logout} from '../api/auth/actions';
import {setProxyEndpoint, getProxyEndpoint} from '../api/proxy/actions';

class Main extends Component {
  constructor(props) {
      super(props);
      this.onLogout = this.onLogout.bind(this);
      this.onSetEndpoint = this.onSetEndpoint.bind(this);
      this.onSuggest = this.onSuggest.bind(this);
      this.endpointRef = React.createRef();
  }

  componentDidMount() {
    this.props.dispatch(getProxyEndpoint());
  }

  onLogout() {
    this.props.dispatch(logout());
  }

  onSetEndpoint() {
    const endpoint = this.endpointRef.current.value;
    this.props.dispatch(setProxyEndpoint(endpoint));
  }

  onSuggest() {
    const suggestion = getEndpointSuggestion(this.props.clientAddress, this.props.clientHostname);
    console.log('suggestion', suggestion);
    // TODO: update hostname reference
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.props.name}`} />
        <CardText>
          <TextField id="endpoint" label="Endpoint" type="text" defaultValue={this.props.proxyEndpoint} ref={this.endpointRef} />
          <p>
            <Button raised primary disabled={false} onClick={this.onSetEndpoint}>
              Set endpoint
            </Button>
            &nbsp;
            <Button raised primary onClick={this.onSuggest}>
              Suggest endpoint
            </Button>
            &nbsp;
            <Button raised primary onClick={this.onLogout}>
              Logout
            </Button>
          </p>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
    username: state.authentication.username,
    name: state.authentication.name,
    clientAddress: state.authentication.clientAddress,
    clientHostname: state.authentication.clientHostname,
    proxyEndpoint: state.proxy.endpoint
});

export default connect(mapStateToProps)(Main);
