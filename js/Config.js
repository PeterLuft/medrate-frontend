/**
 * Created by Andrew on 2017-02-23.
 */

var config = {

    backend_ip: null,
    backend_port: null,
    production_mode: true,
    remote_host: "54.149.177.39",
    remote_port: "8080",
    local_host: "localhost",
    local_port: "8080",
    signin_endpoint: null,
    signup_endpoint: null,
    auth_test_endpoint: null,
    survey_endpoint: null,
    survey_submit_endpoint: null,
    bookmarks_endpoint: null,
    bookmark_post_delete_endpoint: null,
    bookmark_delete_endpoint: null,
    survey_results_endpoint: null,

    // Location string provider by the location search e.g. "Thunder Bay, ON, Canada", provider types as a boolean list e.g. [True, False]
    // Will result in Hospitals but not Doctors.
    care_provider_search_query: function(location_string, provider_types) {
        return config.care_provider_search_endpoint + "?location=" + location_string + "&hospitals=" + provider_types[0] + "&doctors=" + provider_types[1]
    }
};

// Initialize above null settings by reading the production_mode flag
(function() {
    if(config.production_mode) {
        config.backend_ip = config.remote_host;
        config.backend_port = config.remote_port;
    }else{
        config.backend_ip = config.local_host;
        config.backend_port = config.local_port;
    }

    // Build the proper endpoint for the application
    config.signup_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/signup";
    config.signin_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/signin";
    config.auth_test_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/auth_test";
    config.survey_results_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/survey_results_by_question";
    config.care_provider_search_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/care_provider_search";

    config.bookmarks_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/bookmarks";
    config.bookmark_post_delete_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/bookmark";
    config.bookmark_delete_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/delete_bookmark";
    config.survey_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/survey";
    config.survey_submit_endpoint = "http://" + config.backend_ip + ":" + config.backend_port + "/api/survey";
}());