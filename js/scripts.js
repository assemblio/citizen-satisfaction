var lang = 'AL';
var satisfactionJson = null;

function onServiceSelection(ministryIndex, serviceGroupIndex, serviceIndex){

    // Set the service name display
    var serviceName = satisfactionJson[ministryIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_' + lang];
    $('#container-service-selection .navbar-brand').html(serviceName);

    // Set the default service's satisfaction stats:
    setSatisfactionStats(ministryIndex, serviceGroupIndex, serviceIndex);

    // Now, let's clear previously created list of services.
    $('#container-service-selection .dropdown-menu').html('');

    // Finally, let's build the new list of services for the selected ministry.
    // Get each Service from each Service Group.
    $(satisfactionJson[ministryIndex]['ServiceGroups']).each(function(serviceGroupIndex) {
        $(this['Services']).each(function(serviceIndex) {
            var serviceName = this['ServiceName_' + lang];
            $('#container-service-selection .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + ministryIndex + ', ' + serviceGroupIndex + ', ' + serviceIndex + ')">' + serviceName + '</a></li>');
        });
    });
}

function onMinistrySelection(ministryIndex, ministryName){
    $('#container-ministry-selection .navbar-brand').html(ministryName);
    onServiceSelection(ministryIndex, 0, 0);
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
    setVoteCounts(serviceJson, 3, '.illustration-quality', '.img-quality');
}

function setVoteCounts(serviceJson, answerIndex, illustrationSelector, imageSelector){

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

    $('.row-meh ' + illustrationSelector + ' .vote-count').html(serviceJson['Answers'][answerIndex]['result_Middle']);
    $('.row-unhappy ' + illustrationSelector + ' .vote-count').html(serviceJson['Answers'][answerIndex]['result_Bad']);
}


$(function() {
    /**
    $.getJSON( "http://csis.appdec.com/api/report/general", function( data ) {
        $.each( data, function( key, val ) {
            console.log(val);
        });
    });
    **/

    /** get the citizen satisfaction result json **/
    $.getJSON( "../results.json", function( data ) {

        // Store result in a global variable for future use.
        satisfactionJson = data;

        // Init first ministry
        onMinistrySelection(0, data[0]['InstitutionName_' + lang]);

        $.each( data, function( key, val ) {
            // Build the Ministry selection widget
            var institutionName = val['InstitutionName_' + lang];
            $('#container-ministry-selection .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + key + ', \'' + institutionName + '\')">' + institutionName + '</a></li>');
        });
    });
});
