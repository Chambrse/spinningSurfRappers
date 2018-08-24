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


<<<<<<< HEAD
=======


        $.get('/api/user_subs/' + thisUser.id).then(function (data) {
            console.log(data);
>>>>>>> 0165d88a1755315fe24cd3861b7bbeb5c0a7b2ab


/*         $.get('/api/user_subs/' + thisUser.id).then(function (data) {

            var bodyContent = data;
            $('body').html(bodyContent);

        }); */
    });


});
