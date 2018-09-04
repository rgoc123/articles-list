import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

class App extends Component {

  // Creates the rows for each article
  // UPDATE: Probably want to pass in the data source as an argument
  // to make the function more resuseble.
  createArticleRows() {
    return articles.map(article => {
      return (
        <li className="article-li">
          <div className="article-item">
            <img src={article.image} />
            <div className="article-info">
              <a href={article.url} target="_blank">{article.title}</a>
              <div>Shares: {article.shares}</div>
              <div>Views: {article.views}</div>
            </div>
            <div className="author">
              <div>{article.profile.first_name}</div>
              <div>{article.profile.last_name}</div>
            </div>
            <div className="words">
              <div>{article.words}</div>
            </div>
            <div>
              <div>{article.publish_at}</div>
            </div>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <ul>
          {this.createArticleRows()}
        </ul>
      </div>
    );
  }
}

export default App;
