function getUserData(cb) {
    $.get("/api/user_data").then(function (data) {

        cb(data)

    });
    
};


function subscribeTo(thisUser, thisHandleName) {
    $.post("/api/user/subscribeto/" + thisHandleName, { id: thisUser.id })
        .then(function (data) {
            // data returns true/false
            // true if user is now subbed
            // false if no longer subbed
            if (data){
                $("button[name=sub-button][handleName='"+thisHandleName+"']").text("Un-subscribe");
            }
            else {
                $("button[name=sub-button][handleName='"+thisHandleName+"']").text("Subscribe!");
            }
        });
};

function favorite(thisUser, thisTweetId, tweetContents) {
    $.post("/api/user/favorite",
        {
            id: thisUser.id,
            tweetId: thisTweetId,
            tweet: tweetContents
        })
        .then(function (data) {
            console.log(data);
        });
};

function logOut(){
    $.get("/logout");
}

$(document).ready(function () {

    $("form.searchbar").on("submit", function(e) {
        e.preventDefault();
        console.log($("#searchbar").val().trim());
        $.get("/ibm/" + $("#searchbar").val().trim()).then(function (data) {
            // console.log(data);
            var bodyContent = data;
            $('body').html(bodyContent);
        });
    
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