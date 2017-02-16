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
        AL: 'Platforma e OPI-t sh\xEBrben p\xEBr t\xEB reflektuar rezultatet e grumbulluara nga opinionet e qytetar\xEBve n\xEB koh\xEB reale dhe n\xEB m\xEBnyr\xEB transparente, si dhe mund\xEBson p\xEBrmir\xEBsimin e politikave publike p\xEBr sh\xEBrbimet administrative q\xEB ofrohen nga institucionet e Republik\xEBs s\xEB Kosov\xEBs.',
        SR: 'Platforma OPI slu&zcaron;i za odra&zcaron;avanje rezultata prikupljenih od mi&scaron;ljenja gra&#273;ana u realno vreme i na transparentan na&ccaron;in, i omogu&cacute;ava pobolj&scaron;anje javnih politika za administrativne usluga koje se pru&zcaron;aju od strane institucija Republike Kosova.',
        EN: 'OPI platform serves to reflect the results collected from the opinions of citizens in a timely and transparent manner, and enables the improvement of public policies for administrative services provided by the institutions of the Republic of Kosovo.'
    },
    descriptionbottom:{
        AL: 'Projekti \xEBsht\xEB bashk\xEBfinancuar nga Ministria e Administrat\xEBs Publike (MAP) dhe Programi i Kombeve t\xEB Bashkuara p\xEBr Zhvillim (UNDP) n\xEB Kosov\xEB.',
        SR: 'Projekat je ko-finansiran od strane Ministarstva za javnu upravu (MJU) i Programa za razvoj Ujedinjenin Nacija (UNDP) na Kosovu.',
        EN: 'The project is co-financed by the Ministry of Public Administration (MPA) and United Nations Development Programme (UNDP) in Kosovo.'
    },
    institutionLabel:{
        AL: "Institucioni",
        SR: "Institucije",
        EN: "Institution"
    },
    serviceLabel:{
        AL: "Sh\xEBrbimi",
        SR: "Usluge",
        EN: "Service"
    },
    logotext1:{
        AL: 'Republika e Kosov\xEBs',
        SR: 'Republika Kosova',
        EN: 'Republic of Kosovo'
    },
    logotext2:{
        AL: 'Ministria&nbsp;e&nbsp;Administrat\xEBs&nbsp;Publike',
        SR: 'Ministarstvo&nbsp;Javne&nbsp;Uprave',
        EN: 'Ministry&nbsp;of&nbsp;Public&nbsp;Administration'
    },
    institutions:{
        AL: 'Institucione',
        SR: 'Institucija',
        EN: 'Institutions'
    },
    services:{
        AL: 'Sh\xEBrbime',
        SR: 'Usluga',
        EN: 'Services'
    },
    answers:{
        AL: 'qytetar\xEB',
        SR: 'gra&#273;ana',
        EN: 'citizens'
    },
    satisfied:{
        AL: 'T\xEB k\xEBnaqur',
        SR: 'Zadovoljan',
        EN: 'Satisfied'
    },
    moderatelySatisfied:{
        AL: 'Mesatarisht t\xEB k\xEBnaqur',
        SR: 'Umereno zadovoljan',
        EN: 'Moderately Satisfied'
    },
    dissatisfied:{
        AL: 'T\xEB pak\xEBnaqur',
        SR: 'Nezadovoljan',
        EN: 'Dissatisfied'
    },
    indicators:{
        quality:{
            AL: 'cil\xEBsin\xEB e<br>sh\xEBrbimit',
            SR: 'kvalitet pruzene<br>usluge',
            EN: 'quality of<br>service rendered'
        },
        staff:{
            AL: 'mir\xEBsjelljen e<br>zyrtarit',
            SR: 'ponasanje<br>sluzbenika',
            EN: 'behaviour of<br>the official'
        },
        timeliness:{
            AL: 'koh\xEBzgjatjen e<br>sh\xEBrbimit',
            SR: 'pravovremenost<br>pruzene usluge',
            EN: 'timeliness of<br>service provided'
        },
        payment:{
            AL: 'pages\xEBn e<br>sh\xEBrbimit',
            SR: 'isplatni nivo<br>pruzene usluge',
            EN: 'payment level of<br>the rendered service'
        },
        online:{
            AL: 'meq\xEB sh\xEBrbimi nuk<br>\xEBsht\xEB online',
            SR: 'nema online<br>usluge',
            EN: 'no online<br>service rendered'
        }
    },
    ranking:{
        AL: 'Niveli vl\xEBresues',
        SR: 'Rang',
        EN: 'Ranking'
    },
    trends:{
        AL:'Trendi',
        SR:'unknown',
        EN:'Trends'
    },
    visualizer:{
        AL: 'Vizualizim',
        SR: 'Vizualizator',
        EN: 'Visualizer'
    },
    serviceList:{
        show: {
            AL: 'trego sh\xEBrbimet',
            SR: 'poka&#382;i usluge',
            EN: 'show services'
        },
        hide:{
            AL: 'fsheh sh\xEBrbimet',
            SR: 'sakrij usluge',
            EN: 'hide services'
        }
    },
    searchFor:{
        AL: 'Search for...',
        SR: 'Search for...',
        EN: 'Search for...'
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
