var API_REQUEST_URL_GENERAL_RESULT = 'https://opi.rks-gov.net/api/report/general';
var CYCLE_LENGTH_DAYS = 7;

/**
 * Get the dates needed to define the following ranges:
 *
 *  Latest date range from 1n to today.
 *  Mid date range from 2n to 1n-1.
 *  Oldest data range from 3n to 2n-1.
**/

var today = new Date();

var pastDaysBy1n = new Date();
pastDaysBy1n.setDate(pastDaysBy1n.getDate() - CYCLE_LENGTH_DAYS);

var pastDaysBy1nMin1 = new Date();
pastDaysBy1nMin1.setDate(pastDaysBy1nMin1.getDate() - CYCLE_LENGTH_DAYS - 1);

var pastDaysBy2n = new Date();
pastDaysBy2n.setDate(pastDaysBy2n.getDate() - 2 * CYCLE_LENGTH_DAYS);

var pastDaysBy2nMin1 = new Date();
pastDaysBy2nMin1.setDate(pastDaysBy2nMin1.getDate() - (2 * CYCLE_LENGTH_DAYS) - 1);

var pastDaysBy3n = new Date();
pastDaysBy3n.setDate(pastDaysBy3n.getDate() - 3 * CYCLE_LENGTH_DAYS);


var dateRanges = [
    '?date_fromString=' + pastDaysBy1n.toLocaleDateString('fr-FR') + '&date_toString=' + today.toLocaleDateString('fr-FR'),
    '?date_fromString=' + pastDaysBy2n.toLocaleDateString('fr-FR') + '&date_toString=' + pastDaysBy1nMin1.toLocaleDateString('fr-FR'),
    '?date_fromString=' + pastDaysBy3n.toLocaleDateString('fr-FR') + '&date_toString=' + pastDaysBy2nMin1.toLocaleDateString('fr-FR')
];


// Object containing the requested responses.
// We are making three requests, so three responses.
var data = {
    'first': null,
    'second': null,
    'third': null
};


var institutions = [];
var services = [];

$(function() {
    $.when(
        // Deferred requests
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[0], function (rsp) {
            data['third'] = rsp;
        }),

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[1], function (rsp) {
            data['second'] = rsp;
        }),

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[2], function (rsp) {
            data['first'] = rsp;
        })
    ).then(function() {
        // TODO: Account for case when at least on of the deferred request fails

        // All requests have been resolved (or rejected),

        // Build institutions list
        $.each(data['first'], function(idx, val){
            institutions.push({
                institution_id: val['ID'],
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                happy: [
                    parseFloat(data['first'][idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data['first'][idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data['first'][idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data['first'][idx]['result_Good'],
                    data['second'][idx]['result_Good'],
                    data['third'][idx]['result_Good']
                ],
                mehCount: [
                    data['first'][idx]['result_Middle'],
                    data['second'][idx]['result_Middle'],
                    data['third'][idx]['result_Middle']
                ],
                unhappyCount: [
                    data['first'][idx]['result_Bad'],
                    data['second'][idx]['result_Bad'],
                    data['third'][idx]['result_Bad']
                ],
                totalCount: [
                    data['first'][idx]['result_Total'],
                    data['second'][idx]['result_Total'],
                    data['third'][idx]['result_Total']
                ]
            })

        });

        // TODO: Build services list

        // Render the chart.
        renderChart(institutions[13]);

        // Hide gif loader animation.
        $('.overllay').hide();
    });

    function renderChart(data){
        Highcharts.chart('container-barchart', {
            title: {
                text: ''
            },
            xAxis: {
                categories: ["three weeks ago", "two weeks ago", "one week ago"]
            },
            yAxis: {
                labels: {
                    format: "{value}%",
                },
                title: {
                    text: ''
                }
            },
            labels: {
                items: [{
                    html: i18n.answers[lang] + ":",
                    style: {
                        left: '50px',
                        top: '-14px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            series: [{
                type: 'column',
                name: i18n.dissatisfied[lang],
                data: data.unhappy,
                color: '#C6371D' // Dissatisfied color
            }, {
                type: 'column',
                name: i18n.moderatelySatisfied[lang],
                data: data.meh,
                color: '#D2B028' // Moderately satisfied colors
            }, {
                type: 'column',
                name: i18n.satisfied[lang],
                data: data.happy,
                color: '#30C67B' // Satisfied color
            }/**, {
                type: 'spline',
                name: 'Average',
                data: [3, 2.67, 3],
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }**/,{
                type: 'pie',
                name: i18n.answers[lang],
                data: [{
                    name: i18n.dissatisfied[lang],
                    y: data.unhappyCount.reduce(function(a, b) { return a + b; }, 0),
                    color: '#C6371D' // Dissatisfied color
                }, {
                    name: i18n.moderatelySatisfied[lang],
                    y: data.mehCount.reduce(function(a, b) { return a + b; }, 0),
                    color: '#D2B028' // Moderately satisfied colors
                }, {
                    name: i18n.satisfied[lang],
                    y: data.happyCount.reduce(function(a, b) { return a + b; }, 0),
                    color: '#30C67B' // Satisfied color
                }],
                center: [100, 40],
                size: 120,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            }]
        });
    }
});