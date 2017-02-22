var API_REQUEST_URL_GENERAL_RESULT = 'https://opi.rks-gov.net/api/report/general';

var institutions = null;
var services = null;

if(sessionStorage.getItem('institutions') != null){
    institutions = JSON.parse(sessionStorage.getItem('institutions'));
}

if(sessionStorage.getItem('services') != null){
    services = JSON.parse(sessionStorage.getItem('services'));
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
}