import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, TextField} from 'react-md';
import {connect} from 'react-redux';
import './Main.css';
import {getEndpointSuggestion} from '../util';

// API functions
import {logout} from '../api/auth/actions';
import {setProxyEndpoint, getProxyEndpoint, reset as resetProxy} from '../api/proxy/actions';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {endpoint: props.endpoint || ''};
      this.onEndpointChange = this.onEndpointChange.bind(this);
      this.onLogout = this.onLogout.bind(this);
      this.onSetEndpoint = this.onSetEndpoint.bind(this);
      this.onSuggest = this.onSuggest.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getProxyEndpoint());
  }

  componentDidUpdate(previousProps) {
    if (previousProps.endpoint !== this.props.endpoint) {
      this.setState({endpoint: this.props.endpoint || ''});
    }
  }

  onEndpointChange(endpoint) {
    this.setState({endpoint});
  }

  onLogout() {
    this.props.dispatch(logout());
    this.props.dispatch(resetProxy());
  }

  onSetEndpoint() {
    const endpoint = this.state.endpoint;
    this.props.dispatch(setProxyEndpoint(endpoint));
  }

  onSuggest() {
    const endpoint = getEndpointSuggestion(this.props.clientAddress, this.props.clientHostname);
    if (endpoint !== this.state.endpoint) {
      this.setState({endpoint});
    }
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.props.name}`} />
        <CardText>
          <TextField id="endpoint" label="Endpoint" type="text" value={this.state.endpoint} onChange={this.onEndpointChange} />
          <p>
            <Button raised primary disabled={this.state.endpoint === this.props.endpoint} onClick={this.onSetEndpoint}>
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
    endpoint: state.proxy.endpoint
});

export default connect(mapStateToProps)(Main);
