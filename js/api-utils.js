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
var institutions = null;
var services = null;

if(sessionStorage.getItem('institutions') != null){
    institutions = JSON.parse(sessionStorage.getItem('institutions'));
}

if(sessionStorage.getItem('services') != null){
    services = JSON.parse(sessionStorage.getItem('services'));
}
if(sessionStorage.getItem('data1') != null && sessionStorage.getItem('data2') != null  && sessionStorage.getItem('data3') != null){
    data1 = JSON.parse(sessionStorage.getItem('data1'));
    data2 = JSON.parse(sessionStorage.getItem('data2'));
    data3 = JSON.parse(sessionStorage.getItem('data3'));
}

function domInit(){
    // needs override
}

function getService(institutionId, serviceId){
    for(var i=0; i < services[institutionId].length; i++){
        if(services[institutionId][i].id == serviceId){
            return services[institutionId][i];
        }
    }

    return null;
}

function buildInstitutionsAndServices(apiResponse) {
    institutions = [];
    services = {};

    $.each(apiResponse, function (key, val) {

        institutions.push({
            id: this['ID'],
            name: {
                AL: this['InstitutionName_AL'],
                EN: this['InstitutionName_EN'],
                SR: this['InstitutionName_SR'],
                TR: this['InstitutionName_TR']
            },
            results: {
                count: {
                    good: this['result_Good'],
                    mid: this['result_Middle'],
                    bad: this['result_Bad'],
                    tot: this['result_Total']
                },
                percentage: {
                    good: this['result_Good_Percentage'].replace('.00%', '%').replace('%', ''),
                    mid: this['result_Middle_Percentage'].replace('.00%', '%').replace('%', ''),
                    bad: this['result_Bad_Percentage'].replace('.00%', '%').replace('%', '')
                }
            }
        });

        // Finally, let's build the new list of services for the selected ministry.
        // Get each Service from each Service Group.
        $(val['ServiceGroups']).each(function() {
            $(this['Services']).each(function() {

                if (!(val['ID'] in services)) {
                    services[val['ID']] = new Array();
                }

                services[val['ID']].push({
                    iid: val['ID'], // Need this for ranking page.
                    id: this['ID'],
                    name: {
                        AL: this['ServiceName_AL'],
                        EN: this['ServiceName_EN'],
                        SR: this['ServiceName_SR'],
                        TR: this['ServiceName_TR']
                    },
                    results: {
                        count: {
                            good: this['result_Good'],
                            mid: this['result_Middle'],
                            bad: this['result_Bad'],
                            tot: this['result_Total']
                        },
                        percentage: {
                            good: this['result_Good_Percentage'].replace('.00%', '%').replace('%', ''),
                            mid: this['result_Middle_Percentage'].replace('.00%', '%').replace('%', ''),
                            bad: this['result_Bad_Percentage'].replace('.00%', '%').replace('%', '')
                        }
                    },
                    answers: [
                        {
                            mid: this['Answers'][0]['result_Middle'],
                            bad: this['Answers'][0]['result_Bad']
                        },
                        {
                            mid: this['Answers'][1]['result_Middle'],
                            bad: this['Answers'][1]['result_Bad']
                        },
                        {
                            mid: this['Answers'][2]['result_Middle'],
                            bad: this['Answers'][2]['result_Bad']
                        },
                        {
                            mid: this['Answers'][3]['result_Middle'],
                            bad: this['Answers'][3]['result_Bad']
                        },
                        {
                            mid: this['Answers'][4]['result_Middle'],
                            bad: this['Answers'][4]['result_Bad']
                        }
                    ]
                });
            });
        });
    });
}

function sortInstitutions(){
    institutions.sort(function (y, x) {
        A = y.name[lang].toUpperCase();
        B = x.name[lang].toUpperCase();
        if (A < B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        return 0;

    });
}

function sortServices(institutionsId){
    services[institutionsId].sort(function(a, b){
        A = a.name[lang].toUpperCase();
        B = b.name[lang].toUpperCase();
        if (A < B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        return 0;
    });
}

function cacheInstitutionsAndServices(){
    // Cache created institution list.
    sessionStorage.setItem('institutions', JSON.stringify(institutions));

    // Cache created services object.
    sessionStorage.setItem('services', JSON.stringify(services))
}

function fetchData(){
    if(institutions == null) {
        // get the citizen satisfaction result json
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function (data) {
            buildInstitutionsAndServices(data);
            cacheInstitutionsAndServices();

        }).done(function () {

            sortInstitutions();
            domInit();

            $('.overllay').hide();
        });
    }else{
        // Grab institution list from cache
        sortInstitutions();
        domInit();

        $('.overllay').hide();
    }
    if (data1 == null && data2 == null  && data3 == null) {
        // Deferred requests
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[0], function (rsp3) {
            sessionStorage.setItem('data3', JSON.stringify(rsp3));
            data3 = rsp3;
        });

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[1], function (rsp2) {
            sessionStorage.setItem('data2', JSON.stringify(rsp2));
            data2 = rsp2;
        });

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[2], function (rsp1) {
            sessionStorage.setItem('data1', JSON.stringify(rsp1));
            data1 = rsp1;
        });
    }
}
