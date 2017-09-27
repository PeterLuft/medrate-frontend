/**
 * Created by pwluft on 2017-03-20.
 */


$(document).ready(function () {
    // console.log("running")
    $('select').material_select();


    var clinic_info = JSON.parse(localStorage['clinic']);
    //  console.log(clinic_info);
    var survey = JSON.parse(localStorage['survey']);
//    console.log(survey);


    var exp_questions = survey['experience_questions'];
    var id_questions = survey['identity_questions'];


    $('#survey_form').append('<h5>Part 1: Experience Questions</h5>');

    //experience questions
    for (var i = 0; i < exp_questions.length; i++) {
        var question = exp_questions[i].question_text;
        var question_id = "exp" + exp_questions[i].question_id;
        // console.log(question + '\n');


        var qContent =
            '<div class="row">' +
            '<p><strong>' + question + '</strong></p>' +
            '<div class="input-field col s10">' +
            '<form>'

        for (var j = 0; j < exp_questions[i].experience_options.length; j++) {

            var value = exp_questions[i].experience_options[j].option_text;
            var question_option_id = exp_questions[i].experience_options[j].question_option_id;
            var radio_id = "E" + question_option_id;

            qContent +=
                '<input name="' + question_id + '" type="radio" id="' + radio_id + '" value="' + value + '">' +
                '<label for="' + radio_id + '">' + value + '</label>' +
                '<br />'
        }
        qContent += '</form></div></div>'
        $('#survey_form').append(qContent);
    }


    //identity questions
    $('#survey_form').append('<h5>Part 2: Identity Questions</h5>');

    for (var i = 0; i < id_questions.length; i++) {
        var question = id_questions[i].question_text;
        var question_id = "id" + id_questions[i].identity_question_id;

        var qContent =
            '<div class="row">' +
            '<p><strong>' + question + '</strong></p>' +
            '<div class="input-field col s10">' +
            '<form>'

        for (var j = 0; j < id_questions[i].identity_options.length; j++) {

            var value = id_questions[i].identity_options[j].option_text;
            var question_option_id = id_questions[i].identity_options[j].question_option_id;
            var radio_id = "I" + question_option_id;

            qContent +=
                '<input name="' + question_id + '" type="radio" id="' + radio_id + '" value="' + value + '">' +
                '<label for="' + radio_id + '">' + value + '</label>' +
                '<br />'
        }
        qContent += '</form></div></div>'
        $('#survey_form').append(qContent);
    }

    $('#survey_form').append(
        '<div class="row"> <button class="btn-large waves-effect waves-light" type="submit" name="action">Submit </button> </div>'
    );


    $("#survey_form").bind('submit', function (event) {
        event.preventDefault();

        var question_response_pairs = [];

        //get experience questions
        for (var i = 0; i < exp_questions.length; i++) {



            var id = exp_questions[i].question_id;
            var question = exp_questions[i].question_text;
            var response = $('input[name=exp' + id + ']:checked').val();


            var newObj = {
                question_id: i+1,
                question_text:  question,
                question_response: response
            };

            question_response_pairs.push(newObj);
        }

        //respondent identifiers
        var identifier_list = [];
        for (var i = 0; i < id_questions.length; i++) {
            var id = id_questions[i].identity_question_id;
            var response = $('input[name=id' + id + ']:checked').val();
            //uh oh this is going to get janky..
            identifier_list.push(response);

        }

        console.log(identifier_list);
        // the following block of code is pretty suspect. not scalable, but it'll work in a pinch
        var gn = identifier_list[0];
        var sx = identifier_list[1];
        var eth = identifier_list[2];
        var rc = identifier_list[3];
        var or = identifier_list[4];


        // end of suspect code...

        var id_data = clinic_info.med_rate_data.care_provider_id;

        if (id_data == '') {
            id_data = null;
        }

        //build the object to post to the server
        var survey_response = {
            respondent_identifiers: {
                race: rc,
                ethnicity: eth,
                gender: gn,
                income: "First Quintile",
                age: 23,
                sex: sx,
                sexual_orientation: or
            },
            question_response_pairs: question_response_pairs,
            care_provider_id: id_data,
            location: clinic_info.vicinity,
            google_place_id: clinic_info.place_id,
            name: clinic_info.name,
            survey_id: survey.survey_id
        };

         console.log(survey_response);


        $.ajax({
            url: config.survey_submit_endpoint,
            type: 'POST',
            dataType: 'json',
            data: survey_response,
            success: function (data, textStatus, jqXHR) {
              //  console.log(data);
                if (clinic_info.med_rate_data.care_provider_id == null) {
                    clinic_info.med_rate_data.care_provider_id = data.result.care_provider_id;
                    localStorage['clinic'] = JSON.stringify(clinic_info);
                }
               window.location.href = "stats.html";
            },
            error: function (error) {
                console.log('Error in post request.');

            }
        })


    });


});