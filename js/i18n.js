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
        AL: 'Kosovo',
        SR: '',
        EN: ''
    },
    institutions:{
        AL: 'Institucione',
        SR: 'Institucija',
        EN: 'Institutions'
    },
    services:{
        AL: 'Sh&euml;rbime',
        SR: 'Usluga',
        EN: 'Services'
    },
    answers:{
        AL: 'p&euml;rgjigje',
        SR: 'odgovor',
        EN: 'answers'
    },
    satisfied:{
        AL: 'T&euml; k&euml;naqur',
        SR: 'Zadovoljan',
        EN: 'Satisfied'
    },
    moderatelySatisfied:{
        AL: 'Mesatarisht t&euml; k&euml;naqur',
        SR: 'Umereno zadovoljan',
        EN: 'Moderately Satisfied'
    },
    dissatisfied:{
        AL: 'T&euml; pak&euml;naqur',
        SR: 'Nezadovoljan',
        EN: 'Dissatisfied'
    },
    indicators:{
        quality:{
            AL: 'cil&euml;sin&euml; e<br>sh&euml;rbimit',
            SR: 'kvalitet pruzene<br>usluge',
            EN: 'quality of<br>service rendered'
        },
        staff:{
            AL: 'kualitetin e<br>sh&euml;rbimit',
            SR: 'Ljubaznost funkcionera',
            EN: 'friendliness of<br>the official'
        },
        timeliness:{
            AL: 'koh&euml;zgjatjen e<br>sh&euml;rbimit',
            SR: 'pravovremenost<br>pruzene usluge',
            EN: 'timeliness of<br>service provided'
        },
        payment:{
            AL: 'pages&euml;n e<br>sh&euml;rbimit',
            SR: 'isplatni nivo<br>pruzene usluge',
            EN: 'payment level of<br>the rendered service'
        },
        online:{
            AL: 'meq&euml; sh&euml;rbimi nuk<br>&euml;sht&euml; online',
            SR: 'nema online<br>usluge',
            EN: 'no online<br>service rendered'
        }
    },
    ranking:{
        AL: 'Niveli vl&euml;resues',
        SR: 'Rang',
        EN: 'Ranking'
    },
    visualizer:{
        AL: 'Vizualizim',
        SR: 'Vizualizator',
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
