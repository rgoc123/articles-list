import React, { Component } from 'react';

class ArticleRow extends Component {

  render() {
    let article = this.props.article;
    let i = this.props.key;
    return (
      <li className="article-li" key={i}>
        <div className="article-item">
          <div className="article-info-container">
            <img src={article.image} alt={article.title} />
            <div className="article-info">
              <a href={article.url} target="_blank">{article.title}</a>
              <div>Shares: {article.shares}</div>
              <div>Views: {article.views}</div>
            </div>
          </div>
          <div className="author">
            <div>{article.profile.first_name}</div>
            <div>{article.profile.last_name}</div>
          </div>
          <div className="words">
            <div>{article.words}</div>
          </div>
          <div className="submitted">
            <div>{article.publish_at}</div>
          </div>
        </div>
      </li>
    );
  }
}

export default ArticleRow;
