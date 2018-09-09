import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

import { createListOfArticleRows,
  sortArticles,
  createArticleRows,
  loadMoreArticles,
  createSortedArticleLists
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
    this.recalculateULHeight = this.recalculateULHeight.bind(this);
  }

  recalculateULHeight() {
    let newULHeight = window.innerHeight - 203;
    this.setState({ulHeight: newULHeight});
  }

  componentDidMount() {
    let savedSort = localStorage.getItem('savedSort');
    window.addEventListener("resize", this.recalculateULHeight);

    if (this.state.loadNumber === 0) {
      if (savedSort === null) {
        createArticleRows(1, articles, this);
        this.setState({loadNumber: 1});
      } else {
        let arts = createSortedArticleLists(articles);

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
}

export default App;
