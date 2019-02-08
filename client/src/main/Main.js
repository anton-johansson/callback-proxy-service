import React, { Component } from 'react';
import { Button, Card, CardTitle, CardText } from 'react-md';
import './Main.css';

class Main extends Component {
  constructor(props) {
      super(props);
      this.username = props.username;
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.username}`} />
        <CardText>
          <p>
            asdasd
          </p>
          <p>
            <Button raised primary>
              Logout
            </Button>
          </p>
        </CardText>
      </Card>
    );
  }
}

export default Main;
