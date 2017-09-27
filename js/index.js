/**
 * Created by Andrew on 2017-02-25.
 */

//For booking in a search result list
var global_search_results;

$(document).ready(function () {

    var location_list;
    var results;

    $.ajax({
        url: config.survey_endpoint,
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            //parseSurvey(data.survey[0]);

          //  console.log(data.survey[0]);

            localStorage['survey'] = JSON.stringify(data.survey[0]);
        },
        error: function (error, er2, er3) {
            console.log(error);
            console.log(er2);
        }
    });

    // Google will not take a jQuery object, so use vanilla js to get the search box
    var care_provider_search = document.getElementById('care_provider_search');

    var auto_complete = new google.maps.places.Autocomplete(care_provider_search, {
        types: ['(cities)'],
        componentRestrictions: {'country': 'ca'}
    });

    // Create a new places search provider, which will locate hospitals within the region
    var places = new google.maps.places.PlacesService($('#results_box').get(0));

    // Take the search string entered by the user and create a google places query
    $("#search_form").bind('submit', function (event) {
        console.log("submitted it");
        event.preventDefault();
        $('#search_results').empty();
        $('#search_results').addClass('scale-in');
        $('#search_results').removeClass('scale-out');

        console.log(config.care_provider_search_query($("#care_provider_search").val(), [true, false]));

        $.ajax({
            url: config.care_provider_search_query($("#care_provider_search").val(), [true, false]),
            type: "GET",
            success: search_success,
            error: search_failure
        });
    });

    var search_success = function(data, textStatus, jqXHR) {
        console.log("search_success");
        console.log(data);

        // Create a list entry box for each location found, with just the name, address and an icon
        // TODO add the score in here when its been generated in the backend

        results = data.results;
        global_search_results = data.results;

        // Save results to localStorage so the bookmarks page can access it.
        window.localStorage['bookmarks_search'] = JSON.stringify(data.results);

        location_list = [];

        for (var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            var sc;
            
            if(!results[i].med_rate_data.user_ratings || results[i].med_rate_data.user_ratings === "Not Rated"){
                sc = "User Ratings: None";
            }
            else{
                sc = "User Ratings: " + results[i].med_rate_data.user_ratings;
            }

            console.log(sc);

            // Only display the bookmark buttons in the list if a user is signed in
            if(localStorage['auth_token']) {
                location_list.push(
                    "<li id = '" + i + "' class='collection-item avatar'>" +
                    "<i class='material-icons circle'>place</i>" +
                    "<span class='title' >" + results[i].name + " </span>" +
                    "<div>" + sc + " </div>" +
                    "<p>" + results[i].vicinity + "<br></p>" +

                    "<span class='bookmarkCreateBtn secondary-content'>" +
                    "<a class='btn waves-effect waves-light btn-large tooltipped'" +
                    "data-position='bottom' data-delay='50' data-tooltip='Bookmark' " +
                    "name='action'>" +
                    "<i class='large material-icons'>bookmark</i>" +
                    "</a>" +
                    "</span>" +

                    "</li>"
                );
            }
            else {
                location_list.push(
                    "<li id = '" + i + "' class='collection-item avatar'>" +
                    "<i class='material-icons circle'>place</i>" +
                    "<span class='title' >" + results[i].name + " </span>" +
                    "<div>" + sc + " </div>" +
                    "<p>" + results[i].vicinity + "<br></p>" +
                    "</li>"
                );
            }
        }

        $('#search_results').append(location_list);

    };

    $(document).on('click', '.collection-item', function(event){

        var event_parent = $(event.target).parent().attr('class');
        var event_child = $(event.target).attr('class');
        var event_grandparent = $(event.target).parent().parent().attr('class');

        console.log(event_child);
        console.log(event_parent);
        console.log(event_grandparent);

        if (event_child === "bookmarkCreateBtn secondary-content"
            || event_parent === "bookmarkCreateBtn secondary-content"
            || event_grandparent === "bookmarkCreateBtn secondary-content"){
            return;
        }

        var id = $(this).attr('id');

        console.log(results[id]);
        var place_id = results[id]['place_id'];
        var vicinity = results[id]['vicinity'];
        var name = results[id]['name'];

        var clinic_info = results[id];

        localStorage['clinic'] = JSON.stringify(clinic_info);

        window.location.href = "stats.html";
    });

    var search_failure =function(error) {
        console.log("Error during search:");
        console.log(error)
    };
});

