let userCartPage = JSON.parse(localStorage.getItem("user"));
if (!userCartPage) {
  window.location.href = "HomePage.html";
}
userCartPage = getUserFromCartPage();
let cart = localStorage.getItem("cart");

function addItemsToCartListContainer(headerImageSource, title, price, id) {
  const newCarouselItem = `
    <div
      class="col-md-12 text-bg-secondary d-flex justify-content-between"
      style="
        padding-right: 0px;
        padding-left: 0px;
        margin-bottom: 0.5rem;
        border-color: var(--bs-red);
      "
    >
      <div class="d-lg-flex" onclick="moveToGamePageOnClick('${id}')" data-game-id=${id}
      onmouseout="this.style.opacity='1';" 
      onmouseover="this.style.opacity='0.5';"
      style="cursor: pointer;"
      >
        <img
          class="img-fluid"
          src=${headerImageSource}
          width="100vw"
          height="100vh"
          style="margin-right: 0.3rem; padding-top: 0.3rem; padding-bottom: 0.3rem;"
        /><span class="text-capitalize fw-bold align-self-center"
          >${title}</span
        >
      </div>
      <div class="d-lg-flex align-self-center">
        <span
          class="fw-bold d-sm-flex align-self-center"
          style="margin-right: 0.5rem"
          >${price}$</span
        ><button
        onclick="removeItemFromCart('${id}')"
          class="btn btn-danger border rounded-pill border-dark"
          type="button"
          style="margin-right: 0.5rem"
        >
          Remove
        </button>
      </div>
  </div>
  `;
  const $newCarouselItem = $(newCarouselItem);

  $("#shoppingCartContainer").append($newCarouselItem);

  if ($("#shoppingCartContainer").children().length == 1) {
    $newCarouselItem.css("margin-top", "0.5rem");
  }

  // open the scroll bar Y inside this container after 8 games
  if ($("#shoppingCartContainer").children().length > 8) {
    $("#shoppingCartContainer").css("overflow-y", "scroll");
  }
}

/* start fill cart */
function initCartContainer() {
  let games = localStorage.getItem("cart");
  if (games == null || games == "") {
    $("#shoppingCartContainer").append(
      `<h1 class="text-center">Your cart is empty</h1>`
    );
    return;
  }
  let gameArray = games.split(",");
  gameArray.forEach((game) => {
    fetchGame(game, true);
  });
}

function removeItemFromCart(id) {
  let cart = localStorage.getItem("cart");
  let gameArray = cart.split(",");
  let index = gameArray.indexOf(id);
  gameArray.splice(index, 1);
  localStorage.setItem("cart", gameArray);
  location.reload();
}

async function buyNow() {
  if (userCartPage == null) {
    alert("You must be logged in to buy games");
    window.location.href = "HomePage.html";
  }
  if (cart.length == 0) {
    alert("Your cart is empty");
    window.location.href = "HomePage.html";
  }
  let games = localStorage.getItem("cart");
  let gameArray = games.split(",");
  let order = {
    user: userCartPage,
    games: gameArray,
    orderNumber: 9,
  };
  $.ajax({
    url: "http://localhost:3000/order/",
    method: "POST",
    contentType: "application/json", // Set the content type to JSON
    data: JSON.stringify({ order: order }),
    success: function (response) {
      setTimeout(() => {
        localStorage.setItem("cart", "");
        window.location.href = "HomePage.html";
      }, 5000);
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

function postToFacebook() {
  // Set up the necessary parameters
  // don't forget to generate your access token every day,  https://developers.facebook.com/tools/explorer/1288162832138619/?method=POST&path=116821598103786%2Ffeed%3Fmessage%3DTest%20from%20APIgdfgfdgdf&version=v17.0
  const accessToken =
    "EAASTk8gFwXsBAFYLuiCO8SZCaaPrz6stSk5piewG0uNUZAhXhYb7CggKeoXcydBEsY6j7iBF6HZAaws255xF9Ixn4xZAOKncGiMnlD8eq7rj9C6Fvq3CUqoUPHOjCNg02yEMnNym2tdEDXsUJOpKOvrucSgHXCKIytYC47sQBHbV2H6fEZAyKoiZC0cWn1dVShH36uisANzBHUruveDvZB4";
  const postMessage = `Attention all Kiotor lovers! The wait is finally over - the highly anticipated *** is now showing at CinemaWorld!
          Come and experience this amazing film on our luxurious screens and state-of-the-art sound systems. Our team of experienced projectionists and sound engineers have worked tirelessly to ensure that every detail is perfect, so you can immerse yourself fully in this captivating movie.`;
  var pageId = "116821598103786";

  // Construct the API endpoint URL
  var apiUrl = "https://graph.facebook.com/v16.0/" + pageId + "/feed";

  // Set up the post data
  var postData = {
    message: postMessage,
    access_token: accessToken,
  };

  // Send the post request
  $.ajax({
    url: apiUrl,
    type: "POST",
    data: postData,
    success: function (response) {
      alert("Post successfully sent!");
    },
    error: function (xhr, status, error) {
    },
  });
}

/* end fill cart */

function moveToGamePageOnClick(id) {
  fetchGame(id, false);
}

function fetchGame(gameId, boolean) {
  $.ajax({
    url: "http://localhost:3000/game/" + gameId,
    method: "GET",
    success: function (response) {
      if (!response) {
        let cart = localStorage.getItem("cart");
        let gameArray = cart.split(",");
        let index = gameArray.indexOf(gameId);
        gameArray.splice(index, 1);
        localStorage.setItem("cart", gameArray);
        location.reload();
        return;
      }
      if (boolean == false) {
        const encodedGame = encodeURIComponent(JSON.stringify(response));
        window.location.href = "GamePage.html?game=" + encodedGame;
      } else {
        addItemsToCartListContainer(
          response.backGroundImage,
          response.name,
          response.price,
          response._id
        );
      }
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

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
      // Handle the error
    },
  });
}

async function getUserFromCartPage() {
  $.ajax({
    url: "http://localhost:3000/profile/email/" + userCartPage.email,
    method: "GET",
    success: function (response) {
      userCartPage = response;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

function sendToSearchPage() {
  window.location.href = "SearchPage.html";
}

$(document).ready(function () {
  initCartContainer();
});
