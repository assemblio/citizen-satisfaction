var API_REQUEST_URL_GENERAL_RESULT = 'https://opi.rks-gov.net/api/report/general';
// 'http://csis.appdec.com/api/report/general'

var institutions = null;
var services = null;

if(sessionStorage.getItem('institutions') != null){
    institutions = JSON.parse(sessionStorage.getItem('institutions'));
    console.log("institutions: " + sessionStorage.getItem('institutions').length);
}

if(sessionStorage.getItem('services') != null){
    services = JSON.parse(sessionStorage.getItem('services'));
    console.log("services: " + sessionStorage.getItem('services').length);
}

function getService(institutionId, serviceId){
    for(var i=0; i < services[institutionId].length; i++){
        if(services[institutionId][i].sid == serviceId){
            return services[institutionId][i];
        }
    }

    return null;
}

function onServiceSelection(institutionId, serviceId){

    var service = null;
    if(serviceId < 0){
        service = services[institutionId][0];

    }else{
        service = getService(institutionId, serviceId);
    }

    //$('#dropdown-second .selected-value').html(service.name);

    // Set the default service's satisfaction stats:
    setSatisfactionStats(institutionId, service.sid);

    //TODO: FIMXME
    // Now, let's clear previously created list of services.
    //$('#dropdown-second .dropdown-menu').html('');

    // Shake illustrations with highest counts
    shakeHighestCounts(institutionId, service.sid);

    //TODO: FIXME
    //buildServiceDropdown(institutionIndex);

}

function onInstitutionSelection(institutionId, institutionName){

    $('#dropdown-first .selected-value').html(institutionName);

    buildServiceDropdown(institutionId);
    onServiceSelection(institutionId, -1);
}

function buildInstitutionDropdown() {
    $.each(institutions, function (i, val) {
        $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onInstitutionSelection(' + val.id + ', \'' + val.name[lang] + '\')">' + val.name[lang] + '</a></li>');
    });
}

function buildServiceDropdown(institutionId){



    // Let's clear previously created list of services.
    $('#dropdown-second .dropdown-menu').html('');

    $.each(services[institutionId], function(idx, val){
        // Display selected service name
        if(idx == 0){
            $('#dropdown-second .selected-value').html(val.name[lang]);
        }

        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + institutionId + ', ' + val.sid + ')">' + val.name[lang] + '</a></li>');
    });
}


function setSatisfactionStats(institutionId, serviceId){

    var service = getService(institutionId, serviceId);

    // Percentages of votes for each level of satisfaction
    $('.row-happy .percentage-count').html(service['results']['percentage']['good']);
    $('.row-meh .percentage-count').html(service['results']['percentage']['mid']);
    $('.row-unhappy .percentage-count').html(service['results']['percentage']['bad']);

    // Total vote counts for each level of satisfaction
    $('.row-happy .vote-count-label .vote-count').html(service['results']['count']['good']);
    $('.row-meh .vote-count-label .vote-count').html(service['results']['count']['mid']);
    $('.row-unhappy .vote-count-label .vote-count').html(service['results']['count']['bad']);

    // Timeliness vote counts
    setVoteCounts(service, 0, '.illustration-timeliness', '.img-timeliness');

    // Payment vote counts
    setVoteCounts(service, 1, '.illustration-payment', '.img-payment');

    // Behaviour of official vote counts
    setVoteCounts(service, 2, '.illustration-kindliness', '.img-kindliness');

    // Online service vote count
    setVoteCounts(service, 3, '.illustration-online', '.img-online');

    // Quality of service vote count
    setVoteCounts(service, 4, '.illustration-quality', '.img-quality');
}

function shakeHighestCounts(institutionId, serviceId){
    $('.img-illustration ').removeClass('shake-chunk shake-constant');
    $('.warn').removeAttr('src');

    var service = getService(institutionId, serviceId);

    // Get all the mehs
    var mehs = [{
        indicator: 'timeliness',
        count: service['answers'][0]['mid']
    },{
        indicator: 'payment',
        count: service['answers'][1]['mid']
    },{
        indicator: 'kindliness',
        count: service['answers'][2]['mid']
    },{
        indicator: 'online',
        count: service['answers'][3]['mid']
    },{
        indicator: 'quality',
        count: service['answers'][4]['mid']
    }];

    // Get all the unhappies
    var unhappies = [{
        indicator: 'timeliness',
        count: service['answers'][0]['bad']
    },{
        indicator: 'payment',
        count: service['answers'][1]['bad']
    },{
        indicator: 'kindliness',
        count: service['answers'][2]['bad']
    },{
        indicator: 'online',
        count: service['answers'][3]['bad']
    },{
        indicator: 'quality',
        count: service['answers'][4]['bad']
    }];

    // Figure out which meh is the worst and shake it for emphasis.
    mehs.sort(function(a, b){
        return b.count - a.count;
    });

    // Only shake if there is only one greatest value.
    // Don't shake if there are equal greatest values (i.e. tied first place).
    if(mehs[0].count > mehs[1].count){
        $('.row-meh .warn-' + mehs[0].indicator).addClass('shake-chunk shake-constant shake-constant--hover');
        $('.row-meh .warn-' + mehs[0].indicator).attr('src','img/meh/warning.png');
    }

    // Figure out which unhappy is the worst and shake it for emphasis.
    unhappies.sort(function(a, b){
        return b.count - a.count;
    });

    // Only shake if there is only one greatest value.
    // Don't shake if there are equal greatest values (i.e. tied first place).
    if(unhappies[0].count > unhappies[1].count){
        $('.row-unhappy .warn-' + unhappies[0].indicator).addClass('shake-chunk shake-constant shake-constant--hover');
        $('.row-unhappy .warn-' + unhappies[0].indicator).attr('src','img/unhappy/warning.png');
    }

}

function setVoteCounts(service, answerIndex, illustrationSelector, imageSelector){
    // GOOD ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(service['results']['count']['good'] == 0 && $('.row-happy ' + imageSelector).attr('src').indexOf('/inactive/') < 0){
        var happyImgUrl = $('.row-happy ' + imageSelector).attr('src').replace('/happy/', '/happy/inactive/');
        $('.row-happy ' + imageSelector).attr('src', happyImgUrl);

    }
    // else if the count is greater than 0, enable the illustration in question
    else if(service['results']['count']['good'] > 0 && $('.row-happy ' + imageSelector).attr('src').indexOf('/inactive/') > 0){
        var happyImgUrl = $('.row-happy ' + imageSelector).attr('src').replace('/happy/inactive/', '/happy/');
        $('.row-happy ' + imageSelector).attr('src', happyImgUrl);
    }

    // MEH ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(service['answers'][answerIndex]['mid'] == 0 && $('.row-meh ' + imageSelector).attr('src').indexOf('/inactive/') < 0 ){
        var mehImgUrl = $('.row-meh ' + imageSelector).attr('src').replace('/meh/', '/meh/inactive/');
        $('.row-meh ' + imageSelector).attr('src', mehImgUrl);

    }
    // else if the count is greater than 0, enable the illustration in question
    else if(service['answers'][answerIndex]['mid'] > 0 && $('.row-meh ' + imageSelector).attr('src').indexOf('/inactive/') > 0 ){
        var mehImgUrl = $('.row-meh ' + imageSelector).attr('src').replace('/meh/inactive/', '/meh/');
        $('.row-meh ' + imageSelector).attr('src', mehImgUrl);
    }

    // UNHAPPY ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(service['answers'][answerIndex]['bad'] == 0 && $('.row-unhappy ' + imageSelector).attr('src').indexOf('/inactive/') < 0 ){
        var unhappyImgUrl = $('.row-unhappy ' + imageSelector).attr('src').replace('/unhappy/', '/unhappy/inactive/');
        $('.row-unhappy ' + imageSelector).attr('src', unhappyImgUrl);

    }

    // else if the count is greater than 0, enable the illustration in question
    else if(service['answers'][answerIndex]['bad'] > 0 && $('.row-unhappy ' + imageSelector).attr('src').indexOf('/inactive/') > 0 ){
        var unhappyImgUrl = $('.row-unhappy ' + imageSelector).attr('src').replace('/unhappy/inactive/', '/unhappy/');
        $('.row-unhappy ' + imageSelector).attr('src', unhappyImgUrl);
    }

    $('.row-happy' + illustrationSelector + '.vote-count').html(service['results']['count']['good']);
    $('.row-meh ' + illustrationSelector + ' .vote-count').html(service['answers'][answerIndex]['mid']);
    $('.row-unhappy ' + illustrationSelector + ' .vote-count').html(service['answers'][answerIndex]['bad']);
}

$(function() {

    // Set link to visualizer with selected language
    if (urlLangParam == null) {
        urlLangParam = 'sq';
    }
    // link to the ranking
    // TODO: do the same for page title
    $('#lnk-ranking').attr('href', document.location.pathname + 'ranking?lang=' + urlLangParam);
    $('.navbar-brand').attr('href', document.location.pathname + '?lang=' + urlLangParam);
    $('#lnk-trends').attr('href', document.location.pathname + 'trends?lang=' + urlLangParam);
    $('#lnk-visualizer').attr('href', document.location.pathname + '?lang=' + urlLangParam);

    if (institutions == null) {
        // get the citizen satisfaction result json
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function (data) {
            buildInstitutionsAndServices(data);
            cacheInstitutionsAndServices();

        }).done(function () {
            // Grab institution list from cache

            sortInstitutions();
            onInstitutionSelection(institutions[0].id, institutions[0].name[lang]);
            buildInstitutionDropdown();
            $('.overllay').hide();
        });

    }else{
        // Grab institution list from cache
        sortInstitutions();
        onInstitutionSelection(institutions[0].id, institutions[0].name[lang]);
        buildInstitutionDropdown();
        $('.overllay').hide();
    }

    function buildInstitutionsAndServices(apiResponse) {

        institutions = [];
        services = {};

        $.each(apiResponse, function (key, val) {

            // TODO: All service score score.
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
                        bad: this['result_Bad']
                    },
                    percentage: {
                        good: this['result_Good_Percentage'].replace('.00%', '%'),
                        mid: this['result_Middle_Percentage'].replace('.00%', '%'),
                        bad: this['result_Bad_Percentage'].replace('.00%', '%')
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
                        sid: this['ID'],
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
                                bad: this['result_Bad']
                            },
                            percentage: {
                                good: this['result_Good_Percentage'].replace('.00%', '%'),
                                mid: this['result_Middle_Percentage'].replace('.00%', '%'),
                                bad: this['result_Bad_Percentage'].replace('.00%', '%')
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

});
