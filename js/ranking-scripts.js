var API_REQUEST_URL_GENERAL_RESULT = document.location.pathname.replace('/ranking/', '/') + 'results.json';
// 'http://csis.appdec.com/api/report/general'

var satisfactionJson = null;
var institutions = [];
var services = [];

var currentRankingList = null;

function sortByHappy(a, b){
    if(a.happy == b.happy){
        if (a.happyCount == b.happyCount) {
            return b.name_AL - a.name_AL;
        }
        return b.happyCount - a.happyCount;
    }
    return b.happy - a.happy;
}

function sortByMeh(a, b){
    if(a.meh == b.meh){
        if (a.mehCount == b.mehCount) {
            return b.name_AL - a.name_AL;
        }
        return b.mehCount - a.mehCount;
    }
    return b.meh - a.meh;
}

function sortByUnhappy(a, b){
    if (a.unhappy == b.unhappy) {
        if (a.unhappyCount == b.unhappyCount) {
            return b.name_AL - a.name_AL;
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

        var institutionName = val["name_" + lang];
        var answerCount = val[rowType + "Count"];

        $('.container-ranking').append(
            '<div class="row row-ranking row-' + rowType + '">' +
                '<div class="col-md-6 institution-name">' +
                    (key + 1) + '. ' + institutionName +
                    '<br>' +
                    '<span class="vote-count">' + answerCount + '</span> <span class="vote-count-label">' + i18n.answers[lang] + '</span>' +
                '</div>' +
                '<div class="col-md-6">' +
                    '<div id="progress-bar-' + key + '" class="progress-bar progress-bar-skin"><div></div></div>' +
                '</div>' +
            '</div><hr>');

        progressBar(val[rowType], $('#progress-bar-' + key));
    });
}

$(function() {
    // Set link to visualizer with selected language
    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/ranking/', '/') + '?lang=' + urlLangParam);

    // get the citizen satisfaction result json
    $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function( data ) {

        // Store result in a global variable for future use.
        satisfactionJson = data;

        $.each( data, function(key, val) {
            institutions.push({
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                happyCount: val['result_Good'],
                mehCount: val['result_Middle'],
                unhappyCount: val['result_Bad']
            });
        });

        // By default, display institution ranking
        displayInstitutionRanking();

        // Do similar thing with services...
        $.each( data, function( ministryIndex) {
            $(satisfactionJson[ministryIndex]['ServiceGroups']).each(function() {
                $(this['Services']).each(function(key, val) {
                    services.push({
                        name_AL: val['ServiceName_AL'],
                        name_EN: val['ServiceName_EN'],
                        name_SR: val['ServiceName_SR'],
                        happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                        meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                        unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                        happyCount: val['result_Good'],
                        mehCount: val['result_Middle'],
                        unhappyCount: val['result_Bad']
                    });
                });
            });
        });
    });
});
