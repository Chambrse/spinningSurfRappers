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




        $.get('/api/user_subs/' + thisUser.id).then(function (data) {
            console.log(data);

            //twitter api call to get subs to display
        });
    })
});
