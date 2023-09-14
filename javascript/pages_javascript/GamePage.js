// Get the encoded game object from the URL query parameters
const params = new URLSearchParams(window.location.search);
const encodedGame = params.get("game");

// Decode the encoded game object and parse it as JSON
const game = JSON.parse(decodeURIComponent(encodedGame));
let userGamePage = JSON.parse(localStorage.getItem("user"));
// Use the game object for further processing

// add the main header to the gamePage
$("#header").append(`${game.name}`);
$("#headerContainer").append(
  `
<div class="col">
<div>
<video width="100%" height="315" controls autoplay>
<source src="${game.video}" type="video/mp4">
<source src="movie.ogg" type="video/ogg">
Your browser does not support the video tag.
</video>
</div>
<div>
  <div
    class="row gx-1 gy-2 gx-sm-3 row-cols-3 row-cols-sm-5 row-cols-lg-5 row-cols-md-6"
  >
    <div class="col">
      <div class="d-flex align-items-start">
        <img
          width="90vw"
          height="90vh"
          src='${game.images[0]}'
        /><i
          class="far fa-play-circle text-dark align-self-center"
          style="
            position: absolute;
            font-size: 37px;
            display: block;
            margin-left: 0;
            padding-left: 26.5px;
          "
        ></i>
      </div>
    </div>
    <div class="col">
      <div class="d-flex align-items-start">
        <img
          src='${game.images[1]}'
          width="90vw"
          height="90vh"
        />
      </div>
    </div>
    <div class="col">
      <div class="d-flex align-items-start">
        <img
          src='${game.images[2]}'
          width="90vw"
          height="90vh"
        />
      </div>
    </div>
    <div class="col">
      <div class="d-flex align-items-start">
        <img
          width="90vw"
          height="90vh"
          src='${game.images[3]}'
        />
      </div>
    </div>
  </div>
</div>
</div>
<div class="col">
<div
  class="text-center d-flex flex-column align-items-xl-center"
  style="height: 100%; width: 100%"
>
  <img
    class="align-self-center"
    style="width: 80%; height: 35%; margin-top: 1rem"
    src='${game.backGroundImage}'
  />
  <p class="text-white align-self-center" style="margin-top: 1rem">
    ${game.description}
    <br /><br />
  </p>
  <span class="text-secondary align-self-center"
    >Release date: ${game.releaseDate}</span
  ><span class="text-secondary align-self-center"
    >Developers: ${getDevelopers()}</span
  ><span
    class="text-secondary align-self-center"
    style="margin-bottom: 0.8rem"
    >Publishers: ${getPublishers()}</span
  ><button
    onclick="addToWishList('${game._id}')"
    class="btn btn-primary align-self-center"
    type="button"
    style="max-width: 50%; margin-bottom: 0"
  >
    Add To Wishlist
  </button>
</div>
</div>
`
);
$("#Available").append(
  `
    <div
    class="col-md-12 text-bg-secondary d-flex justify-content-between"
    style="
      padding-right: 0px;
      padding-left: 0px;
      margin-bottom: 0.5rem;
      border-color: var(--bs-red);
    "
  >
    <div class="text-center d-flex d-lg-flex">
      <span
        class="text-capitalize fw-bold align-self-center"
        style="padding-left: 0.3rem"
        >Buy ${game.name}</span
      >
    </div>
    <div
      class="border-secondary d-flex d-lg-flex align-self-center"
      style="background: #000000"
    >
      <div class="d-flex">
        <span
          class="fw-bold text-white d-sm-flex align-self-center"
          style="margin-left: 0.2rem"
          >${game.price}$</span
        >
      </div>
      <div>
        <button
        onclick="addToCart('${game._id}')"
          class="btn btn-success border rounded-pill border-dark"
          data-bss-hover-animate="pulse"
          type="button"
          style="
            margin-right: 0.2rem;
            margin-top: 0.2rem;
            margin-bottom: 0.2rem;
            margin-left: 0.2rem;
          "
        >
          Add To Cart
        </button>
      </div>
    </div>
  </div>
  <div
    class="col-md-12 text-bg-secondary d-flex justify-content-between"
    style="
      padding-right: 0px;
      padding-left: 0px;
      margin-bottom: 0.5rem;
      border-color: var(--bs-red);
    "
  >
    <div class="text-center d-flex d-lg-flex">
      <span
        class="text-capitalize fw-bold align-self-center"
        style="padding-left: 0.3rem"
        >Buy ${game.name} Premium Edition</span
      >
    </div>
    <div
      class="d-flex d-lg-flex align-self-center"
      style="background: rgb(0, 0, 0)"
    >
      <div class="d-flex">
        <span
          class="fw-bold text-white d-sm-flex align-self-center"
          style="margin-left: 0.2rem"
          >${Math.floor((game.price + 10) * 1000) / 1000}$</span
        >
      </div>
      <div>
        <button
        onclick="addToCart('${game._id}')"
          class="btn btn-success border rounded-pill border-dark"
          data-bss-hover-animate="pulse"
          type="button"
          style="
            margin-right: 0.2rem;
            margin-top: 0.2rem;
            margin-bottom: 0.2rem;
            margin-left: 0.2rem;
          "
        >
          Add To Cart
        </button>
      </div>
    </div>
  </div>
    `
);

/* start add to cart */
async function addToCart(id) {
  if (!userGamePage) {
    alert("You must be logged in to add to cart");
    return;
  }
  // take cart item from the cookie
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

/* start add to wish list */
async function addToWishList(id) {
  if (!userGamePage) {
    alert("You must be logged in to add an item to wishlist");
    return;
  }

  let newUserTest = await getUserGamePage();
  // if the user dont have a wishlist , we need to create a new one
  if (newUserTest.wishList.length == 0) {
    createWishList(newUserTest._id, id);
    return;
  }
  // if we already had a wishlist: update
  let wishListObject = await getWishList(newUserTest.wishList[0]);
  updateWishList(newUserTest.wishList[0], wishListObject, id);
}

async function createWishList(id, gameId) {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/wishList/",
    method: "POST",
    data: {
      user: id,
      games: gameId,
    },
    success: function (response) {
      alert("Game added to wishlist");
    },
    error: function (xhr) {
      if (xhr.status == 400) {
        alert("Game already in wishlist");
      }
    },
  });
}

async function updateWishList(id, wishListObject, newGameId) {
  $.ajax({
    url: "https://kitur-front-project.onrender.com/wishList/",
    method: "PATCH",
    data: {
      id: id,
      wishList: newGameId,
    },
    success: function (response) {
      alert("Game added to wishlist");
    },
    error: function (xhr) {
      if (xhr.status == 400) {
        alert("Game already in wishlist");
      }
    },
  });
}

function getWishList(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://kitur-front-project.onrender.com/wishlist/" + id,
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
        reject(xhr); // Reject the promise with the error object
      },
    });
  });
}

async function getUserGamePage() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url:
        "https://kitur-front-project.onrender.com/profile/email/" +
        userGamePage.email,
      method: "GET",
      success: function (response) {
        resolve(response); // Resolve the promise with the response
      },
      error: function (xhr) {
        reject(xhr.responseText); // Reject the promise with the error message
      },
    });
  });
}

/* end add to wish list */

function getDevelopers() {
  const developers = [];
  for (let i = 0; i < game.developers.length; i++) {
    developers.push(game.developers[i] + ", ");
  }
  return developers;
}
function getPublishers() {
  const publishers = [];
  for (let i = 0; i < game.publishers.length; i++) {
    publishers.push(game.publishers[i] + ", ");
  }
  return publishers;
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

function sendToSearchPage() {
  window.location.href = "SearchPage.html";
}

$(document).ready(function () {});
