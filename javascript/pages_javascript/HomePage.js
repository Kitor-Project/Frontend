function sendToSearchPage() {
  window.location.href = "SearchPage.html";
}

// /*Start first carosuel */
function getCategoryByName(name) {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/category/" + name,
    type: "GET",
    success: function (response) {
      // Handle the successful response
      const category = response;
      const games = category.games;
      if (name.localeCompare("Featured") == 0) {
        addItemToHeaderCarousel(games);
      }
      if (name.localeCompare("Special Offers") == 0) {
        addItemForMiddleCarousel(games);
      }
    },
    error: function (xhr, status, error) {
      // Handle the error
    },
  });
}

// add the games to the header carousel.
function addItemToHeaderCarousel(gamesArray) {
  for (let i = 0; i < gamesArray.length; i++) {
    const newCarouselItem = `
      <div id="carousel-item-${gamesArray[i].gamesArray}" class="carousel-item" data-game-id=${gamesArray[i]._id}>
      <div
        class="container text-center text-bg-dark d-xl-flex flex-row justify-content-xl-center"
      >
        <img
          src='${gamesArray[i].backGroundImage}'
          alt="Slide Image"
          style="min-width: 60vw; max-width: 60vw"
        />
        <div>
          <span class="text-capitalize fs-4">${gamesArray[i].name}</span>
          <section class="py-4 py-xl-5">
            <div class="container">
              <div
                class="row gx-2 gy-2 row-cols-1 row-cols-lg-2 row-cols-xl-2"
                data-bss-baguettebox=""
              >
                <div class="col">
                <img
                      class="img-fluid"
                      src='${gamesArray[i].images[0]}'
                  /></a>
                </div>
                <div class="col">
                <img
                      class="img-fluid"
                      src='${gamesArray[i].images[1]}'
                  /></a>
                </div>
                <div class="col">
                <img
                      class="img-fluid"
                      src='${gamesArray[i].images[2]}'
                  /></a>
                </div>
                <div class="col">
                <img
                      class="img-fluid"
                      src='${gamesArray[i].images[3]}'
                  /></a>
                </div>
              </div>
              <div class="row g-0 mb-5">
                <div class="col-md-8 col-xl-6 text-center mx-auto">
                  <p>Now Available</p>
                  <span class="text-capitalize fs-6">Price: ${gamesArray[i].price}$</span>
                </div>
              </div>
            </div>
            <div>
            <button
            onclick="fetchGame('${gamesArray[i]._id}')"
            class="btn btn-secondary border rounded-pill border-dark"
            type="button"
            style="margin-right: 0.5rem"
          >
            Game Page
          </button>
            </div>
          </section>
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

/* END first carousel */

/* Start middle carousel */
function addItemForMiddleCarousel(gamesArray) {
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
                      gamesArray[i + 1].onSale ? "Now On Sale!" : "Not in Sale!"
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
                      gamesArray[i + 2].onSale ? "Now On Sale!" : "Not in Sale!"
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
                      gamesArray[i + 3].onSale ? "Now On Sale!" : "Not in Sale!"
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

/*Start last list */

// add the games to bottom list.
function addItemList(headerImageSource, title, price, id) {
  const newCarouselItem = `
        <div
          data-game-id=${id}
          class="col-md-12 text-bg-secondary d-flex justify-content-between game-card"
          style="
              padding-right: 0px;
              padding-left: 0px;
              margin-bottom: 0.5rem;
              border-color: var(--bs-red);
              cursor: pointer;
          "
        >
          <div class="d-lg-flex" 
          onmouseout="this.style.opacity='1';" 
          onmouseover="this.style.opacity='0.5';">
              <img
                class="img-fluid"
                src=${headerImageSource}
                width="100vw"
                height="100vh"
                style="margin-right: 0.3rem"
              />
              <span class="text-capitalize fw-bold align-self-center">${title}</span>
          </div>
          <div class="d-lg-flex align-self-center">
              <span
                class="fw-bold d-sm-flex align-self-center"
                style="margin-right: 0.5rem"
              >
                ${price}$
              </span>
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

function fetchGame(gameId) {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/game/" + gameId,
    method: "GET",
    success: function (response) {
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "GamePage.html?game=" + encodedGame;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

function fetchGames() {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/game",
    type: "GET",
    success: function (response) {
      // Handle the successful response
      return response.map((game) => {
        addItemList(game.backGroundImage, game.name, game.price, game._id);
      });
    },
    error: function (xhr, status, error) {
      // Handle the error
    },
  });
}

function sendToCategoryPage(name) {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/category/" + name,
    method: "GET",
    success: function (response) {
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "CategoryPage.html?category=" + encodedGame;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

/* add map to the ourShops */
// APIKEY, to use map from html -> Artan6gxfohGjZeB4Bn5N6p3RaLJQEsfF8Osu333DXhA3ZhD8lEzRdePUl0Jf8_o
function initMap() {
  var map = new Microsoft.Maps.Map(document.getElementById("map"), {
    center: new Microsoft.Maps.Location(31.0461, 34.8516), // Set the initial center of the map to Israel
    zoom: 8, // Set the initial zoom level
  });

  // Load points from the database
  $.ajax({
    url: "https://kitur-front-project.onrender.com/point",
    method: "GET",
    success: function (data) {
      data.forEach(function (point) {
        addMarker(map, point.latitude, point.longitude);
      });
    },
    error: function (error) {
      console.error("An error occurred while loading points:", error);
    },
  });
}

function addMarker(map, lat, lng) {
  var location = new Microsoft.Maps.Location(lat, lng);

  var pushpin = new Microsoft.Maps.Pushpin(location, null);
  map.entities.push(pushpin);
}

/* finish add map to the ourShops */

/* start socket Io */

function initiLiveChat() {
  let userTest = localStorage.getItem("user");
  userTest = JSON.parse(userTest);
  const socket = io("http://localhost:3005", {
    transports: ["websocket"],
  });

  socket.on("connect", function () {
    console.log("Connected to socket.io server");
  });

  socket.on("message", function (message) {
    console.log("Received message:", message);
    appendMessage(message);
  });

  // Send chat message when the send button is clicked
  $("#sendButton").click(function () {
    const message = $("#messageInput").val();
    if (message.trim() !== "") {
      socket.emit("message", userTest.email + ": " + message);
      // appendMessage("You: " + message);
      $("#messageInput").val("");
    }
  });

  // Append the message to the chat container
  function appendMessage(message) {
    const currentDate = new Date().toLocaleString();
    const sanitizedMessage = $("<div>").text(message).html(); // Sanitize the message
    const li = $("<li style='color:black'>").text(sanitizedMessage);
    const timeSpan = $("</br><span style='font-size: 10px'>")
      .addClass("message-time")
      .text(currentDate);
    li.append(timeSpan);
    $("#messageList").append(li);
    $("#chatContainer").scrollTop($("#chatContainer")[0].scrollHeight);
  }
}

/* end socket Io */
function validationUser() {
  let userTest = localStorage.getItem("user");
  userTest = JSON.parse(userTest);
  if (!userTest) {
    alert("You must be logged in to use this feature");
    window.location.href = "HomePage.html";
  }
}

$(document).ready(function () {
  initiLiveChat();
  fetchGames();
  getCategoryByName("Featured");
  getCategoryByName("Special Offers");
});
