$(document).ready(function () {
    getUserData((thisUser) => {
        console.log(thisUser)
        $.get("/api/user_subs/" + thisUser.id, function (data) {
            const userSubs = data.subs;
            console.log(data);
            userSubs.forEach(sub => {
                $("button[name=sub-button][handleName='" + sub + "']").text("Un-subscribe");
            });
        });

        $("body").on("click", '#log-out', function () {
            logOut();
            window.location.replace("/");
        });

        $("body").on("click", '#go-home', function () {
            window.location.replace("/");
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
});
