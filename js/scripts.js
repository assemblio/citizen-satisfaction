var API_REQUEST_URL_GENERAL_RESULT = document.location.pathname + 'results.json';
// 'http://csis.appdec.com/api/report/general'

var satisfactionJson = null;

function onServiceSelection(ministryIndex, serviceGroupIndex, serviceIndex){

    // Set the service name display
    var serviceName = satisfactionJson[ministryIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_' + lang];
    $('#dropdown-second .selected-value').html(serviceName);

    // Set the default service's satisfaction stats:
    setSatisfactionStats(ministryIndex, serviceGroupIndex, serviceIndex);

    // Now, let's clear previously created list of services.
    $('#dropdown-second .dropdown-menu').html('');

    // Shake illustrations with highest counts
    shakeHighestCounts(ministryIndex, serviceGroupIndex, serviceIndex);
    // console.log(ministryIndex,serviceGroupIndex,serviceIndex);

    var sortedServices = [];
    // Finally, let's build the new list of services for the selected ministry.
    // Get each Service from each Service Group.
    $(satisfactionJson[ministryIndex]['ServiceGroups']).each(function(serviceGroupIndex) {
        $(this['Services']).each(function(serviceIndex) {
            var serviceName = this['ServiceName_' + lang];
            sortedServices.push({grIndex:serviceGroupIndex,srIndex:serviceIndex,service:serviceName});
        });
    });

    sortedServices.sort(function(a,b){
        A = a.service.toUpperCase();
        B = b.service.toUpperCase();
        if (A < B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        return 0;

    });
    $(sortedServices).each(function(i){
        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + ministryIndex + ', ' + sortedServices[i].grIndex + ', ' + sortedServices[i].srIndex + ')">' + sortedServices[i].service + '</a></li>');
    });
    // console.log(a);

}

function onMinistrySelection(institutionIndex, institutionName){

    $('#dropdown-first .selected-value').html(institutionName);

    onServiceSelection(institutionIndex, 0, 0);
}

function setSatisfactionStats(ministryIndex, serviceGroupIndex, serviceIndex){
    var serviceJson = satisfactionJson[ministryIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex];

    // Percentages of votes for each level of satisfaction
    $('.row-happy .percentage-count').html(serviceJson['result_Good_Percentage'].replace('.00%', '%'));
    $('.row-meh .percentage-count').html(serviceJson['result_Middle_Percentage'].replace('.00%', '%'));
    $('.row-unhappy .percentage-count').html(serviceJson['result_Bad_Percentage'].replace('.00%', '%'));

    // Total vote counts for each level of satisfaction
    $('.row-happy .vote-count-label .vote-count').html(serviceJson['result_Good']);
    $('.row-meh .vote-count-label .vote-count').html(serviceJson['result_Middle']);
    $('.row-unhappy .vote-count-label .vote-count').html(serviceJson['result_Bad']);

    // Timeliness vote counts
    setVoteCounts(serviceJson, 0, '.illustration-timeliness', '.img-timeliness');

    // Payment vote counts
    setVoteCounts(serviceJson, 1, '.illustration-payment', '.img-payment');

    // Behaviour of official vote counts
    setVoteCounts(serviceJson, 2, '.illustration-kindliness', '.img-kindliness');

    // Online service vote count
    setVoteCounts(serviceJson, 3, '.illustration-online', '.img-online');

    // Quality of service vote count
    setVoteCounts(serviceJson, 4, '.illustration-quality', '.img-quality');
}

function shakeHighestCounts(ministryIndex, serviceGroupIndex, serviceIndex){
    $('.img-illustration ').removeClass('shake-chunk shake-constant');
    $('.warn').removeAttr('src');

    var serviceJson = satisfactionJson[ministryIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex];

    // Get all the happies
    var happies = [{
        indicator: 'timeliness',
        count: serviceJson['Answers'][0]['result_Good']
    },{
        indicator: 'payment',
        count: serviceJson['Answers'][1]['result_Good']
    },{
        indicator: 'kindliness',
        count: serviceJson['Answers'][2]['result_Good']
    },{
        indicator: 'online',
        count: serviceJson['Answers'][3]['result_Good']
    },{
        indicator: 'quality',
        count: serviceJson['Answers'][4]['result_Good']
    }];


    // Get all the mehs
    var mehs = [{
        indicator: 'timeliness',
        count: serviceJson['Answers'][0]['result_Middle']
    },{
        indicator: 'payment',
        count: serviceJson['Answers'][1]['result_Middle']
    },{
        indicator: 'kindliness',
        count: serviceJson['Answers'][2]['result_Middle']
    },{
        indicator: 'online',
        count: serviceJson['Answers'][3]['result_Middle']
    },{
        indicator: 'quality',
        count: serviceJson['Answers'][4]['result_Middle']
    }];

    // Get all the unhappies
    var unhappies = [{
        indicator: 'timeliness',
        count: serviceJson['Answers'][0]['result_Bad']
    },{
        indicator: 'payment',
        count: serviceJson['Answers'][1]['result_Bad']
    },{
        indicator: 'kindliness',
        count: serviceJson['Answers'][2]['result_Bad']
    },{
        indicator: 'online',
        count: serviceJson['Answers'][3]['result_Bad']
    },{
        indicator: 'quality',
        count: serviceJson['Answers'][4]['result_Bad']
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

function setVoteCounts(serviceJson, answerIndex, illustrationSelector, imageSelector){
    // GOOD ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(serviceJson['result_Good'] == 0){
        var happyImgUrl = $('.row-happy ' + imageSelector).attr('src').replace('/happy/', '/happy/inactive/');
        $('.row-happy ' + imageSelector).attr('src', happyImgUrl);

    }
    // else if the count is greater than 0, enable the illustration in question
    else if(serviceJson['result_Good'] > 0){
        var happyImgUrl = $('.row-happy ' + imageSelector).attr('src').replace('/happy/inactive/', '/happy/');
        $('.row-happy ' + imageSelector).attr('src', happyImgUrl);
    }

    // MEH ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(serviceJson['Answers'][answerIndex]['result_Middle'] == 0 && $('.row-meh ' + imageSelector).attr('src').indexOf('/inactive/') < 0 ){
        var mehImgUrl = $('.row-meh ' + imageSelector).attr('src').replace('/meh/', '/meh/inactive/');
        $('.row-meh ' + imageSelector).attr('src', mehImgUrl);

    }
    // else if the count is greater than 0, enable the illustration in question
    else if(serviceJson['Answers'][answerIndex]['result_Middle'] > 0 && $('.row-meh ' + imageSelector).attr('src').indexOf('/inactive/') > 0 ){
        var mehImgUrl = $('.row-meh ' + imageSelector).attr('src').replace('/meh/inactive/', '/meh/');
        $('.row-meh ' + imageSelector).attr('src', mehImgUrl);
    }

    // UNHAPPY ANSWER
    // If the count is 0 then grey out the illustration in question.
    if(serviceJson['Answers'][answerIndex]['result_Bad'] == 0 && $('.row-unhappy ' + imageSelector).attr('src').indexOf('/inactive/') < 0 ){
        var unhappyImgUrl = $('.row-unhappy ' + imageSelector).attr('src').replace('/unhappy/', '/unhappy/inactive/');
        $('.row-unhappy ' + imageSelector).attr('src', unhappyImgUrl);

    }

    // else if the count is greater than 0, enable the illustration in question
    else if(serviceJson['Answers'][answerIndex]['result_Bad'] > 0 && $('.row-unhappy ' + imageSelector).attr('src').indexOf('/inactive/') > 0 ){
        var unhappyImgUrl = $('.row-unhappy ' + imageSelector).attr('src').replace('/unhappy/inactive/', '/unhappy/');
        $('.row-unhappy ' + imageSelector).attr('src', unhappyImgUrl);
    }

    $('.row-happy' + illustrationSelector + '.vote-count').html(serviceJson['Answers'][answerIndex]['result_Good']);
    $('.row-meh ' + illustrationSelector + ' .vote-count').html(serviceJson['Answers'][answerIndex]['result_Middle']);
    $('.row-unhappy ' + illustrationSelector + ' .vote-count').html(serviceJson['Answers'][answerIndex]['result_Bad']);
}


$(function() {

    // Set link to visualizer with selected language
    $('#lnk-ranking').attr('href', document.location.pathname + 'ranking?lang=' + urlLangParam);

    // get the citizen satisfaction result json
    $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function( data ) {

        // Store result in a global variable for future use.
        satisfactionJson = data;

        // Init first institution
        var firstInstitution = data[0]['InstitutionName_' + lang];

        var sortedInstitutions=[];
        $.each( data, function( key, val ) {
            sortedInstitutions.push({id:key,instit:data[key]['InstitutionName_' + lang]});
        });
        sortedInstitutions.sort(function(a, b){
            A = a.instit.toUpperCase();
            B = b.instit.toUpperCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        });
        // console.log(sortedInstitutions[0].id,sortedInstitutions[0].instit);

        onMinistrySelection(sortedInstitutions[0].id,sortedInstitutions[0].instit);

        $.each(sortedInstitutions,function(i,val){
            var institutionName = val;
            // console.log(institutionName.id,institutionName.instit);
            // var id = institutionName.id + 1;
            $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + institutionName.id + ', \'' + institutionName.instit + '\')">' + institutionName.instit + '</a></li>');

        });


    });
});
