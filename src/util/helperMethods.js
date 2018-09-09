import React from 'react';
import ArticleRow from '../components/articleRow';
import { moreArticlesXHRRequest } from './xhrUtil.js';


export const createListOfArticleRows = (originalList, newList, end) => {
  for (let i = 0; i < end; i++) {
    const article = originalList[i];
    newList.push(<ArticleRow key={i} idx={i} article={article} />);
  }
};

// Creates the rows for each article. Passing arrayOfArticles as an
// argument makes the function more resuseble.
export const createArticleRows = (loadNumber, arrayOfArticles, component) => {
  const newState = component.state;
  let end;

  const sortedLists = createSortedArticleLists(arrayOfArticles.slice(0, end));

  // If they don't want a sort to continue to be applied when more artilces
  // are loaded, just remove the below for lines and move the above line
  // back to below the for loop.
  if (component.state.clickedSortButton === 'words-sort-button') arrayOfArticles = sortedLists[0];
  if (component.state.clickedSortButton === 'words-rev-button') arrayOfArticles = sortedLists[1];
  if (component.state.clickedSortButton === 'submit-sort-button') arrayOfArticles = sortedLists[2];
  if (component.state.clickedSortButton === 'submit-rev-button') arrayOfArticles = sortedLists[3];


  if (loadNumber * 10 < arrayOfArticles.length && component.state.beyondBootStrap === false) {
    // Above condition is if we're still referencing original "articles" and adding 10
    // more articles doesn't exceed "articles" length
    end = loadNumber * 10
    // console.log(loadNumber === 1 ? 2 : loadNumber + 1);
    newState['loadNumber'] = loadNumber === 1 ? 2 : loadNumber + 1;
  } else if (component.state.beyondBootStrap === false) {
    // If we do exceed "articles" length
    end = arrayOfArticles.length;
    if (moreArticlesXHRRequest(component).length === 0) { // As in there aren't any "more-articles"
      document.getElementById('load-more').disabled = true; // Disable the button
      document.getElementById('load-more').innerHTML = 'No More Articles';
    } else { // Otherwise reset loadNumber for upcoming slicing of 10 "more-articles"
      newState['loadNumber'] = 1;
      newState['beyondBootStrap'] = true;
    }
  } else {
    end = arrayOfArticles.length;
    newState['loadNumber'] += 1;
  }
  // May need to extend above to set the display state for the load more button

  const articlesList = [];
  createListOfArticleRows(arrayOfArticles, articlesList, end);

  // Create lists of articles sorted and reverse-sorted by words and
  // submission.

  newState['articlesList'] = articlesList;
  newState['wordsSortedArticles'] = sortedLists[0];
  newState['wordsReverseSortedArticles'] = sortedLists[1];
  newState['submittedSortedArticles'] = sortedLists[2];
  newState['submittedReverseSortedArticles'] = sortedLists[3];
  component.setState(newState);
}

export const createSortedArticleLists = (arrayOfArticles) => {
  const wordsArticlesObj = {};
  const submittedArticlesObj = {};
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
  const wordsArticlesObjKeys = Object.keys(wordsArticlesObj);
  wordsArticlesObjKeys.forEach(key => {
    wordsSortedArticles = wordsSortedArticles.concat(wordsArticlesObj[key]);
  });
  const wordsReverseSortedArticles = wordsSortedArticles.slice(0).reverse();

  // Create arrays of articles sorted and reverse-sorted by submission
  let submittedSortedArticles = [];
  const submittedArticlesObjKeys = Object.keys(submittedArticlesObj).sort();
  submittedArticlesObjKeys.forEach(key => {
    submittedSortedArticles = submittedSortedArticles.concat(submittedArticlesObj[key]);
  });
  const submittedReverseSortedArticles = submittedSortedArticles.slice(0).reverse();

  // Answer why we're returning an array instead of setting state
  return [wordsSortedArticles, wordsReverseSortedArticles, submittedSortedArticles,
    submittedReverseSortedArticles];
}

export const addSortedArticleListsToState = (articles, savedSort, component) => {
  const arts = createSortedArticleLists(articles);

  const savedSortButtonLookUp = {
    wordsSorted: 'words-sort-button',
    wordsRevSorted: 'words-rev-button',
    submitSorted: 'submit-sort-button',
    submitRevSorted: 'submit-rev-button'
  }
  const savedSortButtonID = savedSortButtonLookUp[savedSort];
  document.getElementById(savedSortButtonID).style.backgroundColor = '#2BFEC0';

  let sortedArts;
  if (savedSort === 'wordsSorted') sortedArts = arts[0];
  if (savedSort === 'wordsRevSorted') sortedArts = arts[1];
  if (savedSort === 'submitSorted') sortedArts = arts[2];
  if (savedSort === 'submitRevSorted') sortedArts = arts[3];

  createArticleRows(1, sortedArts, component);
  component.setState({loadNumber: 1, clickedSortButton: savedSortButtonID});
  // Possibly add set state for sort preference
}

export const sortArticles = (sortCategory, sortType, component) => {
  // Make this two separate functions: one with logic for sorting, one for handling
  // stuff in the component (adjust state);
  const newState = component.state;

  if (component.state.clickedSortButton !== '') document.getElementById(component.state.clickedSortButton).style.backgroundColor = 'white';

  let newList;
  // Possibly refactor below to just be 4 if statements for the
  // different localStorage types
  if (sortCategory === 'words') {
    if (sortType === 'sort') {
      // Extract all four below into a function with relevant parameters
      newList = newState['wordsSortedArticles'];
      localStorage.setItem('savedSort', 'wordsSorted');
      document.getElementById('words-sort-button').style.backgroundColor = '#2BFEC0';
      newState['clickedSortButton'] = 'words-sort-button';
    } else {
      newList = newState['wordsReverseSortedArticles'];
      localStorage.setItem('savedSort', 'wordsRevSorted');
      document.getElementById('words-rev-button').style.backgroundColor = '#2BFEC0';
      newState['clickedSortButton'] = 'words-rev-button';
    }
  } else {
    if (sortType === 'sort') {
      newList = newState['submittedSortedArticles'];
      localStorage.setItem('savedSort', 'submitSorted');
      document.getElementById('submit-sort-button').style.backgroundColor = '#2BFEC0';
      newState['clickedSortButton'] = 'submit-sort-button';
    } else {
      newList = newState['submittedReverseSortedArticles'];
      localStorage.setItem('savedSort', 'submitRevSorted');
      document.getElementById('submit-rev-button').style.backgroundColor = '#2BFEC0';
      newState['clickedSortButton'] = 'submit-rev-button';
    }
  }

  const newArticlesList = [];
  createListOfArticleRows(newList, newArticlesList, newList.length);

  const end = newState.articlesList.length;
  newState['articlesList'] = newArticlesList.slice(0, end);

  component.setState(newState);
}

export const loadMoreArticles = (component) => {
  const newLoadNumber = component.state.loadNumber + 1;

  if (component.state.beyondBootStrap === false) {
    createArticleRows(newLoadNumber, component.state.articles, component);
  } else if (moreArticlesXHRRequest(component).length !== 0) {
    createArticleRows(newLoadNumber, moreArticlesXHRRequest(component), component);
  }
}
