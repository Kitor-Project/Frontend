function addItemList(headerImageSource, title, price, id) {
  if (!headerImageSource || !title || !price || !id) {
    return;
  }
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
          <div class="d-lg-flex"
          onclick="moveToGamePageOnClick('${id}')" data-game-id=${id}
          onmouseout="this.style.opacity='1';" 
          onmouseover="this.style.opacity='0.5';"
          style="cursor: pointer;">
              <img
                class="img-fluid"
                src=${headerImageSource}
                width="100vw"
                height="100vh"
                style="margin-right: 0.3rem"
              />
              <span class="text-capitalize fw-bold align-self-center">${title}</span>
          </div>
          <div class="d-flex d-lg-flex align-self-center">
            <span
              class="fw-bold d-sm-flex align-self-center"
              style="margin-right: 0.5rem"
              >${price}$</span
            ><button
              onclick="editGame('${id}')"
              class="btn btn-warning border rounded-pill border-dark"
              type="button"
              style="margin-right: 0.5rem"
              data-bs-target="#modal-4"
              data-bs-toggle="modal"
            >
              Edit</button
            ><button
            onclick="removeGame('${id}')"
              class="btn btn-danger border rounded-pill border-dark"
              type="button"
              style="margin-right: 0.5rem"
            >
              Remove
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

  $("#allGamesContainer").append($newCarouselItem);

  // open the scroll bar Y inside this container after 4 games
  if ($("#allGamesContainer").children().length > 4) {
    $("#allGamesContainer").css("overflow-y", "scroll");
  }
}

function moveToGamePageOnClick(id) {
  fetchGame(id, false);
}

/* start edit button */
function editGame(id) {
  if (user.isAdmin != true) {
    alert("You are not admin");
    window.location.href = "HomePage.html";
  }
  let game = allGamesArray.find((game) => game._id == id);
  $("#gameEditName").val(game.name);
  $("#gameEditPrice").val(game.price);

  $("#gameEditForm").submit(function (e) {
    e.preventDefault(); //dont refresh
    let name = $("#gameEditName").val();
    let price = $("#gameEditPrice").val();
    $.ajax({
      url: "http://localhost:3000/game/",
      type: "PATCH",
      contentType: "application/json", // Set the content type to JSON
      data: JSON.stringify({
        userId: user._id,
        id: id,
        game: { name: name, price: price },
      }),
      success: function (response) {
        // Handle the successful response
        location.reload();
      },
      error: function (xhr, status, error) {
        // Handle the error
        if (xhr.status == 400) {
          alert("Game is edditied successfully");
          location.reload();
        }
      },
    });
  });
}

/* end edit button */

/* Start remove game from the database */
function removeGame(id) {
  if (user.isAdmin != true) {
    alert("You are not admin");
    window.location.href = "HomePage.html";
  }
  $.ajax({
    url: "http://localhost:3000/game/",
    type: "DELETE",
    data: {
      id: id,
      userId: user._id,
    },
    success: function (response) {
      // Handle the successful response
      location.reload();
    },
    error: function (xhr, status, error) {
      // Handle the error
    },
  });
}

/* End remove game from database */
const allGamesArray = [];
function fetchGames() {
  $.ajax({
    url: "http://localhost:3000/game",
    type: "GET",
    success: function (response) {
      // Handle the successful response
      return response.map((game) => {
        addItemList(game.backGroundImage, game.name, game.price, game._id);
        allGamesArray.push(game);
      });
    },
    error: function (xhr, status, error) {
      // Handle the error
    },
  });
}

function fetchGame(gameId, boolean) {
  $.ajax({
    url: "http://localhost:3000/game/" + gameId,
    method: "GET",
    success: function (response) {
      //   window.location.href = "http://localhost:3000/game/" + gameId;
      if (boolean == false) {
        const encodedGame = encodeURIComponent(JSON.stringify(response));
        window.location.href = "GamePage.html?game=" + encodedGame;
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

function sendToSearchPage() {
  window.location.href = "SearchPage.html";
}

//show statistic - button:

//start create first graph - average amount of purchases per month
function fetchTotalNumberOfPurchase() {
  if (!user.email) {
    alert("You are not admin.");
    window.location.href = "HomePage.html";
  }
  $(document).ready(function () {
    $.ajax({
      url: "http://localhost:3000/statistic/totalNumberOfPurchasesPerMonth",
      dataType: "json",
      success: function (data) {
        drawChart(data.months, data.totals); //actually drawing it 
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
    });
  });
}

function drawChart(months, totals) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scaleBand().range([0, width]).padding(0.1);

  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = months.map(function (month, index) {
    return {
      month: month,
      total: totals[index],
    };
  });

  x.domain(
    data.map(function (d) {
      return d.month;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.total;
    }),
  ]);

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.month);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.total);
    })
    .attr("height", function (d) {
      return height - y(d.total);
    });

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").attr("class", "y axis").call(yAxis);
}
//end create first graph - average amount of purchases per month


//start create second graph - number of purchases per month
function fetchCumulativeAmountOfPurchasesPerMonth() {
  if (!user.email) {
    alert("You are not admin.");
    window.location.href = "HomePage.html";
  }
  $.ajax({
    url: "http://localhost:3000/statistic/cumulativeAmountOfPurchasesPerMonth",
    dataType: "json",
    success: function (data) {
      drawSecondChart(data.months, data.averages);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}

function drawSecondChart(months, averages) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%Y-%m");

  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  var line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.averageAmount);
    });

  var svg = d3
    .select("#secondChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = months.map(function (month, index) {
    return {
      date: parseDate(month),
      averageAmount: averages[index],
    };
  });

  x.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.averageAmount;
    }),
  ]);

  svg.append("path").datum(data).attr("class", "line").attr("d", line);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").attr("class", "y axis").call(yAxis);

  // Add a circle for the current data point
  var currentData = data[data.length - 1];

  svg
    .append("circle")
    .attr("class", "current-point")
    .attr("cx", x(currentData.date))
    .attr("cy", y(currentData.averageAmount))
    .attr("r", 6);
}

function categoryTest(name) {
  $("#categoryNewGame").text(name);
  $("#categoryNewGame").val(name);
}

function fetchCategory(name) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "http://localhost:3000/category/" + name,
      dataType: "json",
      success: function (data) {
        resolve(data._id); // Resolve the promise with the _id value
      },
      error: function (xhr, status, error) {
        reject(error); // Reject the promise with the error
      },
    });
  });
}
//end create second graph - number of purchases per month
//show statistic - button - end

async function addNewGame() {
  $("#addNewGame").submit(async function (event) {
    event.preventDefault();
    const testUser = await getUserFromManagerPage();
    if (testUser.isAdmin != true) {
      alert("You are not admin");
      window.location.href = "HomePage.html";
    }
    sale = true;
    for (var i = 0; i < allGamesArray.length; i++) {
      if (allGamesArray[i].name == $("#gameNameNewGame").val()) {
        alert("Game already exists");
        return;
      }
    }
    try {
      const categoryId = await fetchCategory($("#categoryNewGame").val());

      var game = {
        userId: testUser._id,
        name: $("#gameNameNewGame").val(),
        price: $("#priceNewGame").val(),
        category: categoryId,
        description: $("#descriptionNewGame").val(),
        images:
          $("#imagesNewGame1").val() +
          "," +
          $("#imagesNewGame2").val() +
          "," +
          $("#imagesNewGame3").val() +
          "," +
          $("#imagesNewGame4").val(),
        releaseDate: $("#releaseDateNewGame").val(),
        video: $("#videoNewGame").val(),
        developers: $("#developersNewGame").val(),
        publishers: $("#publishersNewGame").val(),
        backGroundImage: $("#titleImageNewGame").val(),
        id: $("#gameIdNewGame").val(),
        onSale: sale,
        numberOfPurchase: 0,
      };

      $.ajax({
        url: "http://localhost:3000/game",
        type: "POST",
        data: game,
        success: function (data) {
          alert("Game added successfully");
          window.location.href = "HomePage.html";
        },
        error: function (xhr, status, error) {
          if (xhr.stauts == 402) {
            alert("Game already exists");
          }
          if (xhr.status == 400) {
            alert("All fields are required / Invalid input.");
          }
          if (xhr.status == 200) {
            alert("Game added successfully");
            window.location.href = "HomePage.html";
          }
          console.error(error);
        },
      });
    } catch (error) {
      alert("Something went wrong, please try again");
    }
  });
}

async function getUserFromManagerPage() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:3000/profile/email/" + user.email,
      method: "GET",
      success: function (response) {
        if (user.isAdmin != true) {
          window.location.href = "HomePage.html";
        }
        resolve(response); // Resolve the promise with the response
      },
      error: function (xhr) {
        reject(xhr.responseText); // Reject the promise with the error message
      },
    });
  });
}

async function validationUser() {
  if (!user) {
    window.location.href = "HomePage.html";
  }
  await getUserFromManagerPage();
}

$(document).ready(function () {
  let user = JSON.parse(localStorage.getItem("user"));
  validationUser();
  fetchGames();
  fetchTotalNumberOfPurchase();
  fetchCumulativeAmountOfPurchasesPerMonth();
  addNewGame();
});
