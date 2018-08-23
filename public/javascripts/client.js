
$(document).ready(function () {
    $.get("/api/user_data").then(function (data) {
        $(".user-name").text("Welcome back " + data.email);
        console.log(data);
    });


    // SIGNUP JQUERY
    // Getting references to our form and input
    var signUpForm = $("form.signup");
    var emailInput = $("input#sign-up-email");
    var passwordInput = $("input#sign-up-password");
    var usernameInput = $("input#sign-up-username");
    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function (event) {
        event.preventDefault();
        var userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            username: usernameInput.val().trim()
        };

        if (!userData.email || !userData.password || !userData.username) {
            return;
        }
        // If we have an email and password, run the signUpUser function
        signUpUser(userData.email, userData.password, userData.username);
        emailInput.val("");
        passwordInput.val("");
        usernameInput.val("");
    });

    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(email, password, username) {
        $.post("/api/signup", {
            email: email,
            password: password,
            username: username
        }).then(function (data) {
            window.location.replace(data);
            // If there's an error, handle it by throwing up a bootstrap alert
        }).catch(handleLoginErr);
    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }

    // LOGIN JQUERY
    // Getting references to our form and inputs
    var loginForm = $("form.login");
    var emailLoginInput = $("input#login-email");
    var passwordLoginInput = $("input#login-password");

    // When the form is submitted, we validate there's an email and password entered
    loginForm.on("submit", function (event) {
        event.preventDefault();
        var userData = {
            email: emailLoginInput.val().trim(),
            password: passwordLoginInput.val().trim()
        };

        if (!userData.email || !userData.password) {
            return;
        }

        // If we have an email and password we run the loginUser function and clear the form
        loginUser(userData.email, userData.password);
        emailLoginInput.val("");
        passwordLoginInput.val("");
    });

    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password) {
        $.post("/api/login", {
            email: email,
            password: password
        }).then(function (data) {
            window.location.replace(data);
            // If there's an error, log the error
        }).catch(function (err) {
            console.log(err);
            $(".error-text").show();
        });
    }

    // On Startup
    $(".error-text").hide();
});
//for about us

var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 10000); // Change image every 10 seconds
}