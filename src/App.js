import React, { Component } from 'react';
import './App.css';
import articles from './data/articles';

import { createArticleRows,
  getMoreArticles,
  addSortedArticleListsToState,
  createSortedArticlesList
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
      ulHeight: window.innerHeight - 203,
      sortButtonsColor: {
        'words-sort-button': 'white',
        'words-rev-button': 'white',
        'submit-sort-button': 'white',
        'submit-rev-button': 'white'
      }
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
        const newState = createArticleRows(1, articles, this.state);
        newState['loadNumber'] = 1;
        this.setState(newState);
      } else {
        const sortedArticles =  addSortedArticleListsToState(articles, savedSort, this.state);
        const newState = createArticleRows(1, sortedArticles, this.state);
        newState['loadNumber'] = 1;
        this.setState(newState);
      }
    }
  }

  async sortArticles(sortCategory, sortType) {
    const newState = this.state;

    const newArticlesList = await createSortedArticlesList(sortCategory, sortType, newState);

    // const clickedSortButton = this.state.clickedSortButton;
    // const clickedSortButtonLookUp = {
    //   'words-sort-button': wordsSorted,
    //   'words-rev-button': wordsRevSorted,
    //   'submit-sort-button': submitSorted,
    //   'submit-rev-button': submitRevSorted
    // }
    //
    // if (this.state.clickedSortButton !== '') newState.clickedSortButton = 'white';

    const end = newState.articlesList.length;
    newState['articlesList'] = newArticlesList.slice(0, end);
    this.setState(newState);
  }

  loadMoreArticles() {
    let newState = getMoreArticles(this.state);
    this.setState(newState);
  }

  render() {
    return (
      <div className="App">
        <h1>Policy Mic</h1>
        <div className="col-headers-container">
          <div className="col-headers">
            <div id="article-header">Articles</div>
            <div id="author-header">Author</div>
            <div id="words-header"><span>Words</span>
              <button id="words-sort-button" onClick={() => this.sortArticles('words', 'sort')}
                style={{'backgroundColor': this.state.sortButtonsColor['words-sort-button']}}><i className="fas fa-sort-up"></i></button>
              <button id="words-rev-button" onClick={() => this.sortArticles('words', 'reverse')}
                style={{'backgroundColor': this.state.sortButtonsColor['words-rev-button']}}><i className="fas fa-sort-down"></i></button>
            </div>
            <div id="submitted-header"><span>Submitted</span>
              <button id="submit-sort-button" onClick={() => this.sortArticles('submitted', 'sort')}
                style={{'backgroundColor': this.state.sortButtonsColor['submit-sort-button']}}><i className="fas fa-sort-up"></i></button>
              <button id="submit-rev-button" onClick={() => this.sortArticles('submitted', 'reverse')}
                style={{'backgroundColor': this.state.sortButtonsColor['submit-rev-button']}}><i className="fas fa-sort-down"></i></button>
            </div>
          </div>
        </div>
        <ul style={{'height': this.state.ulHeight}}>
          {this.state.articlesList}
        </ul>
        <div className="footer">
          <button id="load-more" onClick={() => this.loadMoreArticles()}>Load More Articles</button>
        </div>
      </div>
    );
  }
}

export default App;
