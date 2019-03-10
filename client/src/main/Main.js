import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, TextField} from 'react-md';
import {connect} from 'react-redux';
import './Main.css';
import {getTargetSuggestion} from '../util';

// API functions
import {logout} from '../api/auth/actions';
import {getConfig} from '../api/config/actions';
import {setTarget, getTarget, reset as resetProxy} from '../api/proxy/actions';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {target: props.target || ''};
      this.onTargetChange = this.onTargetChange.bind(this);
      this.onLogout = this.onLogout.bind(this);
      this.onSetTarget = this.onSetTarget.bind(this);
      this.onSuggest = this.onSuggest.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getTarget());
    this.props.dispatch(getConfig());
  }

  componentDidUpdate(previousProps) {
    if (previousProps.target !== this.props.target) {
      this.setState({target: this.props.target || ''});
    }
  }

  onTargetChange(target) {
    this.setState({target});
  }

  onLogout() {
    this.props.dispatch(logout());
    this.props.dispatch(resetProxy());
  }

  onSetTarget() {
    const target = this.state.target;
    this.props.dispatch(setTarget(target));
  }

  onSuggest() {
    const target = getTargetSuggestion(this.props.clientAddress, this.props.clientHostname, this.props.suggestionPath);
    if (target !== this.state.target) {
      this.setState({target});
    }
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.props.name}`} />
        <CardText>
          {this.props.proxyEndpoint &&
          <pre className='proxy-legend'>
            {this.props.proxyEndpoint}/{this.props.username} > {this.state.target ? this.state.target : '[None]'}
          </pre>}
          <TextField id="target" label="Target" type="text" value={this.state.target} onChange={this.onTargetChange} />
          <p>
            <Button raised primary disabled={this.state.target === this.props.target} onClick={this.onSetTarget}>
              Set target
            </Button>
            &nbsp;
            <Button raised primary onClick={this.onSuggest}>
              Suggest target
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
    proxyEndpoint: state.config.proxyEndpoint,
    suggestionPath: state.config.suggestionPath,
    target: state.proxy.target
});

export default connect(mapStateToProps)(Main);
