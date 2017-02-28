var institutions = {};
var services = {};

function apiUrl() {
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

    var urlApiPeriod = {'first': API_REQUEST_URL_GENERAL_RESULT + dateRanges[2],
                        'second':API_REQUEST_URL_GENERAL_RESULT + dateRanges[1],
                        'third':API_REQUEST_URL_GENERAL_RESULT + dateRanges[0],
                        'general': API_REQUEST_URL_GENERAL_RESULT};
    return urlApiPeriod
}

function fetchFromCache(sessionKeyId){
    if(sessionStorage.getItem('institutions_' + sessionKeyId) != null){
        institutions = JSON.parse(sessionStorage.getItem('institutions_' + sessionKeyId));
    }

    if(sessionStorage.getItem('services_' + sessionKeyId) != null){
        services = JSON.parse(sessionStorage.getItem('services_' + sessionKeyId));
    }
}

function domInit(sessionKeyId){
    // needs override
}

function getService(institutionId, serviceId, sessionKeyId){
    for(var i=0; i < services[sessionKeyId][institutionId].length; i++){
        if(services[sessionKeyId][institutionId][i].id == serviceId){
            return services[sessionKeyId][institutionId][i];
        }
    }

    return null;
}

function buildInstitutionsAndServices(apiResponse, sessionKeyId) {

    institutions[sessionKeyId] = [];
    services[sessionKeyId] = {};

    $.each(apiResponse, function (key, val) {

        institutions[sessionKeyId].push({
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

        buildservices(sessionKeyId,val);
        // Finally, let's build the new list of services for the selected ministry.
        // Get each Service from each Service Group.
    });
}

function buildservices(sessionKeyId, val){
    services[sessionKeyId][val['ID']] = new Array();
    $(val['ServiceGroups']).each(function() {
        $(this['Services']).each(function() {
            // if (!(val['ID'] in services)) {
            // }
            services[sessionKeyId][val['ID']].push({
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
}

function sortInstitutions(sessionKeyId){
    institutions[sessionKeyId].sort(function (y, x) {
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

function sortServices(institutionsId, sessionKeyId){
    services[sessionKeyId][institutionsId].sort(function(a, b){
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

function cacheInstitutionsAndServices(sessionKeyId){
    // Cache created institution list.
    sessionStorage.setItem('institutions_' + sessionKeyId, JSON.stringify(institutions[sessionKeyId]));

    // Cache created services object.
    sessionStorage.setItem('services_' + sessionKeyId, JSON.stringify(services[sessionKeyId]))
}

function fetchData(url, sessionKeyId){
    fetchFromCache(sessionKeyId);

    if(institutions[sessionKeyId] == undefined) {
        // get the citizen satisfaction result json

        $.getJSON(url, function (data) {
            buildInstitutionsAndServices(data, sessionKeyId);
            cacheInstitutionsAndServices(sessionKeyId);

        }).done(function () {
            sortInstitutions(sessionKeyId);
            onFetchDataComplete(sessionKeyId);
        });
    }else{
        // Grab institution list from cache
        sortInstitutions(sessionKeyId);
        domInit(sessionKeyId);
        onFetchDataComplete(sessionKeyId);
        $('.overllay').hide();
    }
}

function onFetchDataComplete(sessionKeyId){
    $('.overllay').hide();
    // overwrite later if necessary
}
