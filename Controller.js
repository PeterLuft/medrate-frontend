/**
 * Created by sean on 2017-02-23.
 */

//TODO: (stats) with returned data, convert each question into a google chart



$(document).ready(function () {


    // If the user is signed in, then retrieve their email and put it in the button for the account page
    if (localStorage['auth_token']) {
         //console.log(localStorage);
         //console.log(localStorage['clinic']);
         //console.log(localStorage);

        $('#account_link').text(localStorage['email']);
        // console.log(localStorage['auth_token']);

        //When the user is logged in display sign out button
        document.getElementById('SignOutBtn').style.visibility = 'visible';

        //And bookmarks button
        //document.getElementById('BookmarksBtn').style.visibility = 'visible';

        //And remove the sign in and sign up option
        document.getElementById('SignInBtn').style.visibility = 'hidden';
        document.getElementById('SignUpBtn').style.visibility = 'hidden';
    }


    var currentClinic;

    var update_feedback_box = function (message, error) {
        console.log(message);
        console.log('updating feedback box');
        if (error == true) {
            $('#feedback_text').removeClass('success-text');
            $('#feedback_text').addClass('error-text');
        } else {
            $('#feedback_text').removeClass('error-text');
            $('#feedback_text').addClass('success-text');
        }
        $('#feedback_text').text(message);
        $('#feedback_box').removeClass('scale-out');
        $('#feedback_box').addClass('scale-in');
    };

    $("#testButton").click(function () {
        event.preventDefault();
        console.log("click");

        var auth_token = JSON.parse(window.localStorage['auth_token']);
        console.log(auth_token);

        if (auth_token) {
            console.log("Auth token stored in local storage.")
        } else {
            console.log("Not token, this auth_test will not work.");
        }

        $.ajax({
            url: config.auth_test_endpoint,
            type: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': btoa(auth_token)
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error: function (error, er2, er3) {
                console.log(error);
                console.log(er2);
            }
        })
    });

    $("#signin_form").bind('submit', function (event) {
        event.preventDefault();

        var user_email = $('#email').val();
        var user_password = $('#password').val();
        var form_data = {
            email: user_email,
            password: user_password
        };

        $.ajax({
            url: config.signin_endpoint,
            type: 'POST',
            dataType: 'json',
            data: form_data,
            success: function (data, textStatus, jqXHR) {
                console.log(data.token);

                // TODO insert some positive feedback and navigate elsewhere
                window.localStorage['auth_token'] = data.token;
                window.localStorage['email'] = user_email;
                update_feedback_box('You are now signed in as ' + $('#email').val(), false);
                window.location.href = "index.html";


            },
            error: function (error) {
                console.log('Incorrect user credentials.');
                update_feedback_box('Incorrect user credentials.', true);
            }
        })
    });

    $("#signup_form").bind('submit', function (event) {
        event.preventDefault();

        var user_email = $('#email').val();
        var user_password = $('#password').val();
        var form_data = {
            email: user_email,
            password: user_password
        };

        $.ajax({
            url: config.signup_endpoint,
            type: 'POST',
            dataType: 'json',
            data: form_data,
            success: function (data, textStatus, jqXHR) {
                console.log(data.token);

                //navigates back to index.html when successfully signed up (or in)
                window.localStorage['auth_token'] = data.token;
                window.localStorage['email'] = user_email;
                update_feedback_box('You are now signed in as ' + $('#email').val(), false);
                window.location.href = "index.html";

            },
            error: function (error) {
                console.log(error);
                update_feedback_box(JSON.parse(error.responseText).message, true);
            }
        })
    });

});