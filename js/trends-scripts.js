var requestCompleteCounter = 0;
var sortedInstitutions = [];
var servicesTrends = [];
var institutionsTrends = [];
var servicesTrends = [];
var institutionsTrends = [];
var insObj = [];
var servObj = [];
var RenderChartBool = false;
var insSelect = false;

function onServiceSelection(institutionId, serviceId){
    var service = null;
    if(serviceId < 0){
        service = servicesTrends[0];
    }else{
        service = servicesTrends[serviceId];
    }

    var RenderChartBool = false;
    for (var i = 0; i <= 2; i++) {
        if (service['happyCount'][i] == 0 && service['mehCount'][i] == 0 && service['unhappyCount'][i] == 0) {
            RenderChartBool = true;
        }
        else {
            RenderChartBool = false;
            break;
        }
    }
    if(RenderChartBool == false) {
        if(serviceId < 0){
            $('#dropdown-second .selected-value').html(i18n.allServices[lang]);
            renderChart(institutionsTrends[institutionId - 1]);
        }else{
            $('#dropdown-second .selected-value').html(service['name_'+lang]);
            renderChart(service);
        }
    }
    if (RenderChartBool == true) {
        if(serviceId < 0){
            swal({
              title: i18n.nodata[lang]+institutionsTrends[institutionId - 1]['name_'+lang]+".",
              type: "error",
              confirmButtonText: "Back"
            });
        }else{
            swal({
              title: i18n.nodata[lang]+service['name_'+lang]+".",
              type: "error",
              confirmButtonText: "Back"
            });
        }
    }
}

function buildServiceDropdown(institutionId, institutionName){

    // Let's clear previously created list of services.
    $('#dropdown-second .dropdown-menu').html('');

    $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + institutionId + ', -1)">' + i18n.allServices[lang] + '</a></li>');

    $.each(services['first'][institutionId], function(idx, val){
        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + institutionId + ', ' + idx + ')">' + val.name[lang] + '</a></li>');
    });
}

function onInstitutionSelection(institutionId, institutionName){
    servicesTrends = new Array();

    $.each(services['first'][institutionId], function(idx, val){
        servicesTrends.push({
            id: val['id'],
            name_AL: val['name']['AL'],
            name_EN: val['name']['EN'],
            name_SR: val['name']['SR'],
            name_TR: val['name']['TR'],
            happy: [
                parseFloat(services['first'][institutionId][idx]['results']['percentage']['good'].replace('%', '')),
                parseFloat(services['second'][institutionId][idx]['results']['percentage']['good'].replace('%', '')),
                parseFloat(services['third'][institutionId][idx]['results']['percentage']['good'].replace('%', ''))
            ],
            meh: [
                parseFloat(services['first'][institutionId][idx]['results']['percentage']['mid'].replace('%', '')),
                parseFloat(services['second'][institutionId][idx]['results']['percentage']['mid'].replace('%', '')),
                parseFloat(services['third'][institutionId][idx]['results']['percentage']['mid'].replace('%', ''))
            ],
            unhappy: [
                parseFloat(services['first'][institutionId][idx]['results']['percentage']['bad'].replace('%', '')),
                parseFloat(services['second'][institutionId][idx]['results']['percentage']['bad'].replace('%', '')),
                parseFloat(services['third'][institutionId][idx]['results']['percentage']['bad'].replace('%', ''))
            ],
            happyCount: [
                services['first'][institutionId][idx]['results']['count']['good'],
                services['second'][institutionId][idx]['results']['count']['good'],
                services['third'][institutionId][idx]['results']['count']['good']
            ],
            mehCount: [
                services['first'][institutionId][idx]['results']['count']['mid'],
                services['second'][institutionId][idx]['results']['count']['mid'],
                services['third'][institutionId][idx]['results']['count']['mid']
            ],
            unhappyCount: [
                services['first'][institutionId][idx]['results']['count']['bad'],
                services['second'][institutionId][idx]['results']['count']['bad'],
                services['third'][institutionId][idx]['results']['count']['bad']
            ],
            totalCount: [
                services['first'][institutionId][idx]['results']['count']['tot'],
                services['second'][institutionId][idx]['results']['count']['tot'],
                services['third'][institutionId][idx]['results']['count']['tot']
            ]
        });
    });
    insSelect = false;
    for (var i = 0; i < 3; i++) {
        if (institutionsTrends[institutionId - 1]['happyCount'][i] == 0 && institutionsTrends[institutionId - 1]['mehCount'][i] == 0 && institutionsTrends[institutionId - 1]['unhappyCount'][i] == 0) {
            swal({
              title: i18n.nodata[lang]+institutionsTrends[institutionId - 1]['name_'+lang]+".",
              type: "error",
              confirmButtonText: "Back"
            });
        }else {
            $('#dropdown-first .selected-value').html(institutionName);
            buildServiceDropdown(institutionId, institutionName);
            onServiceSelection(institutionId, -1);
            break;
        }
    }
}

function buildInstitutionDropdown() {

    $.each(institutions['first'], function (i, val) {
        $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onInstitutionSelection(' + val.id + ', \'' + val.name[lang] + '\')">' + val.name[lang] + '</a></li>');
    });
}

function renderChart(data){
    Highcharts.chart('container-barchart', {
        title: {
            text: ''
        },
        xAxis: {
            categories: [i18n.weeks1[lang], i18n.weeks2[lang], i18n.weeks3[lang]],
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
        }/**,
        labels: {
            items: [{
                html: i18n.answers[lang] + ":",
                style: {
                    left: '50px',
                    top: '0px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
                }
            }]
        }**/,
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
        }/**,{
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
            center: [xPos, 60],
            size: 120,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }**/]
    });
}

function onFetchDataComplete(sessionKeyId){
    if(sessionKeyId !== 'general'){
        requestCompleteCounter = requestCompleteCounter + 1;
    }

    // Only prep data when all three requests have been completed.
    if(requestCompleteCounter == 3){
        buildChartDataObj();
    }
}

function buildChartDataObj(){
    $.each(institutions['first'], function(idx, val){
        institutionsTrends.push({
            id: val['id'],
            name_AL: val['name']['AL'],
            name_EN: val['name']['EN'],
            name_SR: val['name']['SR'],
            name_TR: val['name']['TR'],
            happy: [
                parseFloat(institutions['first'][idx]['results']['percentage']['good'].replace('%', '')),
                parseFloat(institutions['second'][idx]['results']['percentage']['good'].replace('%', '')),
                parseFloat(institutions['third'][idx]['results']['percentage']['good'].replace('%', ''))
            ],
            meh: [
                parseFloat(institutions['first'][idx]['results']['percentage']['mid'].replace('%', '')),
                parseFloat(institutions['second'][idx]['results']['percentage']['mid'].replace('%', '')),
                parseFloat(institutions['third'][idx]['results']['percentage']['mid'].replace('%', ''))
            ],
            unhappy: [
                parseFloat(institutions['first'][idx]['results']['percentage']['bad'].replace('%', '')),
                parseFloat(institutions['second'][idx]['results']['percentage']['bad'].replace('%', '')),
                parseFloat(institutions['third'][idx]['results']['percentage']['bad'].replace('%', ''))
            ],
            happyCount: [
                institutions['first'][idx]['results']['count']['good'],
                institutions['second'][idx]['results']['count']['good'],
                institutions['third'][idx]['results']['count']['good']
            ],
            mehCount: [
                institutions['first'][idx]['results']['count']['mid'],
                institutions['second'][idx]['results']['count']['mid'],
                institutions['third'][idx]['results']['count']['mid']
            ],
            unhappyCount: [
                institutions['first'][idx]['results']['count']['bad'],
                institutions['second'][idx]['results']['count']['bad'],
                institutions['third'][idx]['results']['count']['bad']
            ],
            totalCount: [
                institutions['first'][idx]['results']['count']['tot'],
                institutions['second'][idx]['results']['count']['tot'],
                institutions['third'][idx]['results']['count']['tot']
            ]
        });
    });

    institutionsTrends.sort(function(a,b) {
        return a.id - b.id;
    });

    onInstitutionSelection(institutionsTrends[2].id, institutionsTrends[2]['name_'+lang]);
    buildInstitutionDropdown();

    $('.overllay').hide();
}

$(function() {
    // Set link to trends with selected language
    if(urlLangParam == null){
        urlLangParam = 'sq';
    }

    function isDataCached(){
        isCached = true;

        $.each(['first', 'second', 'third', 'general'], function(index, group){
            if(sessionStorage.getItem('services_' + group) == null){
                isCached = (isCached && false);
            }if(sessionStorage.getItem('institutions_' + group) == null){
                isCached = (isCached && false);
            }
        });

        return isCached;
    }

    $('.navbar-brand').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-ranking').attr('href', document.location.pathname.replace('/trends/', '/ranking') + '?lang=' + urlLangParam);
    $('#lnk-trends').attr('href', document.location.pathname+'?lang=' + urlLangParam);
    var urls = apiUrl();
    if (!isDataCached()) {
        fetchData(urls['third'], 'third');
        fetchData(urls['second'], 'second');
        fetchData(urls['first'], 'first');
        fetchData(urls['general'], 'general');
    }
    else {
        institutions = {
            'first': JSON.parse(sessionStorage.getItem('institutions_first')),
            'second': JSON.parse(sessionStorage.getItem('institutions_second')),
            'third': JSON.parse(sessionStorage.getItem('institutions_third'))
        }

        services = {
            'first': JSON.parse(sessionStorage.getItem('services_first')),
            'second': JSON.parse(sessionStorage.getItem('services_second')),
            'third': JSON.parse(sessionStorage.getItem('services_third'))
        }

        buildChartDataObj();
    }
});
