$(document).ready(function () {
    getUserData((thisUser) => {
        console.log(thisUser)
        if (thisUser) {
            $(".user-name").text(thisUser.username);
        }

        $("body").on("click", '#log-out', function () {
            logOut();
            window.location.replace("/");
        });

        $("body").on("click", '#go-home', function () {
            window.location.replace("/");
        });



});
