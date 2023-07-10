/*START Take the Params from the URL */
const params = new URLSearchParams(window.location.search);
const encodedGame = params.get("game");
const filterGame = JSON.parse(decodeURIComponent(encodedGame));

if (filterGame != null) {
  $("#searchBarFilter").val(filterGame);
}

/*Start Bottom List */
let sortDirection = "ascending";
let showOnSaleOnly = false; // Initialize the variable to track the "On Sale" filter status

function addItemListBottom(backGroundImage, name, price, id, onSale) {
  if (encodedGame != null && name.includes(filterGame) == false) {
    return;
  }

  // Check if the game should be filtered based on the "On Sale" status
  if (showOnSaleOnly && !onSale) {
    return;
  }

  const newCarouselItem = `
    <div
      data-game-id="${id}"
      data-price="${price}"
      class="col-md-12 text-bg-secondary d-flex justify-content-between"
      style="
        padding-right: 0px;
        padding-left: 0px;
        margin-bottom: 0.5rem;
        border-color: var(--bs-red);
      "
    >
      <div
        class="d-flex d-lg-flex flex-wrap game-info"
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
        />
        <span class="text-capitalize fw-bold align-self-center">${name}</span>
      </div>
      <div class="d-flex d-lg-flex align-self-center">
        <span class="fw-bold d-sm-flex align-self-center" style="margin-right: 0.5rem">${price}$</span>
        <button
          class="btn btn-dark border rounded-pill border-dark game-page-button"
          type="button"
          style="margin-right: 0.5rem"
        >
          Game Page
        </button>
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

function sortItemsByPrice(direction) {
  const items = $("#lastContainer").children().get();

  items.sort(function (a, b) {
    const priceA = parseFloat($(a).data("price"));
    const priceB = parseFloat($(b).data("price"));

    if (direction === "ascending") {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

  $("#lastContainer").empty().append(items);
}

function sortItemsByName(direction) {
  const items = $("#lastContainer").children().get();

  items.sort(function (a, b) {
    const nameA = $(a).find(".align-self-center").text().toLowerCase();
    const nameB = $(b).find(".align-self-center").text().toLowerCase();

    if (direction === "ascending") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  $("#lastContainer").empty().append(items);
}

function sortItemsByValue(value) {
  if (value === "") {
    $("#lastContainer").empty();
    fetchGames();
    return;
  }
  const items = $("#lastContainer").children().get();
  const filteredItems = [];

  items.forEach((item) => {
    const itemName = $(item).find(".align-self-center").text().toLowerCase();
    if (itemName.includes(value)) {
      filteredItems.push(item);
    }
  });

  $("#lastContainer").empty().append(filteredItems);
}

function fetchGame(gameId) {
  $.ajax({
    url: "http://localhost:3000/game/" + gameId,
    method: "GET",
    success: function (response) {
      console.log(response);
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "GamePage.html?game=" + encodedGame;
    },
    error: function (xhr) {
      console.log(xhr.responseText);
    },
  });
}

function fetchGames() {
  $.ajax({
    url: "http://localhost:3000/game",
    type: "GET",
    success: function (response) {
      console.log("FetchGames Response: ", response);
      response.forEach((game) => {
        addItemListBottom(
          game.backGroundImage,
          game.name,
          game.price,
          game._id,
          game.onSale
        );
      });

      sortItemsByPrice(sortDirection);
    },
    error: function (xhr, status, error) {
      console.log("AJAX request failed: " + error);
    },
  });
}

function capitalizeFirstLetter(string) {
  return string.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

function sendToCategoryPage(name) {
  $.ajax({
    url: "http://localhost:3000/category/" + name,
    method: "GET",
    success: function (response) {
      const encodedGame = encodeURIComponent(JSON.stringify(response));
      window.location.href = "CategoryPage.html?category=" + encodedGame;
    },
    error: function (xhr) {
      console.log(xhr.responseText);
    },
  });
}

$(document).ready(function () {
  fetchGames();

  $("#searchBarFilter").on("input", function (event) {
    let value = $(this).val().toLowerCase();
    if (event.originalEvent.inputType === "deleteContentBackward") {
      value = "";
      $(this).val("");
    }
    sortItemsByValue(value);
  });

  $("#lastContainer").on("click", ".game-info", function () {
    const gameId = $(this).closest(".col-md-12").data("game-id");
    fetchGame(gameId);
  });

  $("#lastContainer").on("click", ".game-page-button", function () {
    const gameId = $(this).closest(".col-md-12").data("game-id");
    fetchGame(gameId);
  });

  $("#sortPriceBtn").click(function () {
    if (sortDirection === "ascending") {
      sortDirection = "descending";
      $(this).text("Sort Price (Descending)");
    } else {
      sortDirection = "ascending";
      $(this).text("Sort Price (Ascending)");
    }

    sortItemsByPrice(sortDirection);
  });

  $("#sortNameBtn").click(function () {
    if (sortDirection === "ascending") {
      sortDirection = "descending";
      $(this).text("Sort Price (Descending)");
    } else {
      sortDirection = "ascending";
      $(this).text("Sort Price (Ascending)");
    }

    sortItemsByName(sortDirection);
  });

  $("#formCheck-4").change(function () {
    showOnSaleOnly = $(this).is(":checked");

    // Clear the container before fetching games again
    $("#lastContainer").empty();

    // Fetch games with the updated filter
    fetchGames();
  });
});
