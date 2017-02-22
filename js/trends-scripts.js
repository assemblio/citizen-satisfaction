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

var data1 = null;
var data2 = null;
var data3 = null;

if(sessionStorage.getItem('data1') != null && sessionStorage.getItem('data2') != null  && sessionStorage.getItem('data3') != null){
    data1 = JSON.parse(sessionStorage.getItem('data1'));
    data2 = JSON.parse(sessionStorage.getItem('data2'));
    data3 = JSON.parse(sessionStorage.getItem('data3'));
}

var institutions = [];
var sortedInstitutions = [];
var services = [];

function onMinistrySelection(instituIndex,institu) {


    var dataTime = [data1,data2,data3];
    var RenderChartBool = false;
    for (var i = 0; i <= 2; i++) {
        if (dataTime[i][instituIndex]['result_Bad'] == 0 && dataTime[i][instituIndex]['result_Middle'] == 0 && dataTime[i][instituIndex]['result_Good'] == 0) {
            RenderChartBool = true;
        }
    }
    if(RenderChartBool == false) {
        // Render the chart.
        // $('#container-barchart2').css('display','block');
        $('#dropdown-first .selected-value').html(institu);

        renderChart(institutions[instituIndex]);
        getServicesDropdownListBasedOnMinistry(instituIndex,0,0);
    }
    if (RenderChartBool == true) {
        // $('#container-barchart2').css('display','none');
        swal({
            title: "We're sorry, but there is no data for "+institu+"!",
            type: "error",
            confirmButtonText: "Back"
        });
        // $('#container-barchart').html('<div style="text-align: center;height: 100%;" class="gradient-background"><h1 style="padding-top:30px;margin: 0;">Nuk ka te dhena per kete sherbim!</h1></div>');
    }
    // onServiceSelection(instituIndex,0,0);
}
function getServicesDropdownListBasedOnMinistry(instituIndex, serviceGroupIndex, serviceIndex){
    $('#dropdown-second .selected-value').html(i18n.allServices[lang]);

    // console.log(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_'+lang]);
    $('#dropdown-second .dropdown-menu').html('');
    var services = [];

    $(data1[instituIndex]['ServiceGroups']).each(function(serviceGroupIndex){
        $(this['Services']).each(function(serviceIndex,serviceVal) {
            services.push({
                id: serviceIndex,
                service_id: serviceVal['ID'],
                service_grid: serviceGroupIndex,
                name_AL: serviceVal['ServiceName_AL'],
                name_EN: serviceVal['ServiceName_EN'],
                name_SR: serviceVal['ServiceName_SR'],
                name_TR: serviceVal['ServiceName_TR'],
                happy: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex] == undefined ? 0: data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good']
                ],
                mehCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle']
                ],
                unhappyCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad']
                ],
                totalCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total']
                ]
            });
        });
    });
    $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + instituIndex + ', \'' + data1[instituIndex]['InstitutionName_'+lang] + '\')">' + i18n.allServices[lang] + '</script></a></li>');
    $(services).each(function(i){
        var servID = services[i]['id'];
        var serviceN = services[i]['name_' + lang];
        var serviceGrId = services[i].service_grid;
        // console.log(servID);
        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection('+ instituIndex + ', ' + serviceGrId + ', ' + servID + ')">' + serviceN + '</a></li>');
    });
}
function onServiceSelection(instituIndex, serviceGroupIndex, serviceIndex){
    var services = [];
    $('#dropdown-second .selected-value').html(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_' + lang]);

    $(data1[instituIndex]['ServiceGroups']).each(function(serviceGroupIndex){
        $(this['Services']).each(function(serviceIndex,serviceVal) {
            services.push({
                service_id: serviceVal['ID'],
                service_grid: serviceGroupIndex,
                name_AL: serviceVal['ServiceName_AL'],
                name_EN: serviceVal['ServiceName_EN'],
                name_SR: serviceVal['ServiceName_SR'],
                name_TR: serviceVal['ServiceName_TR'],
                happy: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex] == undefined ? 0: data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good']
                ],
                mehCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle']
                ],
                unhappyCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad']
                ],
                totalCount: [
                    data1[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data2[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data3[instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total']
                ]
            });
        });
    });
    $('#dropdown-second .selected-value').html(services[serviceIndex]['ServiceName_'+lang]);

    var dataTime = [data1,data2,data3];
    var RenderChartBool = false;
    for (var i = 0; i <= 2; i++) {
        if (dataTime[i][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'] == 0 && dataTime[i][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'] == 0 && dataTime[i][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'] == 0) {
            RenderChartBool = true;
        }
    }
    if(RenderChartBool == false) {
        // $('#container-barchart2').css('display','block');
        renderChart(services[serviceIndex]);
    }
    if (RenderChartBool == true) {
        // $('#container-barchart2').css('display','none');
        swal({
          title: "We're sorry, but there is no data for "+services[serviceIndex]['name_'+lang]+"!",
          type: "error",
          confirmButtonText: "Back"
        });

        // $('#container-barchart').html('<div style="text-align: center;height: 100%;" class="gradient-background"><h1 style="padding-top:30px;margin: 0;">Nuk ka te dhena per kete sherbim!</h1></div>');
    }
}

function renderChart(data){
    var device = (window.screen.width / 2) - (window.screen.width / 22  );

    Highcharts.chart('container-barchart2',{
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
                    left: device + '50px',
                    top: '0px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
                }
            }]
        },
        series:[{
            type: 'pie',
            name: i18n.answers[lang],
            data: [{
                name: i18n.dissatisfied[lang],
                y: data.unhappyCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#ef4241' // Dissatisfied color
            }, {
                name: i18n.moderatelySatisfied[lang],
                y: data.mehCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#fed53e' // Moderately satisfied colors
            }, {
                name: i18n.satisfied[lang],
                y: data.happyCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#87c441' // Satisfied color
            }],
            size: 140,
            center: [device, 90],
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
    Highcharts.chart('container-barchart', {
        title: {
            text: ''
        },
        xAxis: {
            categories: [i18n.weeks3[lang], i18n.weeks2[lang], i18n.weeks1[lang]],
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
        series: [{
            type: 'column',
            name: i18n.dissatisfied[lang],
            data: data.unhappy,
            color: '#ef4241' // Dissatisfied color
        }, {
            type: 'column',
            name: i18n.moderatelySatisfied[lang],
            data: data.meh,
            color: '#fed53e' // Moderately satisfied colors
        }, {
            type: 'column',
            name: i18n.satisfied[lang],
            data: data.happy,
            color: '#87c441' // Satisfied color
        }]/**, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }**/
    });
}


$(function() {
    // Set link to trends with selected language
    if(urlLangParam == null){
        urlLangParam = 'sq';
    }
    $('.navbar-brand').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-ranking').attr('href', document.location.pathname.replace('/trends/', '/ranking') + '?lang=' + urlLangParam);
    $('#lnk-trends').attr('href', document.location.pathname+'?lang=' + urlLangParam);
    if (data1 == null && data2 == null  && data3 == null) {
        $.when(
            // Deferred requests
            $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[0], function (rsp3) {
                sessionStorage.setItem('data3', JSON.stringify(rsp3));
                data3 = rsp3;
            }),

            $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[1], function (rsp2) {
                sessionStorage.setItem('data2', JSON.stringify(rsp2));
                data2 = rsp2;
            }),

            $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[2], function (rsp1) {
                sessionStorage.setItem('data1', JSON.stringify(rsp1));
                data1 = rsp1;
            })
        ).then(function() {
            // console.log(data1);
            processApiResponse(data1, data2, data3)
            // Hide gif loader animation.
            $('.overllay').hide();
        });
    }else {
        processApiResponse(data1, data2, data3)
        $('.overllay').hide();
    }

    function processApiResponse(rsp1,rsp2, rsp3) {

        $.each(data1, function(idx, val){
            institutions.push({
                institution_id: val['ID'],
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                name_TR: val['InstitutionName_TR'],
                happy: [
                    parseFloat(data1[idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data2[idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data3[idx]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data1[idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data2[idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data3[idx]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data1[idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data2[idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data3[idx]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data1[idx]['result_Good'],
                    data2[idx]['result_Good'],
                    data3[idx]['result_Good']
                ],
                mehCount: [
                    data1[idx]['result_Middle'],
                    data2[idx]['result_Middle'],
                    data3[idx]['result_Middle']
                ],
                unhappyCount: [
                    data1[idx]['result_Bad'],
                    data2[idx]['result_Bad'],
                    data3[idx]['result_Bad']
                ],
                totalCount: [
                    data1[idx]['result_Total'],
                    data2[idx]['result_Total'],
                    data3[idx]['result_Total']
                ]
            });
        });

        $.each( data1, function( key, val ) {
            sortedInstitutions.push({id:key, instit:val['InstitutionName_' + lang]});
        });
        onMinistrySelection(sortedInstitutions[0].id,sortedInstitutions[0].instit);
        $.each(institutions, function(i) {
            var institu = sortedInstitutions[i].instit;
            var instituIndex = sortedInstitutions[i].id;
            $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + instituIndex + ', \'' + institu + '\')">' + institu + '</a></li>');
        });
    }
});
