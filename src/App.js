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
      beyondBootStrap: false,
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
    } else if (this.testXHR().length !== 0) {
      console.log(this.testXHR());
      this.createArticleRows(newLoadNumber, this.testXHR());
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

    // If beyondBootStrap equals true and loadNumber * 10 > arrayOfArticles.length - articles.length
    // 1 - 10
    // 2 - 20
    // 3 - 30
    // 4 - 30
    // If the loadNumber * 10 is greater than the number of new articles, switch button to disabled
    // 20, 26

    // If loadNumber * 10 is greater than articles.length and testXHR.length is 0 or undefined
      // set button to disabled

    if (loadNumber * 10 < arrayOfArticles.length && this.state.beyondBootStrap === false) {
      end = loadNumber * 10
      newState['loadNumber'] = loadNumber + 1;
    } else if (this.state.beyondBootStrap === false) {
      end = arrayOfArticles.length;
      if (this.testXHR().length === 0) { // As in there aren't any "more-articles"
        document.getElementById('load-more').disabled = true; // Disable the button
      } else {
        newState['loadNumber'] = 1;
        newState['beyondBootStrap'] = true;
      }
    } else {
      end = arrayOfArticles.length;
      newState['loadNumber'] += 1;
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
    // let start = this.state.loadNumber * 10 - 10;

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var obj = xhttp.response;
        // console.log([start, end]);
        // console.log(JSON.parse(obj).slice(start, end));

        if (obj !== "") {
          let newArticlesJSON = JSON.parse(obj);
          // This ternary helps when the number of more-articles isn't a
          // multiple of 10 (e.g. if there are 26 artiles, it will set the
          // end at 26 instead of 30);
          let end = this.state.loadNumber * 10 > newArticlesJSON.length ?
            newArticlesJSON.length : this.state.loadNumber * 10;

          // This sets the button to disabled if we've added all the articles
          // from more articles. beyondBootStrap is included to ensure that
          // the user is actually beyondBootStrap, otherwise there can be
          // a conflict on line 72 when we run testXHR to see if it more-
          // articles exist, causing that run to set the button to disabled.
          if (end >= newArticlesJSON.length && this.state.beyondBootStrap === true) {
            debugger
            document.getElementById('load-more').disabled = true;
          }
          newArticles = oldArticles.concat(newArticlesJSON.slice(0, end));
          // return newArticles;
        }
      }
    }.bind(this);
    xhttp.open("GET", "/more-articles.json", false);
    xhttp.send();

    return newArticles;
  }

  render() {
    console.log(this.state);
    // console.log(this.state.loadNumber);
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <ul>
          {this.state.articlesList}
        </ul>
        <button id="load-more" onClick={() => this.loadMoreArticles()}>Load More</button>
      </div>
    );
  }

  // Could just create these every time new articles are generated
  // Replace articles with articlesList
  createSortedArticleLists() {
    let wordsArticlesObj = {};
    let submittedArticlesObj = {};
    articles.forEach(article => {
      wordsArticlesObj[article.words] = [];
      submittedArticlesObj[article.publish_at] = [];
    });
    articles.forEach(article => {
      wordsArticlesObj[article.words].push(article);
      submittedArticlesObj[article.publish_at].push(article);
    });
    // Create arrays of articles sorted and reverse-sorted by word count
    let wordsSortedArticles = [];
    let wordsArticlesObjKeys = Object.keys(wordsArticlesObj);
    wordsArticlesObjKeys.forEach(key => {
      wordsSortedArticles = wordsSortedArticles.concat(wordsArticlesObj[key]);
    });
    let wordsReverseSortedArticles = wordsSortedArticles.slice(0).reverse();
    // Create arrays of articles sorted and reverse-sorted by submission
    let submittedSortedArticles = [];
    let submittedArticlesObjKeys = Object.keys(submittedArticlesObj).sort();
    submittedArticlesObjKeys.forEach(key => {
      submittedSortedArticles = submittedSortedArticles.concat(submittedArticlesObj[key]);
    });
    let submittedReverseSortedArticles = submittedSortedArticles.slice(0).reverse();
    this.setState({
      'wordsSortedArticles': wordsSortedArticles,
      'wordsReverseSortedArticles': wordsReverseSortedArticles,
      'submittedSortedArticles': submittedSortedArticles,
      'submittedReverseSortedArticles': submittedReverseSortedArticles
    });
  }

  componentDidMount() {
    this.createSortedArticleLists();
    if (this.state.loadNumber === 0) {
      this.createArticleRows(1, articles);
      this.setState({loadNumber: 1});
    }
  }

}

export default App;
