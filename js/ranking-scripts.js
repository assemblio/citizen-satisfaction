var API_REQUEST_URL_GENERAL_RESULT = 'https://opi.rks-gov.net/api/report/general';
// 'http://csis.appdec.com/api/report/general'

var EXPECTED_NUMBER_OF_INSTITUTIONS = 28;

var satisfactionJson = null;
if(sessionStorage.getItem('satisfactionJson') != null){
    satisfactionJson = JSON.parse(sessionStorage.getItem('satisfactionJson'));
}

var institutions = [];
var services = [];

var currentRankingList = null;

function sortByHappy(a, b){
    if(a.happy == b.happy){
        if (a.happyCount == b.happyCount) {
            var A;
            var B;
            if (lang == 'AL') {
                 A = a.name_AL.toUpperCase();
                 B = b.name_AL.toUpperCase();
                 if (A < B) {
                     return -1;
                 }
                 if (A > B) {
                     return 1;
                 }
                 return 0;
            }else if(lang == 'EN') {
                A = a.name_EN.toUpperCase();
                B = b.name_EN.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
            else {
                A = a.name_SR.toUpperCase();
                B = b.name_SR.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
        }
        return b.happyCount - a.happyCount;
    }
    return b.happy - a.happy;
}

function sortByMeh(a, b){
    if(a.meh == b.meh){
        if (a.mehCount == b.mehCount) {
            var A;
            var B;
            if (lang == 'AL') {
                 A = a.name_AL.toUpperCase();
                 B = b.name_AL.toUpperCase();
                 if (A < B) {
                     return -1;
                 }
                 if (A > B) {
                     return 1;
                 }
                 return 0;
            }else if(lang == 'EN') {
                A = a.name_EN.toUpperCase();
                B = b.name_EN.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
            else {
                A = a.name_SR.toUpperCase();
                B = b.name_SR.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
        }
        return b.mehCount - a.mehCount;
    }
    return b.meh - a.meh;
}

function sortByUnhappy(a, b){
    if (a.unhappy == b.unhappy) {
        if (a.unhappyCount == b.unhappyCount) {
            var A;
            var B;
            if (lang == 'AL') {
                 A = a.name_AL.toUpperCase();
                 B = b.name_AL.toUpperCase();
                 if (A < B) {
                     return -1;
                 }
                 if (A > B) {
                     return 1;
                 }
                 return 0;
            }else if(lang == 'EN') {
                A = a.name_EN.toUpperCase();
                B = b.name_EN.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
            else {
                A = a.name_SR.toUpperCase();
                B = b.name_SR.toUpperCase();

                if (A < B) {
                    return -1;
                }
                if (A > B) {
                    return 1;
                }
                return 0;
            }
        }
        return b.unhappyCount - a.unhappyCount;
    }
    return b.unhappy - a.unhappy;
}

function progressBar(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 3000).html(percent + "%&nbsp;");
}

function displayInstitutionRanking(){
    $('#dropdown-first .selected-value').html(i18n.institutions[lang]);
    currentRankingList = institutions;
    displayHappyRanking();
}

function displayServiceRanking(){
    $('#dropdown-first .selected-value').html(i18n.services[lang]);
    currentRankingList = services;
    displayHappyRanking();
}

function displayHappyRanking(){
    $('#dropdown-second .selected-value').html(i18n.satisfied[lang]);
    currentRankingList.sort(sortByHappy);
    resetRanking('happy', currentRankingList);
}

function displayMehRanking(){
    $('#dropdown-second .selected-value').html(i18n.moderatelySatisfied[lang]);
    currentRankingList.sort(sortByMeh);
    resetRanking('meh', currentRankingList);
}

function displayUnhappyRanking(){
    currentRankingList.sort(sortByUnhappy);
    $('#dropdown-second .selected-value').html(i18n.dissatisfied[lang]);
    resetRanking('unhappy', currentRankingList);
}

function resetRanking(rowType, currentRankingList){
    // Clear ranking
    $('.container-ranking').empty();

    $.each(currentRankingList, function( key, val ) {

        var institutionId = val['id'];
        var name = val["name_" + lang];
        var answerCount = val[rowType + "Count"];
        var totalCount = val['totalCount'];

        var rowHtmlString =
            '<div class="row-container">' +
                '<div class="row row-ranking row-' + rowType + '">' +
                    '<div class="col-md-6 institution-or-service-name-container">' +
                        (key + 1) + '. <span class="institution-or-service-name">' + name + '</span>' +
                        '<br>' +
                        '<span class="vote-count">' + answerCount + '</span>' +
                        '<span class="vote-count-total">/' + totalCount + '</span>&nbsp;' +
                        '<span class="vote-count-label">' + i18n.answers[lang] + '</span>TOKEN_SERVICE_DISPLAY_LINK' +
                    '</div>' +
                    '<div class="col-md-6">' +
                        '<div id="progress-bar-' + key + '" class="progress-bar progress-bar-skin"><div></div></div>' +
                    '</div>' +
                '</div>' +
                'TOKEN_SERVICE_SUBLIST_CONTAINER' +
                '<hr>' +
            '</div>';

        if(currentRankingList.length <= EXPECTED_NUMBER_OF_INSTITUTIONS){

            var serviceSublistDisplayLinkHtml = '&nbsp;<span class="vote-count-label show-details-institution-' + institutionId + '">' +
                '<a href="javascript:displayInstitutionServices(' + institutionId + ', \'' + rowType + '\')" id="lnk-details-services">(' + i18n.serviceList.show[lang] + ')</a>' +
            '</span>';

            // We are listing institutions, add html content for sublisting services
            var serviceSublistHtmlString =
                '<div class="row row-institution-services">' +
                    '<div class="col-md-12 row-institution-services-container institution-'+ institutionId + '-services-container"></div>' +
                '</div>';

            rowHtmlString = rowHtmlString.replace('TOKEN_SERVICE_DISPLAY_LINK', serviceSublistDisplayLinkHtml);
            rowHtmlString = rowHtmlString.replace('TOKEN_SERVICE_SUBLIST_CONTAINER', serviceSublistHtmlString);
        }else{
            // We are listing services, don't and any sublisting html content.
            rowHtmlString = rowHtmlString.replace('TOKEN_SERVICE_DISPLAY_LINK', '');
            rowHtmlString = rowHtmlString.replace('TOKEN_SERVICE_SUBLIST_CONTAINER', '');
        }

        $('.container-ranking').append(rowHtmlString);

        progressBar(val[rowType], $('#progress-bar-' + key));
    });
}

function displayInstitutionServices(institutionId, rowType){

    if($('.institution-' + institutionId + '-services-container').html() === ''){

        var institutionServices = [];

        $.each(services, function(key, val) {
            if(val['institution_id'] == institutionId){
                // only include services that have at least one vote for each satisfaction level:
                if(val["happyCount"] > 0 || val["mehCount"] > 0  || val["unhappyCount"] > 0 ){
                    institutionServices.push(val);
                }
            }
        });

        if(rowType === 'happy'){
            institutionServices.sort(sortByHappy);

        }else if (rowType === 'meh'){
            institutionServices.sort(sortByMeh);

        }else if (rowType === 'unhappy'){
            institutionServices.sort(sortByUnhappy);
        }

        // Header row labelling column of service values.
        var institutionServiceRowHeader =
                '<div class="row row-sub-service-list" style="padding-bottom:10px;">' +
                    '<div class="col-md-6"></div>' +
                    '<div class="col-md-2 percentage-count happy-color">' +
                        i18n.satisfied[lang] +
                    '</div>' +
                    '<div class="col-md-2 percentage-count meh-color">' +
                        i18n.moderatelySatisfied[lang] +
                    '</div>' +
                    '<div class="col-md-2 percentage-count unhappy-color">' +
                        i18n.dissatisfied[lang] +
                    '</div>' +
                '</div>';
        $('.institution-' + institutionId + '-services-container').append(institutionServiceRowHeader);

        $.each(institutionServices, function(key, val) {
            var serviceName = val["name_" + lang];
            var answerCount = val[rowType + "Count"];

            var evenOrOddRow = 'row-even';
            if(key % 2 != 0){
                evenOrOddRow = 'row-odd';
            }

            var institutionServiceRow =
                '<div class="row row-sub-service-list ' + evenOrOddRow + '">' +
                    '<div class="col-md-6 service-sublist-label">' +
                            (key + 1) + '. ' + serviceName +
                    '</div>' +
                    '<div class="col-md-2 percentage-count happy-color">' +
                        val["happy"] + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val['happyCount'] + '&nbsp;' + i18n.answers[lang] + ')</span>' +
                    '</div>' +
                    '<div class="col-md-2 percentage-count meh-color">' +
                        val["meh"] + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val['mehCount'] + '&nbsp;' + i18n.answers[lang] + ')</span>' +
                    '</div>' +
                    '<div class="col-md-2 percentage-count unhappy-color">' +
                        val["unhappy"] + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val['unhappyCount'] + '&nbsp;' + i18n.answers[lang] + ')</span>' +
                    '</div>' +
                '</div>';
            $('.institution-' + institutionId + '-services-container').append(institutionServiceRow);
        });
    }

    // when clicking on show details, show all the services for the current institutions.
    // If details are already shown, then the link become "hide details" link and clicking on on hides all the services.
    $('.institution-' + institutionId + '-services-container').slideToggle('slow', function() {

        // Animation complete
        if($('.institution-' + institutionId + '-services-container').css('display') === 'block'){
            $('.show-details-institution-' + institutionId + ' #lnk-details-services').html('(' + i18n.serviceList.hide[lang] + ')');

        }else{
            $('.show-details-institution-' + institutionId + ' #lnk-details-services').html('(' + i18n.serviceList.show[lang] + ')');
        }
    });

}


$(function() {
    // Set link to visualizer with selected language
    if(urlLangParam == null){
        urlLangParam = 'sq';
    }
    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/ranking/', '/') + '?lang=' + urlLangParam);

    if(satisfactionJson == null) {
        // get the citizen satisfaction result json
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function (data) {
            sessionStorage.setItem('satisfactionJson', JSON.stringify(data));
            satisfactionJson = data;
            processApiResponse(data);

        }).done(function () {
            $('.overllay').hide();
        });
    }else{
        processApiResponse(satisfactionJson);
        $('.overllay').hide();
    }

    function processApiResponse(data){
        
        $.each(data, function (key, val) {
            institutions.push({
                id: val['ID'],
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                happyCount: val['result_Good'],
                mehCount: val['result_Middle'],
                unhappyCount: val['result_Bad'],
                totalCount: val['result_Total']
            });
        });

        // By default, display institution ranking
        displayInstitutionRanking();

        // Do similar thing with services...
        $.each(data, function (ministryIndex) {
            $(satisfactionJson[ministryIndex]['ServiceGroups']).each(function () {
                $(this['Services']).each(function (key, val) {
                    services.push({
                        institution_id: satisfactionJson[ministryIndex]['ID'],
                        name_AL: val['ServiceName_AL'],
                        name_EN: val['ServiceName_EN'],
                        name_SR: val['ServiceName_SR'],
                        happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                        meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                        unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                        happyCount: val['result_Good'],
                        mehCount: val['result_Middle'],
                        unhappyCount: val['result_Bad'],
                        totalCount: val['result_Total']
                    });
                });
            });
        });
    }

    // Init keyup listener for search field
    $('.form-control-search').keyup(function() {
        $.each($('.institution-or-service-name'), function(key, value){
            var regexMatchRule = '\.*' + $('.form-control-search').val().slugify() + '\.*';

            // If institution or service name in current div doesn't match search, hide it.
            if($(value).html().slugify().match(regexMatchRule) == null){

                // Hide the row:
                $(value).parent().parent().parent().css('display', 'none');
                
            }else{
                // Else, display it.
                $(value).parent().parent().parent().css('display', 'block');
            }
        });
    });
});
