import React, { Component } from 'react';
import { Button, Card, CardTitle, CardText } from 'react-md';
import {connect} from 'react-redux';
import './Main.css';
import {logout} from '../api/auth/actions';

class Main extends Component {
  constructor(props) {
      super(props);
      this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.props.username}`} />
        <CardText>
          <p>
            asdasd
          </p>
          <p>
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
    username: state.username
});

export default connect(mapStateToProps)(Main);
