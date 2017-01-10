var lang = 'AL';
var satisfactionJson = null;
var institutions = [];

function sortByHappy(a, b){
    return b.happy - a.happy;
}

function sortByMeh(a, b){
    return b.meh - a.meh;
}

function sortByUnhappy(a, b){
    return b.unhappy - a.unhappy;
}

function progressBar(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 3000).html(percent + "%&nbsp;");
}

function displayHappyRanking(){
    institutions.sort(sortByHappy);
    resetRanking('happy');
}

function displayMehRanking(){
    institutions.sort(sortByMeh);
    resetRanking('meh');
}

function displayUnhappyRanking(){
    institutions.sort(sortByUnhappy);
    resetRanking('unhappy');
}

function resetRanking(rowType){
    // Clear ranking
    $('.container-ranking').empty();

    $.each( institutions, function( key, val ) {

        var institutionName = val["name_" + lang];
        var answerCount = val[rowType + "Count"];

        $('.container-ranking').append(
            '<div class="row row-ranking row-' + rowType + '">' +
                '<div class="col-md-6 institution-name">' +
                    (key + 1) + '. ' + institutionName +
                    '<br>' +
                    '<span class="vote-count">' + answerCount + '</span> <span class="vote-count-label">përgjigje</span>' +
                '</div>' +
                '<div class="col-md-6">' +
                    '<div id="progress-bar-' + key + '" class="progress-bar progress-bar-skin"><div></div></div>' +
                '</div>' +
            '</div><hr>');

        progressBar(val[rowType], $('#progress-bar-' + key));
    });
}

$(function() {
    /**
    $.getJSON( "http://csis.appdec.com/api/report/general", function( data ) {
        $.each( data, function( key, val ) {
            console.log(val);
        });
    });**/

    /** get the citizen satisfaction result json **/
    $.getJSON( "../results.json", function( data ) {

        // Store result in a global variable for future use.
        satisfactionJson = data;

        $.each( data, function( key, val ) {
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

        displayHappyRanking();
    });
});
