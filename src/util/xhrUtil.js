export const moreArticlesXHRRequest = (state) => {
  let xhttp = new XMLHttpRequest();
  let oldArticles = state.articles.slice(0);
  let newArticles = [];

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      var obj = xhttp.response;

      if (obj !== "") {
        let newArticlesJSON = JSON.parse(obj);
        // This ternary helps when the number of more-articles isn't a
        // multiple of 10 (e.g. if there are 26 artiles, it will set the
        // end at 26 instead of 30 so as not to create empty article rows);
        let end = state.loadNumber * 10 > newArticlesJSON.length ?
          newArticlesJSON.length : state.loadNumber * 10;

        if (end >= newArticlesJSON.length && state.beyondBootStrap === true) {
          document.getElementById('load-more').disabled = true;
          document.getElementById('load-more').innerHTML = 'No More Articles';
        }
        newArticles = oldArticles.concat(newArticlesJSON.slice(0, end));
      }
    }
  };
  xhttp.open("GET", "/more-articles.json", false);
  xhttp.send();

  return newArticles;
}
