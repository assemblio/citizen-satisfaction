var lang = null;

// Get language we should display in
var urlLangParam = decodeURIComponent((new RegExp('[?|&]lang=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

if(urlLangParam === 'sr'){
    lang = 'SR';
}else if(urlLangParam === 'en'){
    lang = 'EN';
}
else if(urlLangParam === 'tr'){
    lang = 'TR';
}
else{
    lang = 'AL';
}

var i18n = {
    title:{
        AL: 'Platforma e OPI-t',
        SR: 'Platforma OPI',
        EN: 'OPI Platform',
        TR: 'OPI Platformu'
    },
    description:{
        AL: 'Platforma e OPI-t sh\xEBrben p\xEBr t\xEB reflektuar rezultatet e grumbulluara nga opinionet e qytetar\xEBve n\xEB koh\xEB reale dhe n\xEB m\xEBnyr\xEB transparente, si dhe mund\xEBson p\xEBrmir\xEBsimin e politikave publike p\xEBr sh\xEBrbimet administrative q\xEB ofrohen nga institucionet e Republik\xEBs s\xEB Kosov\xEBs.',
        SR: 'Platforma OPI slu&zcaron;i za odra&zcaron;avanje rezultata prikupljenih od mi&scaron;ljenja gra&#273;ana u realno vreme i na transparentan na&ccaron;in, i omogu&cacute;ava pobolj&scaron;anje javnih politika za administrativne usluga koje se pru&zcaron;aju od strane institucija Republike Kosova.',
        EN: 'OPI platform serves to reflect the results collected from the opinions of citizens in a timely and transparent manner, and enables the improvement of public policies for administrative services provided by the institutions of the Republic of Kosovo.',
        TR: 'OPI platformu, vatanda\u015flar\u0131n g\xf6r&#252;\u015fleri do\u011frultusunda toplanan sonu&#231;lar\u0131n zaman\u0131nda ve \u015feffaf bir \u015fekilde yans\u0131mas\u0131n\u0131 sa\u011flamakta ve Kosova Cumhuriyeti kurumlar\u0131n\u0131n sa\u011flad\u0131\u011f\u0131 idari hizmetler i&#231;in kamu politikalar\u0131n\u0131n geli\u015ftirilmesini sa\u011flamaktad\u0131r.'
    },
    descriptionbottom:{
        AL: 'Projekti \xEBsht\xEB bashk\xEBfinancuar nga Ministria e Administrat\xEBs Publike (MAP) dhe Programi i Kombeve t\xEB Bashkuara p\xEBr Zhvillim (UNDP) n\xEB Kosov\xEB.',
        SR: 'Projekat je ko-finansiran od strane Ministarstva za javnu upravu (MJU) i Programa za razvoj Ujedinjenin Nacija (UNDP) na Kosovu.',
        EN: 'The project is co-financed by the Ministry of Public Administration (MPA) and United Nations Development Programme (UNDP) in Kosovo.',
        TR: 'Proje, Kosova Kamu Y\xf6netimi Bakanlı\u011fı ve Birle\u015fmi\u015f Milletler Kalkınma Programı (UNDP) tarafından ortak olarak finanse edilmektedir.'
    },
    institutionLabel:{
        AL: "Institucioni",
        SR: "Institucije",
        EN: "Institution",
        TR: 'Kurum'
    },
    serviceLabel:{
        AL: "Sh\xEBrbimi",
        SR: "Usluge",
        EN: "Service",
        TR: 'Hizmet'
    },
    logotext1:{
        AL: 'Republika e Kosov\xEBs',
        SR: 'Republika Kosova',
        EN: 'Republic of Kosovo',
        TR: 'Kosova Cumhuriyeti'
    },
    logotext2:{
        AL: 'Ministria&nbsp;e&nbsp;Administrat\xEBs&nbsp;Publike',
        SR: 'Ministarstvo&nbsp;Javne&nbsp;Uprave',
        EN: 'Ministry&nbsp;of&nbsp;Public&nbsp;Administration',
        TR: 'Kamu&nbsp;Y\xf6netimi&nbsp;Bakanl\u0131\u011f\u0131'
    },
    institutions:{
        AL: 'Institucione',
        SR: 'Institucija',
        EN: 'Institutions',
        TR: 'Kurumlar'
    },
    services:{
        AL: 'Sh\xEBrbimet',
        SR: 'Usluga',
        EN: 'Services',
        TR: 'Hizmetler'
    },
    allServices:{
        AL: 'T\xEB gjitha sh\xEBrbimet',
        SR: 'Sve usluge',
        EN: 'All services',
        TR: 'T\xfcm hizmetler'
    },
    answers:{
        AL: 'qytetar\xEB',
        SR: 'gra&#273;ana',
        EN: 'citizens',
        TR: 'vatanda\u015flar'
    },
    satisfied:{
        AL: 'T\xEB k\xEBnaqur',
        SR: 'Zadovoljan',
        EN: 'Satisfied',
        TR: 'Memnuniyet'
    },
    moderatelySatisfied:{
        AL: 'Mesatarisht t\xEB k\xEBnaqur',
        SR: 'Umereno zadovoljan',
        EN: 'Moderately Satisfied',
        TR: 'K\u0131smi memnuniyet'
    },
    dissatisfied:{
        AL: 'T\xEB pak\xEBnaqur',
        SR: 'Nezadovoljan',
        EN: 'Dissatisfied',
        TR: 'Memnuniyetsizlik'
    },
    indicators:{
        quality:{
            AL: 'cil\xEBsin\xEB e<br>sh\xEBrbimit',
            SR: 'kvalitet pruzene<br>usluge',
            EN: 'quality of<br>service rendered',
            TR: 'hizmet kalitesi<br></br>'
        },
        staff:{
            AL: 'mir\xEBsjelljen e<br>zyrtarit',
            SR: 'ponasanje<br>sluzbenika',
            EN: 'behaviour of<br>the official',
            TR: 'yetkili davran\u0131\u015f\u0131<br></br>'
        },
        timeliness:{
            AL: 'koh\xEBzgjatjen e<br>sh\xEBrbimit',
            SR: 'pravovremenost<br>pruzene usluge',
            EN: 'timeliness of<br>service provided',
            TR: 'hizmet s&#252;resi<br></br>'
        },
        payment:{
            AL: 'pages\xEBn e<br>sh\xEBrbimit',
            SR: 'isplatni nivo<br>pruzene usluge',
            EN: 'payment level of<br>the rendered service',
            TR: 'hizmetin \xf6deme<br>seviyesi'
        },
        online:{
            AL: 'meq\xEB sh\xEBrbimi nuk<br>\xEBsht\xEB online',
            SR: 'nema online<br>usluge',
            EN: 'no online<br>service rendered',
            TR: '\xE7evirim d\u0131\u015f\u0131<br></br>'
        }
    },
    ranking:{
        AL: 'Niveli vl\xEBresues',
        SR: 'Rang',
        EN: 'Ranking',
        TR: 'Klasman'
    },
    trends:{
        AL:'Trendet',
        SR:'Smer',
        EN:'Trends',
        TR: 'E\u011filimler'
    },
    visualizer:{
        AL: 'Vizualizim',
        SR: 'Vizualizator',
        EN: 'Visualizer',
        TR: 'G\xf6sterge'
    },
    serviceList:{
        show: {
            AL: 'trego sh\xEBrbimet',
            SR: 'poka&#382;i usluge',
            EN: 'show services',
            TR: 'hizmetleri g\xf6ster'
        },
        hide:{
            AL: 'fsheh sh\xEBrbimet',
            SR: 'sakrij usluge',
            EN: 'hide services',
            TR: 'hizmetleri gizle'
        }
    },
    searchFor:{
        AL: 'K\xEBrko p\xEBr...',
        SR: 'Tragati za...',
        EN: 'Search for...',
        TR: 'I\xe7in ara ...'
    },
    weeks1:{
        AL: 'para nj\xEB jave',
        SR: 'pre jedne nedelje',
        EN: 'one week ago',
        TR: 'bir hafta \xf6nce'
    },
    weeks2:{
        AL: 'para dy jav\xEBsh',
        SR: 'pre dve nedelje',
        EN: 'two weeks ago',
        TR: 'iki hafta \xf6nce'
    },
    weeks3:{
        AL: 'para tre jav\xEBsh',
        SR: 'pre tri nedelje',
        EN: 'three weeks ago',
        TR: '\xfcç hafta \xf6nce'
    },
    nodata:{
        AL: 'Na vjen keq, por nuk ka t\xEB dh\xEBna p\xEBr ',
        SR: '\u017dao nam je ali ti podaci ne postoje za ',
        EN: "We're sorry, but there is no data for ",
        TR: '\xdczg\xfcn\xfcz, fakat veri bulunmamaktadır i\xe7in '
    }
};

// Display selected language

$(function() {
    if(urlLangParam === 'sr'){
        $('.selected-language').html('Srpski');

    }else if(urlLangParam === 'en'){
        $('.selected-language').html('English');
    }
    else if(urlLangParam === 'tr'){
        $('.selected-language').html('T&uuml;rk&ccedil;e');
    }
    else{
        $('.selected-language').html('Shqip');
    }
});
