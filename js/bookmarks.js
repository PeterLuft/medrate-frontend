/**
 * Created by sean on 2017-03-23.
 */

$(document).ready(function() {
    var clinic_info = JSON.parse(window.localStorage['clinic']);
    var auth_token = window.localStorage['auth_token'];
    var bookmarks_page_search_results = JSON.parse(window.localStorage['bookmarks_search']);

    var user_email = auth_token.email;
    var place_id = clinic_info.place_id;
    var clinic_name = clinic_info.name;
    var clinic_location = clinic_info.vicinity;
    var care_provider_id = clinic_info.med_rate_data.care_provider_id;

    var bookmark_list_id;

    //console.log(auth_token);

    if(localStorage['auth_token']) {
        //Make the bookmarks button visible
        document.getElementById('BookmarksBtn').style.visibility = 'visible';
    }

    //GETTING BOOKMARKS
    //This get's loaded when the bookmarks page gets loaded
    var bookmarks_get = function () {
        $.ajax({
            url: config.bookmarks_endpoint,
            type: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': auth_token,
            },
            success: function (data, textStatus, jqXHR) {

                if (!data.bookmarks) {
                  //  console.log("You have no bookmarks");
                }
                else {
                 //   console.log(data.bookmarks);
                    var results = data.bookmarks;

                    bookmark_list_id = data.bookmarks;

                    var bookmarks_list = [];

                    for (var i = 0; i < results.length; i++) {

                        bookmarks_list.push(
                            "<li id = '" + i + "' class='collection-item avatar'>" +
                            "<i class='material-icons circle'>bookmark</i>" +
                            "<span class='title' >" + results[i].name + "</span>" +
                            "<p>" + results[i].location + "<br></p>" +

                            "<div class='bookmarkDeleteBtn secondary-content'>" +
                            "<a class='btn waves-effect waves-light btn-large tooltipped' " +
                            "data-position='bottom' data-delay='50' data-tooltip='Delete'" +
                            "name='action'>" +
                            "<i class='large material-icons'>delete</i> " +
                            "</a>" +
                            "</div>" +

                            "</li>"
                        );
                    }
                    //console.log(bookmarks_list);
                    $('#bookmarks_results').empty();
                    $('#bookmarks_results').append(bookmarks_list);
                }
            },
            error: function (error, er2, er3) {
                // console.log(error);
                // console.log(er2);
                // console.log(er3);
                console.log("Not logged in, not retrieving bookmarks");
            }
        });
    };

    bookmarks_get();

    //CREATE BOOKMARK
    var create_bookmark = function() {

        console.log("Creating Bookmark...");
        console.log(auth_token);

        $.ajax({
            url: config.bookmark_post_delete_endpoint,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': auth_token
            },
            data:{
                'google_place_id': place_id,
                'location': clinic_location,
                'name': clinic_name
            },
            success: function (data, textStatus, jqXHR) {
                $.notify("Bookmark Created");
                console.log("Bookmark successfully created.");
                console.log(data);
            },
            error: function(error, er2, er3) {
                console.log(error);
                console.log(er2);
                console.log(er3);
            }
        });
    };

    // Redirect to login page if user isn't signed in
    $('#bookmarkBtn').click(function(){
        if(localStorage['auth_token']){
            create_bookmark();
        }
        else {
            window.location = "signin.html";
        }
    });


    //TODO implement bookmark button from list
    $(document).on('click', '.bookmarkCreateBtn', function(event){
        // console.log("Creating bookmark from list...");

        // If the create_id is not defined get the next parent
        // Icon is one layer deeper in the tree than the button surface
        var create_id = $(event.target).parent().parent().attr('id');

        if (create_id === undefined) {
            create_id = $(event.target).parent().parent().parent().attr("id");
        }

        console.log(create_id);

        // console.log(create_id);
       // console.log(global_search_results);

        $.ajax({
            url: config.bookmark_post_delete_endpoint,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': auth_token,
            },
            data:{
                'google_place_id': global_search_results[create_id].place_id,
                'location': global_search_results[create_id].vicinity,
                'name': global_search_results[create_id].name
            },
            success: function (data, textStatus, jqXHR) {
                $.notify("Bookmark Created");
                console.log("Bookmark successfully created.");
                console.log(data);
            },
            error: function(error, er2, er3) {
                console.log(error);
                console.log(er2);
                console.log(er3);
            }
        });

    });

    //DELETE BOOKMARK
    $(document).on('click', '.bookmarkDeleteBtn', function(event){
        var delete_id = $(event.target).parent().parent().attr('id');

        // If the delete_id is not defined get the next parent.
        // Icon is one layer deeper in the tree than the button surface
        if (delete_id === undefined) {
            delete_id = $(event.target).parent().parent().parent().attr('id');
        }

        console.log(bookmark_list_id);
        console.log(bookmark_list_id[delete_id]);

        $.ajax({
            url: config.bookmark_delete_endpoint,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': auth_token
            },
            data: {
                'care_provider_id': bookmark_list_id[delete_id].care_provider_id
            },
            success: function (data, textStatus, jqXHR) {
                $.notify("Bookmark Deleted");
                console.log("Bookmark successfully deleted.");
                console.log(textStatus);
                bookmarks_get();
            },
            error: function(error, er2, er3) {
                console.log(error);
            }
        });
    });

    $(document).on('click', '.collection-item', function(event) {

        // Get the class of the clicked element and use it to find the location
        var event_parent = $(event.target).parent().attr('class');
        var event_child = $(event.target).attr('class');
        var event_grandparent = $(event.target).parent().parent().attr('class');
        var location_name;
        var id;

        // Don't navigate if the button was clicked
        if (event_child === "bookmarkDeleteBtn secondary-content"
            || event_parent === "bookmarkCreateBtn secondary-content"
            || event_grandparent === "bookmarkCreateBtn secondary-content"){
            return;
        }

        // Determine where we clicked and find the location's name
        if (event_child === "title") {
            console.log("Clicked the title");
            location_name = $(event.target).html();
        } else if (event_child === undefined) {
            console.log("Clicked the location");
            location_name = $(event.target).parent().child().html();
        }else if (event_child === "material-icons circle") {
            console.log("Clicked the icon");
            location_name = $(event.target).parent().child().html();
        }else if (event_child === "collection-item avatar") {
            location_name = $(event.target).parent().child().html();
            console.log("clicked elsewhere");
        }

        console.log(location_name);

        // Determine the location we clicked by finding it in the search results
        for( var i = 0; i < bookmarks_page_search_results.length; i++) {

            if (location_name === bookmarks_page_search_results[i].name) {
                console.log(bookmarks_page_search_results[i].name);
                id = i;
            }
        }

        // Set the current clinic
        console.log(bookmarks_page_search_results[id]);
        var place_id = bookmarks_page_search_results[id]['place_id'];
        var vicinity = bookmarks_page_search_results[id]['vicinity'];
        var name = bookmarks_page_search_results[id]['name'];

        var clinic_info = bookmarks_page_search_results[id];

        localStorage['clinic'] = JSON.stringify(clinic_info);

        window.location.href = "stats.html";
    });

});