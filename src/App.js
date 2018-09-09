import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

import { createListOfArticleRows,
  sortArticles,
  createArticleRows,
  loadMoreArticles
} from './util/helperMethods';

class App extends Component {

  constructor() {
    super();
    this.state = {
      articles: articles,
      articlesList: [],
      loadNumber: 0,
      beyondBootStrap: false,
      clickedSortButton: '',
      ulHeight: window.innerHeight - 203
    };
    // this.moreArticlesXHRRequest = this.moreArticlesXHRRequest.bind(this);
    this.recalculateULHeight = this.recalculateULHeight.bind(this);
  }

  // moreArticlesXHRRequest() {
  //   let xhttp = new XMLHttpRequest();
  //   let oldArticles = this.state.articles.slice(0);
  //   let newArticles = [];
  //
  //   xhttp.onreadystatechange = function() {
  //     if (xhttp.readyState === 4 && xhttp.status === 200) {
  //       var obj = xhttp.response;
  //
  //       if (obj !== "") {
  //         let newArticlesJSON = JSON.parse(obj);
  //         // This ternary helps when the number of more-articles isn't a
  //         // multiple of 10 (e.g. if there are 26 artiles, it will set the
  //         // end at 26 instead of 30);
  //         let end = this.state.loadNumber * 10 > newArticlesJSON.length ?
  //           newArticlesJSON.length : this.state.loadNumber * 10;
  //
  //         // This sets the button to disabled if we've added all the articles
  //         // from more articles. beyondBootStrap is included to ensure that
  //         // the user is actually beyondBootStrap, otherwise there can be
  //         // a conflict on line 72 when we run moreArticlesXHRRequest to see if it more-
  //         // articles exist, causing that run to set the button to disabled.
  //         if (end >= newArticlesJSON.length && this.state.beyondBootStrap === true) {
  //           document.getElementById('load-more').disabled = true;
  //           document.getElementById('load-more').innerHTML = 'No More Articles';
  //         }
  //         newArticles = oldArticles.concat(newArticlesJSON.slice(0, end));
  //       }
  //     }
  //   }.bind(this);
  //   xhttp.open("GET", "/more-articles.json", false);
  //   xhttp.send();
  //
  //   return newArticles;
  // }

  recalculateULHeight() {
    let newULHeight = window.innerHeight - 203;
    this.setState({ulHeight: newULHeight});
  }

  render() {
    console.log(this.state);

    let ulHeight = this.state.ulHeight;

    return (
      <div className="App">
        <h1>Policy Mic</h1>
        <div className="col-headers-container">
          <div className="col-headers">
            <div id="article-header">Articles</div>
            <div id="author-header">Author</div>
            <div id="words-header"><span>Words</span>
              <button id="words-sort-button" onClick={() => sortArticles('words', 'sort', this)}><i className="fas fa-sort-up"></i></button>
              <button id="words-rev-button" onClick={() => sortArticles('words', 'reverse', this)}><i className="fas fa-sort-down"></i></button>
            </div>
            <div id="submitted-header"><span>Submitted</span>
              <button id="submit-sort-button" onClick={() => sortArticles('submitted', 'sort', this)}><i className="fas fa-sort-up"></i></button>
              <button id="submit-rev-button" onClick={() => sortArticles('submitted', 'reverse', this)}><i className="fas fa-sort-down"></i></button>
            </div>
          </div>
        </div>
        <ul style={{'height': ulHeight}}>
          {this.state.articlesList}
        </ul>
        <div className="footer">
          <button id="load-more" onClick={() => loadMoreArticles(this)}>Load More Articles</button>
        </div>
      </div>
    );
  }

  // Could just create these every time new articles are generated
  // Replace articles with articlesList
  createSortedArticleLists(arrayOfArticles) {
    let wordsArticlesObj = {};
    let submittedArticlesObj = {};
    arrayOfArticles.forEach(article => {
      wordsArticlesObj[article.words] = [];
      submittedArticlesObj[article.publish_at] = [];
    });
    arrayOfArticles.forEach(article => {
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

    // Answer why we're returning an array instead of setting state
    return [wordsSortedArticles, wordsReverseSortedArticles, submittedSortedArticles,
      submittedReverseSortedArticles];
  }

  componentDidMount() {
    let savedSort = localStorage.getItem('savedSort');

    window.addEventListener("resize", this.recalculateULHeight);

    if (this.state.loadNumber === 0) {
      if (savedSort === null) {
        createArticleRows(1, articles, this);
        this.setState({loadNumber: 1});
      } else {
        let arts = this.createSortedArticleLists(articles);

        let savedSortButtonLookUp = {
          wordsSorted: 'words-sort-button',
          wordsRevSorted: 'words-rev-button',
          submitSorted: 'submit-sort-button',
          submitRevSorted: 'submit-rev-button'
        }
        let savedSortButtonID = savedSortButtonLookUp[savedSort];
        document.getElementById(savedSortButtonID).style.backgroundColor = '#2BFEC0';

        let sortedArts;
        if (savedSort === 'wordsSorted') sortedArts = arts[0];
        if (savedSort === 'wordsRevSorted') sortedArts = arts[1];
        if (savedSort === 'submitSorted') sortedArts = arts[2];
        if (savedSort === 'submitRevSorted') sortedArts = arts[3];

        createArticleRows(1, sortedArts, this);
        this.setState({loadNumber: 1, clickedSortButton: savedSortButtonID});
        // Possibly add set state for sort preference
      }
    }
  }

}

export default App;
