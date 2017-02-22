function domInit(){
    onInstitutionSelection(institutions[0].id, institutions[0].name[lang]);
    buildInstitutionDropdown();
}


function onServiceSelection(institutionId, serviceId){

    var service = null;
    if(serviceId < 0){
        service = services[institutionId][0];

    }else{
        service = getService(institutionId, serviceId);
    }

    // Display selected service name
    $('#dropdown-second .selected-value').html(service.name[lang]);

    // Set the default service's satisfaction stats:
    setSatisfactionStats(institutionId, service.id);

    // Shake illustrations with highest counts
    shakeHighestCounts(institutionId, service.id);

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
        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + institutionId + ', ' + val.id + ')">' + val.name[lang] + '</a></li>');
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
    $('#lnk-ranking').attr('href', document.location.pathname + 'ranking?lang=' + urlLangParam);
    $('.navbar-brand').attr('href', document.location.pathname + '?lang=' + urlLangParam);
    $('#lnk-trends').attr('href', document.location.pathname + 'trends?lang=' + urlLangParam);
    $('#lnk-visualizer').attr('href', document.location.pathname + '?lang=' + urlLangParam);

    fetchData();

});
