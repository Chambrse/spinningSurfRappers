$(document).ready(function () {

    console.log("test");

    var modalLogin = UIkit.modal('#my-id');
    var modalSignUp = UIkit.modal('#my-id1');



    getUserData((thisUser) => {
        console.log(thisUser);
        // $.get("/api/user_subs/" + thisUser.id, function (data) {
        //     const userSubs = data.subs;
        //     console.log(userSubs);
        //     userSubs.forEach(sub => {
        //         $("button[name=sub-button][handleName='" + sub + "']").text("Un-subscribe");
        //     });
        // });

        $("body").on("click", '#log-out', function () {
            logOut();
            location.reload();
        });

        $("body").on("click", '#my-profile', function () {
            window.location.replace("/user");
        });


        $("body").on("click", "button[name=sub-button]", function () {
            if (thisUser) {
                const thisHandleName = $(this).attr("handleName");
                subscribeTo(thisUser, thisHandleName);
            } else {
                modalLogin.toggle();
            }
        });

        $("body").on("click", "button[name=fav-button]", function () {
            const thisHandleName = $(this).attr("handleName");
            const thisTweetId = $(this).attr("tweetId");
            const tweetContents = $('p[tweetId="' + thisTweetId + '"]').text();
            favorite(thisUser, thisTweetId, tweetContents)
        });

        $("#trendingRefresh").on("click", function () {
            window.location.reload();
        });


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
        if (myIndex > x.length) { myIndex = 1 }
        x[myIndex - 1].style.display = "block";
        setTimeout(carousel, 10000); // Change image every 10 seconds
    }
});