let userWishListPage = JSON.parse(localStorage.getItem("user"));
if (!userWishListPage) {
  window.location.href = "HomePage.html";
}

function addItemsToWishListContainer(headerImageSource, title, price, id) {
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
          onclick="addToCart('${id}')"
          class="btn btn-success border rounded-pill border-dark"
          type="button"
          style="margin-right: 0.5rem"
        >
          Add To Cart</button
        ><button
        onclick="removeFromWishList('${id}')"
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

  $("#wishListContainer").append($newCarouselItem);

  if ($("#wishListContainer").children().length == 1) {
    $newCarouselItem.css("margin-top", "0.5rem");
  }

  // open the scroll bar Y inside this container after 8 games
  if ($("#wishListContainer").children().length > 8) {
    $("#wishListContainer").css("overflow-y", "scroll");
  }
}

/* start add to cart */
async function addToCart(id) {
  let cart = localStorage.getItem("cart");

  if (cart) {
    if (cart.includes(id)) {
      alert("This game is already in your cart");
      return;
    }
    cart = cart + "," + id;
    alert("Game added to cart");
  } else {
    cart = id;
    alert("Game added to cart");
  }

  localStorage.setItem("cart", cart);
}

/* end add to cart */

/* start remove from wish list */
async function removeFromWishList(gameId) {
  console.log("remove from wish list : ", gameId);
  console.log("User: ", userWishListPage);
  let wishListPage = await getWishList(userWishListPage.wishList[0]);
  console.log("Wishlistpage: ", wishListPage);

  for (let i = 0; i < wishListPage.games.length; i++) {
    if (wishListPage.games[i] == gameId) {
      wishListPage.games.splice(i, 1);
      break;
    }
  }

  console.log("WishlistpageAFTER: ", wishListPage);

  let finishWishList = "";
  for (let i = 0; i < wishListPage.games.length; i++) {
    if (i == wishListPage.games.length - 1) {
      finishWishList += wishListPage.games[i];
    } else {
      finishWishList += wishListPage.games[i] + ",";
    }
  }
  console.log("finishWishList: ", finishWishList);

  let test = {
    id: wishListPage._id,
    games: finishWishList,
    user: wishListPage.user,
    remove: true,
  };

  updateWishList(userWishListPage.wishList[0], test);
  location.reload();
}

async function updateWishList(id, wishListPage) {
  console.log("update wish list : ", id, wishListPage);
  $.ajax({
    url: "http://localhost:3000/wishList/",
    method: "PATCH",
    data: wishListPage,
    data: wishListPage,
    success: function (response) {
      alert("Game remove from WishList");
    },
    error: function (xhr) {
      if (xhr.status == 400) {
        alert("Something went wrong");
      }
      console.log(xhr);
    },
  });
}

async function getWishList(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:3000/wishlist/" + id,
      method: "GET",
      success: function (response) {
        resolve(response); // Resolve the promise with the response
      },
      error: function (xhr) {
        if (xhr.status == 400) {
          alert("WishList not fonud");
          return;
        }
        if (xhr.status == 401) {
          alert("WishList not fonud");
          return;
        }
        console.log(xhr);
        reject(xhr); // Reject the promise with the error object
      },
    });
  });
}

/* end remove from wish list */

function moveToGamePageOnClick(id) {
  fetchGame(id, false);
}

function fetchGame(gameId, boolean) {
  $.ajax({
    url: "http://localhost:3000/game/" + gameId,
    method: "GET",
    success: function (response) {
      //   window.location.href = "http://localhost:3000/game/" + gameId;
      if (!response) {
        return;
      }
      if (boolean == false) {
        const encodedGame = encodeURIComponent(JSON.stringify(response));
        window.location.href = "GamePage.html?game=" + encodedGame;
      } else {
        addItemsToWishListContainer(
          response.backGroundImage,
          response.name,
          response.price,
          response._id
        );
      }
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      console.log(xhr.responseText);
      // Handle the error
    },
  });
}

function getUserFromWishlistPage() {
  $.ajax({
    url: "http://localhost:3000/profile/email/" + userWishListPage.email,
    method: "GET",
    success: function (response) {
      userWishListPage = response;
      if (userWishListPage.wishList.length == 0) {
        $("#wishListContainer").append(
          "<p id='empty'>Your wish list is empty</p>"
        );
      } else {
        for (let i = 0; i < userWishListPage.wishList.length; i++) {
          $.ajax({
            url:
              "http://localhost:3000/wishList/" + userWishListPage.wishList[i],
            method: "GET",
            success: function (response) {
              for (let j = 0; j < response.games.length; j++) {
                fetchGame(response.games[j], true);
              }
              // Perform any additional actions with the response data here
            },
            error: function (xhr) {
              console.log(xhr.responseText);
              // Handle the error
            },
          });
        }
      }

      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      console.log(xhr.responseText);
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
  getUserFromWishlistPage();
});
