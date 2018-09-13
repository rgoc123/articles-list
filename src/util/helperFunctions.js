import React from 'react';
import ArticleRow from '../components/articleRow';
import { moreArticlesXHRRequest } from './xhrUtil.js';


export const createListOfArticleRows = (originalList, newList, end) => {
  for (let i = 0; i < end; i++) {
    const article = originalList[i];
    newList.push(<ArticleRow key={i} idx={i} article={article} />);
  }
};

export const createArticleRows = (loadNumber, arrayOfArticles, state) => {
  const newState = state;
  let end;

  const sortedLists = createSortedArticleLists(arrayOfArticles.slice(0, end));

  // If they don't want a sort to continue to be applied when more artilces
  // are loaded, just remove the below for lines and move the above line
  // back to below the for loop.
  if (state.clickedSortButton === 'words-sort-button') arrayOfArticles = sortedLists[0];
  if (state.clickedSortButton === 'words-rev-button') arrayOfArticles = sortedLists[1];
  if (state.clickedSortButton === 'submit-sort-button') arrayOfArticles = sortedLists[2];
  if (state.clickedSortButton === 'submit-rev-button') arrayOfArticles = sortedLists[3];


  if (loadNumber * 10 < arrayOfArticles.length && state.beyondBootStrap === false) {
    // Above condition is if we're still referencing original "articles" and adding 10
    // more articles doesn't exceed "articles" length
    end = loadNumber * 10
    // console.log(loadNumber === 1 ? 2 : loadNumber + 1);
    newState['loadNumber'] = loadNumber === 1 ? 2 : loadNumber + 1;
  } else if (state.beyondBootStrap === false) {
    // If we do exceed "articles" length
    end = arrayOfArticles.length;
    if (moreArticlesXHRRequest(state).length === 0) { // As in there aren't any "more-articles"
      newState['loadMoreDisabled'] = true; // Disable the button
      newState['loadMoreInnerHTML'] = 'No More Articles';
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
  // setState(newState);
  return newState;
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

  return [wordsSortedArticles, wordsReverseSortedArticles, submittedSortedArticles,
    submittedReverseSortedArticles];
}

export const addSortedArticleListsToState = (articles, savedSort, state) => {
  const arts = createSortedArticleLists(articles);
  let newState = state;

  const savedSortButtonLookUp = {
    wordsSorted: 'words-sort-button',
    wordsRevSorted: 'words-rev-button',
    submitSorted: 'submit-sort-button',
    submitRevSorted: 'submit-rev-button'
  }
  const savedSortButtonID = savedSortButtonLookUp[savedSort];
  newState['sortButtonsColor'][savedSortButtonID] = '#2BFEC0';
  newState['clickedSortButton'] = savedSortButtonID;

  let sortedArts;
  if (savedSort === 'wordsSorted') sortedArts = arts[0];
  if (savedSort === 'wordsRevSorted') sortedArts = arts[1];
  if (savedSort === 'submitSorted') sortedArts = arts[2];
  if (savedSort === 'submitRevSorted') sortedArts = arts[3];

  createArticleRows(1, sortedArts, newState);
  return sortedArts;
}

export const getMoreArticles = (state) => {
  const newLoadNumber = state.loadNumber + 1;

  let newArticles;
  if (state.beyondBootStrap === false) {
    newArticles = createArticleRows(newLoadNumber, state.articles, state);
  } else if (moreArticlesXHRRequest(state).length !== 0) {
    newArticles = createArticleRows(newLoadNumber, moreArticlesXHRRequest(state), state);
  }
  return newArticles;
}

export const createSortedArticlesList = (sortCategory, sortType, newState) => {

  const clickedSortButton = newState.clickedSortButton;

  if (clickedSortButton !== '') newState['sortButtonsColor'][clickedSortButton] = 'white';

  let newList;
  if (sortCategory === 'words') {
    if (sortType === 'sort') {
      // Extract all four below into a function with relevant parameters
      newList = newState['wordsSortedArticles'];
      localStorage.setItem('savedSort', 'wordsSorted');
      newState['sortButtonsColor']['words-sort-button'] = '#2BFEC0';
      newState['clickedSortButton'] = 'words-sort-button';
    } else {
      newList = newState['wordsReverseSortedArticles'];
      localStorage.setItem('savedSort', 'wordsRevSorted');
      newState['sortButtonsColor']['words-rev-button'] = '#2BFEC0';
      newState['clickedSortButton'] = 'words-rev-button';
    }
  } else {
    if (sortType === 'sort') {
      newList = newState['submittedSortedArticles'];
      localStorage.setItem('savedSort', 'submitSorted');
      newState['sortButtonsColor']['submit-sort-button'] = '#2BFEC0';
      newState['clickedSortButton'] = 'submit-sort-button';
    } else {
      newList = newState['submittedReverseSortedArticles'];
      localStorage.setItem('savedSort', 'submitRevSorted');
      newState['sortButtonsColor']['submit-rev-button'] = '#2BFEC0';
      newState['clickedSortButton'] = 'submit-rev-button';
    }
  }

  const newArticlesList = [];
  createListOfArticleRows(newList, newArticlesList, newList.length);
  return newArticlesList;
}
