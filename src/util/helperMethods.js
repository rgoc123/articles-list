import React from 'react';
import ArticleRow from '../components/articleRow';

export const createListOfArticleRows = (originalList, newList, end) => {
  for (let i = 0; i < end; i++) {
    let article = originalList[i];
    newList.push(<ArticleRow key={i} idx={i} article={article} />);
  }
};
