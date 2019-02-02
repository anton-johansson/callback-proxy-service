import React, { Component } from 'react';
import { Button, Card, CardTitle, CardText, TextField } from 'react-md';
import './App.css';

class App extends Component {
  render() {
    return (
      <Card className="Login-card">
        <CardTitle title="Login" subtitle="Use your domain credentials" />
        <CardText>
          <TextField id="username" label="Username" type="text" />
          <TextField id="password" label="Password" type="password" />
          <Button raised primary>
            Login
          </Button>
        </CardText>
      </Card>
    );
  }
}

export default App;
