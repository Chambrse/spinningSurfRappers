$(document).ready(function () {

    getUserData((thisUser) => {
        if (thisUser) {
            console.log(thisUser);
            $("#top-left-buttons").html(
                "<li>" +
                "<a id='log-out'>Log Out</a>" +
                "</li>" +
                "<li>" +
                "<a id='my-profile'>My User Profile</a>" +
                "</li>"
            );
        }

        $("body").on("click", '#log-out', function () {
            logOut();
            location.reload();
        });

        $("body").on("click", '#my-profile', function () {
            window.location.replace("/user");
        });


        $("body").on("click", "button[name=sub-button]", function () {
            const thisHandleName = $(this).attr("handleName");
            subscribeTo(thisUser, thisHandleName);
        });

        $("body").on("click", "button[name=fav-button]", function () {
            const thisHandleName = $(this).attr("handleName");
            const thisTweetId = $(this).attr("tweetId");
            const tweetContents = $('p[tweetId="' + thisTweetId + '"]').text();
            favorite(thisUser, thisTweetId, tweetContents)
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