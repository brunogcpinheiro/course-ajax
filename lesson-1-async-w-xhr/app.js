(function() {
  const form = document.querySelector("#search-form");
  const searchField = document.querySelector("#search-keyword");
  let searchedForText;
  const responseContainer = document.querySelector("#response-container");

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    responseContainer.innerHTML = "";
    searchedForText = searchField.value;

    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.open(
      "GET",
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
    );
    unsplashRequest.onload = addImage;
    unsplashRequest.setRequestHeader(
      "Authorization",
      "Client-ID 7baac0a1cc7543b6bfac5b1a434b05fd61135f95bfe68265fcde5c52f9cc8903"
    );

    unsplashRequest.send();

    function addImage() {
      let htmlContent = "";
      const data = JSON.parse(this.responseText);

      if (data && data.results && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure class="img-unsplash">
        <img src="${firstImage.urls.regular}" alt="${searchedForText}" />
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
      </figure>`;
      } else {
        htmlContent = `<div class="error-no-image">No images available</div>`;
      }

      responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
    }

    const theNYTimesRequest = new XMLHttpRequest();
    theNYTimesRequest.open(
      "GET",
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=20b26254211048dc8b7c95bcc915220d`
    );

    theNYTimesRequest.onload = addArticle;
    theNYTimesRequest.send();

    function addArticle() {
      let htmlContent = "";
      const data = JSON.parse(this.responseText);
      if (
        data.response &&
        data.response.docs &&
        data.response.docs.length > 1
      ) {
        htmlContent =
          "<ul>" +
          data.response.docs
            .map(
              doc => `<li class="article">
          <h2><a href="${doc.web_url}">${doc.headline.main}</a></h2>
          <p>${doc.snippet}</p>
        </li>`
            )
            .join(" ") +
          "</ul>";
      } else {
        htmlContent = `<div class="error-no-article">No articles available</div>`;
      }

      responseContainer.insertAdjacentHTML("beforeend", htmlContent);
    }
  });
})();
