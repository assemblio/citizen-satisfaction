var lang = 'AL';
var satisfactionJson = null;

function onMinistrySelection(index, ministryName){
    $('#container-ministry-selection .navbar-brand').html(ministryName);

    // When selecting a ministry, we want to update the list of service to those
    // specific to that ministry.

    // First, let's select a default service.
    var defaultServiceName = satisfactionJson[index]['ServiceGroups'][0]['Services'][0]['ServiceName_' + lang];
    $('#container-service-selection .navbar-brand').html(defaultServiceName);

    // Don't forget to set the default service's satisfaction stats:
    setSatisfactionStats(index, 0, 0);

    // Now, let's clear previously created list of services.
    $('#container-service-selection .dropdown-menu').html('');

    // Finally, let's build the new list of services for the selected ministry.
    // Get each Service from each Service Group.
    $(satisfactionJson[index]['ServiceGroups']).each(function(serviceGroupIndex) {
        $(this['Services']).each(function(serviceIndex) {
            var serviceName = this['ServiceName_' + lang];

            $('#container-service-selection .dropdown-menu').append('<li><a href="javascript:onServiceSelection(' + serviceGroupIndex + ', ' + serviceIndex + ', \'' + serviceName + '\')">' + serviceName + '</a></li>');
        });
    });
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
    $('.row-meh .illustration-timeliness .vote-count').html(serviceJson['Answers'][0]['result_Middle']);
    $('.row-unhappy .illustration-timeliness .vote-count').html(serviceJson['Answers'][0]['result_Bad']);

    // Payment vote counts
    $('.row-meh .illustration-payment .vote-count').html(serviceJson['Answers'][1]['result_Middle']);
    $('.row-unhappy .illustration-payment.vote-count').html(serviceJson['Answers'][1]['result_Bad']);

    // Behaviour of official vote counts
    $('.row-meh .illustration-kindliness .vote-count').html(serviceJson['Answers'][2]['result_Middle']);
    $('.row-unhappy .illustration-kindliness .vote-count').html(serviceJson['Answers'][2]['result_Bad']);

    // Online service vote count
    $('.row-meh .illustration-online .vote-count').html(serviceJson['Answers'][3]['result_Middle']);
    $('.row-unhappy .illustration-online .vote-count').html(serviceJson['Answers'][3]['result_Bad']);

    // Quality of service vote count
    $('.row-meh .illustration-quality .vote-count').html(serviceJson['Answers'][4]['result_Middle']);
    $('.row-unhappy .illustration-quality .vote-count').html(serviceJson['Answers'][4]['result_Bad']);
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
            // Build the Ministry selection select box
            //console.log(val);

            var institutionName = val['InstitutionName_' + lang];
            $('#container-ministry-selection .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + key + ', \'' + institutionName + '\')">' + institutionName + '</a></li>');
        });
    });
});
