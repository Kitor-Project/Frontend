//all the JS files uses auth.js function for validation purposes
let user = JSON.parse(localStorage.getItem("user"));
checkUser();

function sendToWishListPage() {
  if (user == null) {
    alert("Please login first");
    return;
  }
  window.location.href = "WishListPage.html";
}

function sendToShoppingCartPage() {
  if (user == null) {
    alert("Please login first");
    return;
  }
  window.location.href = "ShoppingCartPage.html";
}

function checkUser() {
  if (user == null) {
    $("#signInNavbar").addClass("d-none");
    $("#notSignInNavbar").removeClass("d-none");
  } else {
    getUser();
    $("#signInNavbar").removeClass("d-none");
    $("#notSignInNavbar").addClass("d-none");
  }
}

function getUser() {
  $.ajax({
    url: "http://localhost:3000/profile/email/" + user.email,
    method: "GET",
    success: function (response) {
      user = response;
      if (user.isAdmin) {
        $(".adminNavbar").removeClass("d-none");
      }
      // TOOD -> fix this
      if (user.image !== null && user.image !== "") {
        $("#profileImage").attr("src", user.image);
        $("#profileImage").removeClass("d-none");
      } else {
        $("#profileImage").addClass("d-none");
      }
      // Perform any additional actions with the response data here
    },
    error: function (xhr) {
      // Handle the error
    },
  });
}

function logOut() {
  // ajax post request to logout
  localStorage.removeItem("user");

  $.ajax({
    url: "http://localhost:3000/logout",
    type: "POST",
    success: function (response) {
      // Handle the successful response from the server
    },
  });
  window.location.href = "HomePage.html";
  user = null;
  checkUser();
}

function loginForm() {
  // Listen for the form submit event
  $("#login-form").submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    // TODO -> validation if email not exist.

    // Create an object with the data to send
    var data = {
      email: email,
      password: password,
    };

    // Send the AJAX request
    $.ajax({
      url: "http://localhost:3000/login",
      type: "POST",
      data: data,
      success: function (response) {
        // Handle the successful response from the server
        if (response == "OK") {
          localStorage.setItem("user", JSON.stringify({ email: email }));
          window.location.href = "HomePage.html";
          return;
        } else {
          alert("Invalid email or password");
          return;
        }
        // Perform any necessary actions after successful login
      },
      error: function (xhr, status, error) {
        if (xhr.status == 401) {
          alert("Invalid email or password");
        }
        // Handle errors
        console.error(error);
      },
    });
  });
}

function signUpForm() {
  // Listen for the form submit event
  $("#modalSignUp").submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById("emailSignUp").value;
    const password = document.getElementById("passwordSignUp").value;
    const name = document.getElementById("nameSignUp").value;
    const location = document.getElementById("locationSignUp").value;
    const image = document.getElementById("imageSignUp").value;
    // TODO -> validation if email not exist.

    // Create an object with the data to send
    var data = {
      email: email,
      password: password,
      name: name,
      location: location,
      image: image,
    };

    // Send the AJAX request
    $.ajax({
      url: "http://localhost:3000/register",
      type: "POST",
      data: data,
      success: function (response) {
        // Handle the successful response from the server
        if (response == "OK") {
          localStorage.setItem("user", JSON.stringify({ email: email }));
          window.location.href = "HomePage.html";
          return;
        } else {
          alert("Invalid email or password");
          return;
        }
        // Perform any necessary actions after successful login
      },
      error: function (xhr, status, error) {
        if (xhr.status == 400) {
          alert("Invalid image foramt");
        }
        if (xhr.status == 401) {
          alert("Invalid email or password");
        }
        if (xhr.status == 402) {
          alert("Email already exist");
        }
        // Handle errors
        console.error(error);
      },
    });
  });
}

$(document).ready(function () {
  loginForm();
  signUpForm();
});
