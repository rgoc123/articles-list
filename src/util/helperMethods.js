import React from 'react';
import ArticleRow from '../components/articleRow';

export const createListOfArticleRows = (originalList, newList, end) => {
  for (let i = 0; i < end; i++) {
    let article = originalList[i];
    newList.push(<ArticleRow key={i} idx={i} article={article} />);
  }
};

export const sortArticles = (sortCategory, sortType, component) => {
  let newState = component.state;

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

  let newArticlesList = [];
  createListOfArticleRows(newList, newArticlesList, newList.length);

  let end = newState.articlesList.length;
  newState['articlesList'] = newArticlesList.slice(0, end);

  component.setState(newState);
}

// Creates the rows for each article. Passing arrayOfArticles as an
// argument makes the function more resuseble.
export const createArticleRows = (loadNumber, arrayOfArticles, component) => {
  let newState = component.state;
  let end;

  let sortedLists = component.createSortedArticleLists(arrayOfArticles.slice(0, end));

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
    if (component.moreArticlesXHRRequest().length === 0) { // As in there aren't any "more-articles"
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

  let articlesList = [];
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

export const loadMoreArticles = (component) => {
  let newLoadNumber = component.state.loadNumber + 1;

  if (component.state.beyondBootStrap === false) {
    createArticleRows(newLoadNumber, component.state.articles, component);
  } else if (component.moreArticlesXHRRequest().length !== 0) {
    createArticleRows(newLoadNumber, component.moreArticlesXHRRequest(), component);
  }
}
