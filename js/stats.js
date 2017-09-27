/**
 * Created by pwluft on 2017-03-21.
 */

$(document).ready(function () {
    var clinic_info = JSON.parse(localStorage['clinic']);
    var survey = JSON.parse(localStorage['survey']);
    var id = clinic_info.med_rate_data.care_provider_id;
    var numQuestions = survey.experience_questions.length;


    getData('gender');

    $('.option').click(function () {
        var cat = $(this).attr('id');
        getData(cat);
    });

    function getData(category) {

        var url;

        //loop for each question
        for (var k = 1; k <= numQuestions; k++) {

            url = config.survey_results_endpoint + '?' +
                'care_provider_id=' + id + '&' +
                'question_id=' + k + '&' +
                'identity_category=' + category;
          //  console.log(url);

            $.ajax({
                url: url,
                type: 'GET',
                success: function (data, textStatus, jqXHR) {


                    var q_id = data.question_id;
                    var qText = survey.experience_questions[q_id - 1].question_text;



                    //an array of every response
                   // console.log(data);
                    var results = data.results;
                    var identifier = data.identity_category;

                    if (results.length == 0 || results == null) {
                        $('#data_visuals').text("No survey data submitted for this clinic as of now");
                    }
                    else {
                        //there were actual results to log, so we will construct a visualization for the question

                      //  console.log(results);

                        var responses = [];
                        var ans_data = {};
                        var categories = [];

                        for (var i = 0; i < results.length; i++) {

                            var response = results[i].question_response;
                            var category = results[i][identifier];
                            var num = results[i].count;

                            if (categories.indexOf(category) === -1) {
                                categories.push(category);
                            }

                            if (responses.indexOf(response) === -1) {
                                ans_data[response] = {};
                                responses.push(response);
                            }
                            ans_data[response][category] = num;
                        }

                        // Load the Visualization API and the corechart package. Call the draw function
                        google.charts.load('current', {'packages': ['corechart']});
                        google.charts.setOnLoadCallback(drawChart);


                        function drawChart() {

                            var data_array = [];

                            var row = [identifier];
                            for (var i = 0; i < categories.length; i++) {
                                row.push(categories[i]);
                            }
                            row.push({role: 'annotation'});
                            data_array.push(row);

                            for (var i = 0; i < responses.length; i++) {
                                row = [];
                                var title = responses[i];
                                row.push(title);

                                for (var j = 0; j < categories.length; j++) {
                                    var value = ans_data[title][categories[j]];
                                    if (!value) {
                                        value = 0;
                                    }
                                    row.push(value);
                                }
                                row.push('');
                                data_array.push(row);
                            }

                          //  console.log(data_array);


                            // Create the data table.
                            var data = new google.visualization.arrayToDataTable(data_array);

                            var options = {
                                title: qText,
                                width: 700,
                                height: 600,
                                bar: {groupWidth: '70%'},
                                colors: ['#2D6C6F', '#B3FCFF', '#61E9EF', '#4E6E6F', '#4CB7BC',
                                    '#2CB492', '#0D342B', "#69C0AB", "#1D342F", "#208169"],

                                isStacked: 'percent',
                                hAxis: {
                                    minValue: 0,
                                    ticks: [0, .3, .6, .9, 1]
                                }

                            };

                            var div_name = "chart_" + q_id;

                            //
                            // // Instantiate and draw our chart, passing in some options.
                              new google.visualization.BarChart(document.getElementById(div_name)).draw(data, options);
                        }

                    }
                },
                error: function (error, er2, er3) {
                    console.log(error);
                    console.log(er2);
                }
            })
        }
    }

});