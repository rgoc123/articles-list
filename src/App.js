import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

class App extends Component {

  constructor() {
    super();
    this.state = {
      articles: articles,
      articlesList: [],
      loadNumber: 0,
      beyondBootStrap: false
    };
    this.testXHR = this.testXHR.bind(this);
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
    // console.log(this.state.loadNumber);
    let newLoadNumber = this.state.loadNumber + 1;

    if (this.state.beyondBootStrap === false) {
      this.createArticleRows(newLoadNumber, this.state.articles);
      // this.setState({loadNumber: newLoadNumber});
    } else {
      console.log(this.testXHR());
      // this.createArticleRows(newLoadNumber, this.testXHR());
      // run createArticleRows with the returned results from testXHR
    }

  }


  // Creates the rows for each article
  // UPDATE: Probably want to pass in the data source as an argument
  // to make the function more resuseble.
  createArticleRows(loadNumber, arrayOfArticles) {
    let articlesList = [];
    let newState = this.state;
    // This is to show 10 new articles, or however many articles are remaining if it's less than 10
    let end;
    if (loadNumber * 10 < arrayOfArticles.length) {
      end = loadNumber * 10
      newState['loadNumber'] = loadNumber + 1;
    } else {
      end = arrayOfArticles.length;
      newState['loadNumber'] = 1;
      newState['beyondBootStrap'] = true;
    }
    // May need to extend above to set the display state for the load more button

    for (let i = 0; i < end; i++) {
      let article = arrayOfArticles[i];
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

    newState['articlesList'] = articlesList;
    this.setState(newState);
  }

  testXHR() {
    let xhttp = new XMLHttpRequest();
    let oldArticles = this.state.articles.slice(0);
    let newArticles = [];
    let start = this.state.loadNumber * 10 - 10;
    let end = this.state.loadNumber * 10

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var obj = xhttp.response;
        // console.log([start, end]);
        // console.log(JSON.parse(obj).slice(start, end));
        newArticles = oldArticles.concat(JSON.parse(obj).slice(start, end));
        // return newArticles;
      }
    }.bind(this);
    xhttp.open("GET", "/more-articles.json", false);
    xhttp.send();

    return newArticles;
  }

  render() {
    console.log(this.state.articles);
    // console.log(this.state.loadNumber);
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <ul>
          {this.state.articlesList}
        </ul>
        <button onClick={() => this.loadMoreArticles()}>Load More</button>
      </div>
    );
  }

  componentDidMount() {
    if (this.state.loadNumber === 0) {
      this.createArticleRows(1, articles);
      this.setState({loadNumber: 1});
    }
  }

}

export default App;
