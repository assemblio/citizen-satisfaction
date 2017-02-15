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
var sortedInstitutions = [];


function onMinistrySelection(instituIndex,institu) {
    $('#dropdown-first .selected-value').html(institu);
    $('#dropdown-second .selected-value').html('All services');
    // Render the chart.
    renderChart(institutions[instituIndex]);
}
function onServiceSelection(serviceIndex,serviceName){
    $('#dropdown-first .selected-value').html('All institutions');
    $('#dropdown-second .selected-value').html(serviceName);
    renderChart(services[serviceIndex]);
}

function renderChart(data){
    Highcharts.chart('container-barchart', {
        title: {
            text: ''
        },
        xAxis: {
            categories: ["three weeks ago", "two weeks ago", "one week ago"],
            labels: {
                style: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            labels: {
                format: "{value}%",
                style: {
                    color: 'white'
                }
            },
            title: {
                text: ''
            }
        },
        chart:{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, 'rgb(82, 178, 213)'],
                    [1, 'rgb(65, 118, 173)']
                ]
            }
        },
        labels: {
            items: [{
                html: i18n.answers[lang] + ":",
                style: {
                    left: '50px',
                    top: '0px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
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
            center: [100, 60],
            size: 120,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
}


$(function() {
    // Set link to trends with selected language
    if(urlLangParam == null){
        urlLangParam = 'sq';
    }
    $('.navbar-brand').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);

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
            });

            $(val['ServiceGroups']).each(function(serviceGroupIndex){
                $(this['Services']).each(function(serviceIndex,serviceVal) {
                    var serviceName = this['ServiceName_' + lang];
                    // services.push({grIndex:serviceGroupIndex,srIndex:serviceIndex,service:serviceName});
                    services.push({
                        service_id: serviceVal['ID'],
                        name_AL: serviceVal['ServiceName_AL'],
                        name_EN: serviceVal['ServiceName_EN'],
                        name_SR: serviceVal['ServiceName_SR'],
                        happy: [
                            parseFloat(data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                            parseFloat(data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                            parseFloat(data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', ''))
                        ],
                        meh: [
                            parseFloat(data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                            parseFloat(data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                            parseFloat(data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', ''))
                        ],
                        unhappy: [
                            parseFloat(data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                            parseFloat(data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                            parseFloat(data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', ''))
                        ],
                        happyCount: [
                            data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                            data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                            data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good']
                        ],
                        mehCount: [
                            data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                            data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                            data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle']
                        ],
                        unhappyCount: [
                            data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                            data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                            data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad']
                        ],
                        totalCount: [
                            data['first'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                            data['second'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                            data['third'][idx]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total']
                        ]
                    });
                });
            });
        });

        $(services).each(function(i){
            var servID = services[i].service_id;
            var serviceN = services[i].name_+lang;
            $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + servID + ', \'' + serviceN + '\')">' + serviceN + '</a></li>');
        });

        $.each( data['first'], function( key, val ) {
            sortedInstitutions.push({id:key, instit:val['InstitutionName_' + lang]});
        });
        // console.log(sortedInstitutions[0]);
        // console.log(sortedInstitutions[0].instit);
        // // TODO: Build services list

        onMinistrySelection(sortedInstitutions[0].id,sortedInstitutions[0].instit);
        $.each(institutions, function(i) {
            var institu = sortedInstitutions[i].instit;
            var instituIndex = sortedInstitutions[i].id;
            $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + instituIndex + ', \'' + institu + '\')">' + institu + '</a></li>');
        })

        // Hide gif loader animation.
        $('.overllay').hide();
    });
});
