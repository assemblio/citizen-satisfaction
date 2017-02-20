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
        TR: 'OPI platformu, vatanda&#351;lar&#305;n g&#246;r&#252;&#351;leri do&#287;rultusunda toplanan sonu&#231;lar&#305;n zaman&#305;nda ve &#351;effaf bir &#351;ekilde yans&#305;mas&#305;n&#305; sa&#287;lamakta ve Kosova Cumhuriyeti kurumlar&#305;n&#305;n sa&#287;lad&#305;&#287;&#305; idari hizmetler i&#231;in kamu politikalar&#305;n&#305;n geli&#351;tirilmesini sa&#287;lamaktad&#305;r.'
    },
    descriptionbottom:{
        AL: 'Projekti \xEBsht\xEB bashk\xEBfinancuar nga Ministria e Administrat\xEBs Publike (MAP) dhe Programi i Kombeve t\xEB Bashkuara p\xEBr Zhvillim (UNDP) n\xEB Kosov\xEB.',
        SR: 'Projekat je ko-finansiran od strane Ministarstva za javnu upravu (MJU) i Programa za razvoj Ujedinjenin Nacija (UNDP) na Kosovu.',
        EN: 'The project is co-financed by the Ministry of Public Administration (MPA) and United Nations Development Programme (UNDP) in Kosovo.',
        TR: ''
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
        TR: 'Kamu&nbsp;Y&#246;netimi&nbsp;Bakanl&#305;&#287;&#305;'
    },
    institutions:{
        AL: 'Institucione',
        SR: 'Institucija',
        EN: 'Institutions',
        TR: 'Kurumlar'
    },
    services:{
        AL: 'Sh\xEBrbime',
        SR: 'Usluga',
        EN: 'Services',
        TR: 'Hizmetler'
    },
    answers:{
        AL: 'qytetar\xEB',
        SR: 'gra&#273;ana',
        EN: 'citizens',
        TR: 'vatanda&#351;lar'
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
        TR: 'K&#305;smi memnuniyet'
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
            TR: 'hizmet kalitesi'
        },
        staff:{
            AL: 'mir\xEBsjelljen e<br>zyrtarit',
            SR: 'ponasanje<br>sluzbenika',
            EN: 'behaviour of<br>the official',
            TR: 'yetkili davran&#305;&#351;&#305;'
        },
        timeliness:{
            AL: 'koh\xEBzgjatjen e<br>sh\xEBrbimit',
            SR: 'pravovremenost<br>pruzene usluge',
            EN: 'timeliness of<br>service provided',
            TR: 'hizmet s&#252;resi'
        },
        payment:{
            AL: 'pages\xEBn e<br>sh\xEBrbimit',
            SR: 'isplatni nivo<br>pruzene usluge',
            EN: 'payment level of<br>the rendered service',
            TR: 'hizmetin &#246;deme seviyesi'
        },
        online:{
            AL: 'meq\xEB sh\xEBrbimi nuk<br>\xEBsht\xEB online',
            SR: 'nema online<br>usluge',
            EN: 'no online<br>service rendered',
            TR: '&#231;evirim d&#305;&#351;&#305;'
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
        SR:'unknown',
        EN:'Trends',
        TR: 'E&#287;ilimler'
    },
    visualizer:{
        AL: 'Vizualizim',
        SR: 'Vizualizator',
        EN: 'Visualizer',
        TR: 'G&#246;sterge'
    },
    serviceList:{
        show: {
            AL: 'trego sh\xEBrbimet',
            SR: 'poka&#382;i usluge',
            EN: 'show services',
            TR: 'hizmetleri g&#246;ster'
        },
        hide:{
            AL: 'fsheh sh\xEBrbimet',
            SR: 'sakrij usluge',
            EN: 'hide services',
            TR: 'hizmetleri gizle'
        }
    },
    searchFor:{
        AL: 'Search for...',
        SR: 'Search for...',
        EN: 'Search for...',
        TR: 'I&#231;in ara ...'
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
