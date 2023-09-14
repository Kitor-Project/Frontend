let localUser = JSON.parse(localStorage.getItem("user"));
if (!localUser) {
  window.location.href = "HomePage.html";
}
getUser();
function getUser() {
  $.ajax({
    url: "https://kitur-project.onrender.com/profile/email/" + localUser.email,
    method: "GET",
    success: function (response) {
      localUser = response;
      initializedProfileHeader();
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}
function fetchGame(gameId, categoryName) {
  $.ajax({
    url: "https://kitur-project.onrender.com/game/" + gameId,
    method: "GET",
    success: function (response) {
      if (!response) {
        return;
      }
      if (categoryName.localeCompare("PurchasedGames") == 0) {
        if (!response) {
          let cart = localStorage.getItem("cart");
          let gameArray = cart.split(",");
          let index = gameArray.indexOf(gameId);
          gameArray.splice(index, 1);
          localStorage.setItem("cart", gameArray);
          location.reload();
          return;
        }
        addItemList(
          response.backGroundImage,
          response.name,
          response.price,
          response._id
        );
        $("#purchased-games").append(
          `
            <div class="d-flex align-items-center" 
            onmouseout="this.style.opacity='1';" 
            onmouseover="this.style.opacity='0.5';" style="cursor:pointer;"  onclick="sendToGamePage('${response._id}')">
              <img
                src=${response.backGroundImage}
                width="110px"
                height="80px"
                style="border-radius: 25px; margin-right: 0.5rem"
              />
              <h4 class="text-white">${response.name}</h4>
            </div>
          `
        );
      }
      if (categoryName.localeCompare("WishList") == 0) {
        $("#wishListGames").append(
          `
            <div class="d-flex align-items-center"
            onmouseout="this.style.opacity='1';" 
            onmouseover="this.style.opacity='0.5';" style="cursor:pointer;" onclick="sendToGamePage('${response._id}')">
              <img
                src=${response.backGroundImage}
                width="110px"
                height="80px"
                style="border-radius: 25px; margin-right: 0.5rem"
              />
              <h4 class="text-white">${response.name}</h4>
            </div>
          `
        );
      }
      return response;
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

function fetchWishList(wishListId) {
  $.ajax({
    url: "https://kitur-project.onrender.com/wishList/" + wishListId,
    method: "GET",
    success: function (response) {
      // Perform any additional actions with the response data here
      for (let i = 0; i < response.games.length; i++) {
        if (response) {
          fetchGame(response.games[i], "WishList");
        }
      }
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

async function initializedProfileHeader() {
  $("#profileHeader").append(
    `${
      localUser.name.charAt(0).toUpperCase() + localUser.name.slice(1)
    }'s Profile`
  );
  $("#profileName").append(
    `${localUser.name.charAt(0).toUpperCase() + localUser.name.slice(1)}`
  );
  $("#profileLocation").append(
    `${
      localUser.location.charAt(0).toUpperCase() + localUser.location.slice(1)
    }`
  );
  $("#profileHeaderImage")
    .attr("src", localUser.image)
    .attr("alt", localUser.name + " image");

  if (localUser.wishList.length == 0) {
    $("#wishListGames").append(
      `
        <div class="d-flex align-items-center">
          <h4 class="text-white">No games in wish list yet</h4>
        </div>
      `
    );
  } else {
    fetchWishList(localUser.wishList[0]);
  }
  //run all over the user.orders and put all the games into a list, if the game is already in the list don't add him, the games its array to
  let purchasedGames = [];
  if (localUser.orders.length == 0) {
    $("#purchased-games").append(
      `
        <div class="d-flex align-items-center">
          <h4 class="text-white">No purchased games yet</h4>
        </div>
      `
    );
  } else {
    for (let i = 0; i < localUser.orders.length; i++) {
      for (let j = 0; j < localUser.orders[i].games.length; j++) {
        if (!purchasedGames.includes(localUser.orders[i].games[j])) {
          purchasedGames.push(localUser.orders[i].games[j]);
        }
      }
    }
    for (let i = 0; i < purchasedGames.length; i++) {
      fetchGame(purchasedGames[i], "PurchasedGames");
    }
  }

  // open the scroll bar Y inside this container after 4 games
  if ($("#test").children().length > 2) {
    $("#test").css("overflow-y", "scroll");
  }
}

/*START Bottom list*/

// add the games to bottom list.
function addItemList(headerImageSource, title, price, id) {
  const newCarouselItem = `
        <div
          class="col-md-12 text-bg-secondary d-flex justify-content-between game-card"
          style="
              padding-right: 0px;
              padding-left: 0px;
              margin-bottom: 0.5rem;
              border-color: var(--bs-red);
          "
          >
          <div class="d-lg-flex">
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
              <div class="d-flex d-lg-flex align-self-center">
              <button
              onclick="sendToGamePage('${id}')"
                class="btn btn-dark border rounded-pill border-dark"
                type="button"
                style="margin-right: 0.5rem"
              >
                Game Page
              </button>
            </div>
          </div>
        </div>
      `;
  const $newCarouselItem = $(newCarouselItem); // Convert the HTML string to a jQuery object

  $("#lastContainer").append($newCarouselItem);

  // open the scroll bar Y inside this container after 4 games
  if ($("#lastContainer").children().length > 4) {
    $("#lastContainer").css("overflow-y", "scroll");
  }
}

function sendToGamePage(id) {
  $.ajax({
    url: "https://kitur-project.onrender.com/game/" + id,
    method: "GET",
    success: function (response) {
      if (!response) {
        return;
      }
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "GamePage.html?game=" + encodedGame;
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}
/*ENDBottom list*/

function sendToCategoryPage(name) {
  $.ajax({
    url: "https://kitur-project.onrender.com/category/" + name,
    method: "GET",
    success: function (response) {
      if (!response) {
        return;
      }
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "CategoryPage.html?category=" + encodedGame;
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
  getUser();
});
