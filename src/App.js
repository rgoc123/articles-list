import React, { Component } from 'react';
import './App.css';
import ArticleFeed from './components/articleFeed';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Policy Mic</h1>
        <ArticleFeed />
      </div>
    );
  }
}

export default App;
