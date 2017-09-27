/**
 * Created by sean on 2017-03-23.
 */

$(document).ready(function () {
    console.log("running sign out page.");

    //Clear the local storage authentication token to safely logout
    console.log("clearing local storage authentication token.");
    localStorage['auth_token'] = "";

    //Set a redirect timer of 5 seconds and bring the user back to the index page
    window.onload = function() {
        setTimeout(function() {
            console.log("redirecting in 1.5 seconds");
            window.location = "index.html";
        }, 1500);
    };
});
