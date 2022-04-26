import React from 'react'
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    console.log("constructor()");
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps()");
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate()");
    return true;
  }

  render() {
    console.log("render()");
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

  getSnapshotBeforeUpdate() {
    console.log("getSnapshotBeforeUpdate()");
    return null;
  }

  componentDidMount() {
    console.log("componentDidMount()");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate()");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount()");
  }
}

export default App;
