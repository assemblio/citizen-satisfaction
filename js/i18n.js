var lang = null;

// Get language we should display in
var urlLangParam = decodeURIComponent((new RegExp('[?|&]lang=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

if(urlLangParam === 'sr'){
    lang = 'SR';
}else if(urlLangParam === 'en'){
    lang = 'EN'
}else{
    lang = 'AL';
}

var i18n = {
    title:{
        AL: '',
        SR: '',
        EN: ''
    },
    institutions:{
        AL: 'Institucione',
        SR: 'NOT TRANSLATED',
        EN: 'Institutions'
    },
    services:{
        AL: 'Sh&euml;rbime',
        SR: 'NOT TRANSLATED',
        EN: 'Services'
    },
    answers:{
        AL: 'p&euml;rgjigje',
        SR: 'NOT TRANSLATED',
        EN: 'answers'
    },
    satisfied:{
        AL: 'T&euml; k&euml;naqur',
        SR: 'NOT TRANSLATED',
        EN: 'Satisfied'
    },
    moderatelySatisfied:{
        AL: 'Mesatarisht t&euml; k&euml;naqur',
        SR: 'NOT TRANSLATED',
        EN: 'Moderately Satisfied'
    },
    dissatisfied:{
        AL: 'T&euml; pak&euml;naqur',
        SR: 'NOT TRANSLATED',
        EN: 'Dissatisfied'
    },
    indicators:{
        quality:{
            AL: 'cil&euml;sin&euml; e<br>sh&euml;rbimit',
            SR: 'NOT TRANSLATED',
            EN: 'quality'
        },
        staff:{
            AL: 'kualitetin e<br>sh&euml;rbimit',
            SR: 'NOT TRANSLATED',
            EN: 'friendliness'
        },
        timeliness:{
            AL: 'koh&euml;zgjatjen e<br>sh&euml;rbimit',
            SR: 'NOT TRANSLATED',
            EN: 'timeliness'
        },
        payment:{
            AL: 'pages&euml;n e<br>sh&euml;rbimit',
            SR: 'NOT TRANSLATED',
            EN: 'payment'
        },
        online:{
            AL: 'meq&euml; sh&euml;rbimi nuk<br>&euml;sht&euml; online',
            SR: 'NOT TRANSLATED',
            EN: 'online'
        }
    },
    ranking:{
        AL: 'Niveli vl&euml;resues',
        SR: 'NOT TRANSLATED',
        EN: 'Ranking'
    },
    visualizer:{
        AL: 'Vizualizim',
        SR: 'NOT TRANSLATED',
        EN: 'Visualizer'
    }
};

// Display selected language

$(function() {
    if(urlLangParam === 'sr'){
        $('.selected-language').html('Srpski');
    }else if(urlLangParam === 'en'){
        $('.selected-language').html('English');
    }else{
        $('.selected-language').html('Shqip');
    }
});
