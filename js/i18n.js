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
        AL: 'Platforma e OPI-t',
        SR: 'Platforma OPI',
        EN: 'OPI Platform'
    },
    description:{
        AL: 'Platforma e OPI-t sh&euml;rben p&euml;r t&euml; reflektuar rezultatet e grumbulluara nga opinionet e qytetar&euml;ve n&euml; koh&euml; reale dhe n&euml; m&euml;nyr&euml; transparente, si dhe mund&euml;son p&euml;rmir&euml;simin e politikave publike p&euml;r sh&euml;rbimet administrative q&euml; ofrohen nga institucionet e Republik&euml;s s&euml; Kosov&euml;s.',
        SR: 'Platforma OPI slu&zcaron;i za odra&zcaron;avanje rezultata prikupljenih od mi&scaron;ljenja gra&#273;ana u realno vreme i na transparentan na&ccaron;in, i omogu&cacute;ava pobolj&scaron;anje javnih politika za administrativne usluga koje se pru&zcaron;aju od strane institucija Republike Kosova.',
        EN: 'OPI platform serves to reflect the results collected from the opinions of citizens in a timely and transparent manner, and enables the improvement of public policies for administrative services provided by the institutions of the Republic of Kosovo.'
    },
    descriptionbottom:{
        AL: 'Projekti &euml;sht&euml; bashk&euml;financuar nga Ministria e Administrat&euml;s Publike (MAP) dhe Programi i Kombeve t&euml; Bashkuara p&euml;r Zhvillim (UNDP) n&euml; Kosov&euml;.',
        SR: 'Projekat je ko-finansiran od strane Ministarstva za javnu upravu (MJU) i Programa za razvoj Ujedinjenin Nacija (UNDP) na Kosovu.',
        EN: 'The project is co-financed by the Ministry of Public Administration (MPA) and United Nations Development Programme (UNDP) in Kosovo.'
    },
    institutionLabel:{
        AL: "Institucioni",
        SR: "Institucije",
        EN: "Institution"
    },
    serviceLabel:{
        AL: "Sh&euml;rbimi",
        SR: "Usluge",
        EN: "Service"
    },
    logotext1:{
        AL: 'Republika e Kosov&euml;s',
        SR: 'Republika Kosova',
        EN: 'Republic of Kosovo'
    },
    logotext2:{
        AL: 'Ministria&nbsp;e&nbsp;Administrat&euml;s&nbsp;Publike',
        SR: 'Ministarstvo&nbsp;Javne&nbsp;Uprave',
        EN: 'Ministry&nbsp;of&nbsp;Public&nbsp;Administration'
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
        AL: 'qytetar&euml;',
        SR: 'gra&#273;ana',
        EN: 'citizens'
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
            AL: 'mir&euml;sjelljen e<br>zyrtarit',
            SR: 'ponasanje<br>sluzbenika',
            EN: 'behaviour of<br>the official'
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
    },
    serviceList:{
        show: {
            AL: 'trego sh&euml;rbimet',
            SR: 'poka&#382;i usluge',
            EN: 'show services'
        },
        hide:{
            AL: 'fsheh sh&euml;rbimet',
            SR: 'sakrij usluge',
            EN: 'hide services'
        }
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
