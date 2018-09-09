import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

import { sortArticles,
  createArticleRows,
  loadMoreArticles,
  addSortedArticleListsToState
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
    const savedSort = localStorage.getItem('savedSort');
    window.addEventListener("resize", this.recalculateULHeight);

    if (this.state.loadNumber === 0) {
      if (savedSort === null) {
        createArticleRows(1, articles, this);
        this.setState({loadNumber: 1});
      } else {
        addSortedArticleListsToState(articles, savedSort, this);
      }
    }
  }

  render() {
    console.log(this.state);
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
        <ul style={{'height': this.state.ulHeight}}>
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
