import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, DialogContainer, List, ListItem} from 'react-md';
import {connect} from 'react-redux';
import Timestamp from 'react-timestamp';
import './CallbackHistory.css';

// API functions
import {getCallbackHistory, setSelectedCallbackHistory} from '../api/history/actions';
import {setScene} from '../api/scene/actions';

class CallbackHistory extends Component {
  constructor(props) {
      super(props);
      this.onBack = this.onBack.bind(this);
      this.onSelectHistory = this.onSelectHistory.bind(this);
      this.onUnselectHistory = this.onUnselectHistory.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getCallbackHistory());
  }

  onBack() {
    this.props.dispatch(setScene('main'));
  }

  onSelectHistory(index) {
      this.props.dispatch(setSelectedCallbackHistory(index));
  }

  onUnselectHistory() {
      this.props.dispatch(setSelectedCallbackHistory(-1));
  }

  render() {
    const items = this.props.history && this.props.history.map((history, index) => {
      const key = `callback-history-${index}`;
      const text = `${history.method} ${history.target}${history.path}`;
      return <ListItem key={key} primaryText={text} secondaryText={<Timestamp time={history.timestamp} precision={2} autoUpdate/>} onClick={() => this.onSelectHistory(index)}/>
    });
    const history = this.props.selectedHistoryIndex >= 0 ? this.props.history[this.props.selectedHistoryIndex] : {};
    const headers = history.headers && Object.keys(history.headers).map(headerName => <li>{headerName}: {history.headers[headerName]}</li>);
    console.log(history);
    return (
      <div>
        <DialogContainer
          id='callback'
          title={`${history.method} ${history.target}${history.path}`}
          visible={this.props.selectedHistoryIndex >= 0}
          onHide={this.onUnselectHistory}
          modal
          width='80%'
          focusOnMount={false}>
          <Timestamp time={history.timestamp} format='full'/>
          <div>Remote address: {history.remoteAddress}</div>
          <div>
            Headers:
            <ul>
              {headers}
            </ul>
          </div>
          <Button raised primary onClick={this.onUnselectHistory}>
            Close
          </Button>
        </DialogContainer>
        <Card className="CallbackHistory-card">
            <CardTitle title="Callback history" subtitle={`for ${this.props.name}`} />
            <CardText>
            <List>
                {items}
            </List>
            <p>
                <Button raised primary onClick={this.onBack}>
                Back
                </Button>
            </p>
            </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    name: state.authentication.name,
    selectedHistoryIndex: state.history.selectedCallbackHistoryIndex,
    history: state.history.callbackHistory
});

export default connect(mapStateToProps)(CallbackHistory);
