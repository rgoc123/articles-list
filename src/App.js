import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

class App extends Component {

  constructor() {
    super();
    this.state = {
      articlesList: articles.slice(0,9),
      loadNumber: 1
    };
  }

  // Function for adding more articles
    // Reference state.loadNumber
    // Append more rows
    // If there aren't more rows in articles, make call to more articles
    // If there aren't more in more articles, make button disappear

  // Possible ways to do this:
    // Append new elements to DOM
      // Benefit: It might look cleaner
      // Cost: It'll be more of a pain to code
    // Have a state key "articles" and add to that
      // Benefit: It'll be easier to code, and there's probably no
      // difference in performance.
  loadMoreArticles() {
    let newLoadNumber = this.state.loadNumber + 1;
    this.setState({loadNumber: newLoadNumber});
  }


  // Creates the rows for each article
  // UPDATE: Probably want to pass in the data source as an argument
  // to make the function more resuseble.
  createArticleRows(loadNumber) {
    let articlesList = [];
    // This is to show 10 new articles, or however many articles are remaining if it's less than 10
    let end = loadNumber * 10 < articles.length ? loadNumber * 10 : articles.length;

    for (let i = 0; i < end; i++) {
      let article = articles[i];
      articlesList.push(
        <li className="article-li" key={i}>
          <div className="article-item">
            <img src={article.image} alt={article.title} />
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
    }

    return articlesList;
  }

  render() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <ul>
          {this.createArticleRows(this.state.loadNumber)}
        </ul>
        <button onClick={() => this.loadMoreArticles()}>Load More</button>
      </div>
    );
  }
}

export default App;
