/*START Take the Params from the url */
// Get the encoded game object from the URL query parameters
const params = new URLSearchParams(window.location.search);
const encodedGame = params.get("category");

// Decode the encoded game object and parse it as JSON
const categoryName = JSON.parse(decodeURIComponent(encodedGame));

// Use the game object for further processing
console.log("URL Params response: ", categoryName);
/*END Take the Params from the url */

/*Start Top Carousel */

function addItemCarousel(gamesArray, categoryName) {
  $("#header").append(categoryName);
  for (let i = 0; i < gamesArray.length; i++) {
    const newCarouselItem = `
        <div class="carousel-item" data-game-id=${gamesArray[i]._id}>
        <div class="container" style="margin-bottom: 1rem">
        <div class="row row-cols-1 row-cols-md-1 row-cols-lg-3">
            <div class="col">
            <img
                class="align-self-center"
                src='${gamesArray[i].backGroundImage}'
                width="100%"
                height="100%"
            />
            </div>
            <div class="col">
            <p class="text-center text-white align-self-center">
            ${gamesArray[i].description}
               <br /><br />
            </p>
            </div>
            <div class="col text-center d-flex flex-column align-self-center">
            <span
                class="text-secondary align-self-center"
                style="margin-bottom: 0.5rem"
                >Release date: ${gamesArray[i].releaseDate}</span
            >
            <span
                class="text-secondary align-self-center"
                style="margin-bottom: 0.5rem"
                >Developers: ${getDevelopers(i)}</span
            ><span
                class="text-secondary align-self-center"
                style="margin-bottom: 0.5rem"
                >Publishers: ${getPublishers(i)}</span
            ><span
            class="text-secondary align-self-center"
            style="margin-bottom: 0.5rem"
            >Price: ${gamesArray[i].price}$</span
            >
            <div>
            <button
            onclick="fetchGame('${gamesArray[i]._id}')"
            class="btn btn-dark border rounded-pill border-dark"
            type="button"
            style="margin-right: 0.5rem; margin-top: 0.5rem"
          >
            Game Page
          </button>
            </div>
            </div>
        </div>
        </div>
    </div>
    `;

    const $newCarouselItem = $(newCarouselItem); // Convert the HTML string to a jQuery object

    // on click fetch the game data from the server and redirect to the game page.
    $newCarouselItem.click(function () {
      const gameId = $(this).data("game-id");
      fetchGame(gameId);
    });

    if ($("#headerCarousel").children().length == 0) {
      addIndicatorToTheCarousel(gamesArray.length, 1);
      $newCarouselItem.addClass("active");
    }

    $("#headerCarousel").append($newCarouselItem);
  }
}

// add the indicators to the header carousel.
function addIndicatorToTheCarousel(numberOfItems, carouselId) {
  const newCarouselItem = [];
  for (let i = 0; i < numberOfItems; i++) {
    newCarouselItem.push(`
      <li data-bs-target="#carousel-${carouselId}" data-bs-slide-to='${i}'></li>
      `);
  }

  $("#numberOfItems").append(newCarouselItem);

  $("#numberOfItems").children().first().addClass("active");
}

function getDevelopers(index) {
  const developers = [];
  for (let i = 0; i < categoryName.games[index].developers.length; i++) {
    developers.push(categoryName.games[index].developers[i] + ", ");
  }
  return developers;
}
function getPublishers(index) {
  const publishers = [];
  for (let i = 0; i < categoryName.games[index].publishers.length; i++) {
    publishers.push(categoryName.games[index].publishers[i] + ", ");
  }
  return publishers;
}

/* End Top Carousel */

/* Start middle carousel */
function addItemForMiddleCarousel(gamesArray) {
  console.log("Games Array :", gamesArray);
  try {
    for (let i = 0; i < gamesArray.length; i += 4) {
      // look at this ->  const subArray = gamesArray.slice(i, Math.min(i + 4, gamesArray.length)); // Validation added here
      const subArray = gamesArray.slice(i, i + 4); // TODO -> validation if i+4 smallest then the array length.
      const newCarouselItem = `
          <div class="carousel-item" style="max-width: 80vw; padding:auto;">
          <div class="container">
            <div
              class="row gy-2 row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2"
            >
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <img width="300px" src='${gamesArray[i].backGroundImage}' />
                    <h4 class="text-body card-title">${gamesArray[i].name}</h4>
                    <h6 class="text-muted card-subtitle mb-2">
                      ${gamesArray[i].onSale ? "Now On Sale!" : "Not in Sale!"}
                    </h6>
                    <h6 class="text-muted card-subtitle mb-2">Only ${
                      gamesArray[i].price
                    }$</h6>
                    <button
                      onclick="fetchGame('${gamesArray[i]._id}')"
                      class="btn btn-dark border rounded-pill border-dark"
                      type="button"
                      style="margin-right: 0.5rem"
                    >
                      Game Page
                    </button>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <img style="padding-right: 15px" width="300px" src='${
                      gamesArray[i + 1].backGroundImage
                    }' />
                    <h4 class="text-body card-title">${
                      gamesArray[i + 1].name
                    }</h4>
                    <h6 class="text-muted card-subtitle mb-2">
                      ${
                        gamesArray[i + 1].onSale
                          ? "Now On Sale!"
                          : "Not in Sale!"
                      }
                    </h6>
                    <h6 class="text-muted card-subtitle mb-2">Only ${
                      gamesArray[i + 1].price
                    }$</h6>
                    <button
                    onclick="fetchGame('${gamesArray[i + 1]._id}')"
                      class="btn btn-dark border rounded-pill border-dark"
                      type="button"
                      style="margin-right: 0.5rem"
                    >
                      Game Page
                    </button>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <img style="padding-right: 15px" width="300px" src='${
                      gamesArray[i + 2].backGroundImage
                    }' />
                    <h4 class="text-body card-title">${
                      gamesArray[i + 2].name
                    }</h4>
                    <h6 class="text-muted card-subtitle mb-2">
                      ${
                        gamesArray[i + 2].onSale
                          ? "Now On Sale!"
                          : "Not in Sale!"
                      }
                    </h6>
                    <h6 class="text-muted card-subtitle mb-2">Only ${
                      gamesArray[i + 2].price
                    }$</h6>
                    <button
                    onclick="fetchGame('${gamesArray[i + 2]._id}')"
                      class="btn btn-dark border rounded-pill border-dark"
                      type="button"
                      style="margin-right: 0.5rem"
                    >
                      Game Page
                    </button>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <img style="padding-right: 15px" width="300px" src='${
                      gamesArray[i + 3].backGroundImage
                    }' />
                    <h4 class="text-body card-title">${
                      gamesArray[i + 3].name
                    }</h4>
                    <h6 class="text-muted card-subtitle mb-2">
                      ${
                        gamesArray[i + 3].onSale
                          ? "Now On Sale!"
                          : "Not in Sale!"
                      }
                    </h6>
                    <h6 class="text-muted card-subtitle mb-2">Only ${
                      gamesArray[i + 3].price
                    }$</h6>
                    <button
                    onclick="fetchGame('${gamesArray[i + 3]._id}')"
                      class="btn btn-dark border rounded-pill border-dark"
                      type="button"
                      style="margin-right: 0.5rem"
                    >
                      Game Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
      const $newCarouselItem = $(newCarouselItem);

      $("#middleCarousel").append($newCarouselItem);

      $("#middleCarousel").children().first().addClass("active");
    }
  } catch (e) {}
}

/* End middle carousel */

/*Start Bottom List */
function addItemListBottom(backGroundImage, name, price, id) {
  const newCarouselItem = `
        <div
        data-game-id="${id}"
        class="col-md-12 text-bg-secondary d-flex justify-content-between"
        style="
        padding-right: 0px;
        padding-left: 0px;
        margin-bottom: 0.5rem;
        border-color: var(--bs-red);
        "
    >
        <div class="d-flex d-lg-flex flex-wrap"
        onmouseout="this.style.opacity='1';" 
        onmouseover="this.style.opacity='0.5';"
        style="cursor: pointer;"
        >
        <img
            class="img-fluid"
            src='${backGroundImage}'
            width="100vw"
            height="100vh"
            style="margin-right: 0.3rem"
        /><span class="text-capitalize fw-bold align-self-center"
            >${name}</span
        >
        </div>
        <div class="d-flex d-lg-flex align-self-center">
        <span
            class="fw-bold d-sm-flex align-self-center"
            style="margin-right: 0.5rem"
            >${price}$</span
        ><button
            class="btn btn-dark border rounded-pill border-dark"
            type="button"
            style="margin-right: 0.5rem"
        >
            Game Page
        </button>
        </div>
    </div>
    `;

  const $newCarouselItem = $(newCarouselItem); // Convert the HTML string to a jQuery object

  // on click fetch the game data from the server and redirect to the game page.
  $newCarouselItem.click(function () {
    const gameId = $(this).data("game-id");
    fetchGame(gameId);
  });

  $("#lastContainer").append($newCarouselItem);

  // open the scroll bar Y inside this container after 4 games
  if ($("#lastContainer").children().length > 4) {
    $("#lastContainer").css("overflow-y", "scroll");
  }
}

function getCategoryByName(name) {
  $.ajax({
    url: "http://localhost:3000/category/" + name,
    type: "GET",
    success: function (response) {
      // Handle the successful response
      const category = response;
      const games = category.games;
      addItemForMiddleCarousel(games);
    },
    error: function (xhr, status, error) {
      // Handle the error
      console.log("AJAX request failed: " + error);
    },
  });
}

function fetchGames() {
  $.ajax({
    url: "http://localhost:3000/game",
    type: "GET",
    success: function (response) {
      // Handle the successful response
      console.log("FetchGames Response: ", response);
      return response.map((game) => {
        addItemListBottom(
          game.backGroundImage,
          game.name,
          game.price,
          game._id
        );
      });
    },
    error: function (xhr, status, error) {
      // Handle the error
      console.log("AJAX request failed: " + error);
    },
  });
}

function fetchGame(gameId) {
  $.ajax({
    url: "http://localhost:3000/game/" + gameId,
    method: "GET",
    success: function (response) {
      console.log(response);
      //   window.location.href = "http://localhost:3000/game/" + gameId;
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "GamePage.html?game=" + encodedGame;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      console.log(xhr.responseText);
      // Handle the error
    },
  });
}

/*End Bottom List */
function sendToCategoryPage(name) {
  $.ajax({
    url: "http://localhost:3000/category/" + name,
    method: "GET",
    success: function (response) {
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "CategoryPage.html?category=" + encodedGame;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      console.log(xhr.responseText);
      // Handle the error
    },
  });
}

function sendToSearchPage() {
  // let searchBarValue = $("#searchBar").val();
  // if (searchBarValue == null || searchBarValue == "") {
  //   window.location.href = "SearchPage.html";
  // } else {
  //   const encodedSearch = encodeURIComponent(JSON.stringify(searchBarValue));
  //   window.location.href = "SearchPage.html?game=" + encodedSearch;
  // }
  window.location.href = "SearchPage.html";
}

$(document).ready(function () {
  fetchGames();
  addItemCarousel(categoryName.games, categoryName.name);
  getCategoryByName("Special Offers");
});
