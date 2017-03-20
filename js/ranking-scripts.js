var SESSION_KEY_ID = 'general';
var NUMBER_OF_INSTITUTIONS = 0; //this will be set after building the data
var requestCompleteCounter = 0;
var institutionSelected = false;
// convert services associative array to just a list.
var tempList = new Array()
for(var key in services['general']){
   for(var i=0; i< services['general'][key].length; i++){
        tempList.push(services['general'][key][i]);
   }
}

services[SESSION_KEY_ID] = tempList;

var currentRankingList = null;

function sortByHappy(a, b){
    if(a.results.percentage.good == b.results.percentage.good){
        if (a.results.count.good == b.results.count.good) {
            var A;
            var B;
            A = a.name[lang].toUpperCase();
            B = b.name[lang].toUpperCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        }

        return b.results.count.good - a.results.count.good;
    }
    return b.results.percentage.good - a.results.percentage.good;
}

function sortByMeh(a, b){
    if(a.results.percentage.mid == b.results.percentage.mid){
        if (a.results.count.mid == b.results.count.mid) {
            var A;
            var B;
            A = a.name[lang].toUpperCase();
            B = b.name[lang].toUpperCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        }

        return b.results.count.mid - a.results.count.mid;
    }
    return b.results.percentage.mid - a.results.percentage.mid;
}

function sortByUnhappy(a, b){
    if(a.results.percentage.bad == b.results.percentage.bad){
        if (a.results.count.bad == b.results.count.bad) {
            var A;
            var B;
            A = a.name[lang].toUpperCase();
            B = b.name[lang].toUpperCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        }

        return b.results.count.bad - a.results.count.bad;
    }
    return b.results.percentage.bad - a.results.percentage.bad;
}

function progressBar(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 3000).html(percent + "%&nbsp;");
}

function displayInstitutionRanking(){
    institutionSelected = true;
    $('#dropdown-first .selected-value').html(i18n.institutions[lang]);
    currentRankingList = institutions[SESSION_KEY_ID];
    displayHappyRanking();
}

function displayServiceRanking(){
    $('#dropdown-first .selected-value').html(i18n.services[lang]);
    currentRankingList = new Array();
    for (var i = 1; i <= NUMBER_OF_INSTITUTIONS; i++) {
        $(services[SESSION_KEY_ID][i]).each(function(key,value) {
            currentRankingList.push(value)
        });
    }
    institutionSelected = false;
    displayHappyRanking();
}

function displayHappyRanking(){
    $('#dropdown-second .selected-value').html(i18n.satisfied[lang]);
    currentRankingList.sort(sortByHappy);
    resetRanking('good', 'happy', currentRankingList);
}

function displayMehRanking(){
    $('#dropdown-second .selected-value').html(i18n.moderatelySatisfied[lang]);
    currentRankingList.sort(sortByMeh);
    resetRanking('mid', 'meh', currentRankingList);
}

function displayUnhappyRanking(){
    currentRankingList.sort(sortByUnhappy);
    $('#dropdown-second .selected-value').html(i18n.dissatisfied[lang]);
    resetRanking('bad', 'unhappy', currentRankingList);
}

function resetRanking(satisfaction, rowType, currentRankingList){
    // Clear ranking
    $('.container-ranking').empty();

    $.each(currentRankingList, function( key, val ) {

        var institutionId = val.id;
        var name = val.name[lang];
        var answerCount = val.results.count[satisfaction];
        var totalCount = val.results.count.tot;

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

        if(institutionSelected){

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

        progressBar(val.results.percentage[satisfaction], $('#progress-bar-' + key));
    });
}

function displayInstitutionServices(institutionId, rowType){

    if($('.institution-' + institutionId + '-services-container').html() === ''){

        var institutionServices = [];

        for(var i=1; i<= NUMBER_OF_INSTITUTIONS ; i++){

            $.each(services[SESSION_KEY_ID][i], function(key, val) {
                if(val.iid == institutionId){
                    // only include services that have at least one vote for each satisfaction level:
                    if(val.results.count.good > 0 || val.results.count.mid > 0  || val.results.count.bad > 0 ){
                        institutionServices.push(val);
                    }
                }
            });
        }

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
                    '<div class="col-md-6 sub-service-list-title">' + i18n.services[lang] + ':</div>' +
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
            var serviceName = val.name[lang];

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
                        val.results.percentage.good + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val.results.count.good + '&nbsp;' + i18n.answers[lang] + ')</span>' +
                    '</div>' +
                    '<div class="col-md-2 percentage-count meh-color">' +
                        val.results.percentage.mid + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val.results.count.mid + '&nbsp;' + i18n.answers[lang] + ')</span>' +
                    '</div>' +
                    '<div class="col-md-2 percentage-count unhappy-color">' +
                        val.results.percentage.bad + '%' + '&nbsp;<span class="vote-count-label">&nbsp;(' + val.results.count.bad + '&nbsp;' + i18n.answers[lang] + ')</span>' +
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

function onFetchDataComplete(sessionKeyId){
    if(sessionKeyId == 'general'){
        requestCompleteCounter += 1;
    }
    if(requestCompleteCounter == 1){
        // By default, display institution ranking
        buildData()
    }
}

function buildData(){
    NUMBER_OF_INSTITUTIONS = institutions['general'].length //this is set to the number of institutions
    displayInstitutionRanking();
    $('.overllay').hide();
}

$(function() {
    // Set link to visualizer with selected language
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


    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/ranking/', '/') + '?lang=' + urlLangParam);
    $('.navbar-brand').attr('href', document.location.pathname.replace('/ranking/', '/') + '?lang=' + urlLangParam);
    $('#lnk-trends').attr('href', document.location.pathname.replace('/ranking/', '/trends') + '?lang=' + urlLangParam);
    $('#lnk-ranking').attr('href', document.location.pathname + '?lang=' + urlLangParam);

    var urls = apiUrl();
    if (!isDataCached()) {
        fetchData(urls['third'], 'third');
        fetchData(urls['second'], 'second');
        fetchData(urls['first'], 'first');
        fetchData(urls['general'], 'general');
    }
    else {
        institutions = {
            'general': JSON.parse(sessionStorage.getItem('institutions_general')),
        }

        services = {
            'general': JSON.parse(sessionStorage.getItem('services_general')),
        }
        buildData();
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
