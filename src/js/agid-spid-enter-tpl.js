var spidTpl = {
	spidMainContainers: function() {
		return [
			'<link rel="stylesheet" href="css/agid-spid-enter.min.css">',
            '<div id="infomodal" class="modal"></div>',
            '<div id="agid-spid-enter"></div>'
		].join('');
	},
	spidProviderChoiceModal: function(spidProvidersButtons) {
	    return [
	        '<div id="agid-spid-button-anim">',
	            '<div id="agid-spid-button-anim-base"></div>',
	            '<div id="agid-spid-button-anim-icon"></div>',
	        '</div>',
	        '<section id="agid-spid-panel-select" class="agid-spid-panel" aria-labelledby="agid-spid-enter-title-page" hidden>',
	            '<header id="agid-spid-panel-header">',
	                '<nav class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">',
	                    '<div role="button">',
	                        '<a id="agid-spid-panel-close-button" href="#" class="agid-spid-button">',
	                            '<img src="img/x-icon.svg" alt="Torna indietro">',
	                        '</a>',
	                    '</div>',
	                '</nav>',
	                '<div class="agid-spid-panel-logo agid-spid-panel-element">',
	                    '<img aria-hidden="true" src="img/spid-logo-c-lb.svg" alt="Logo SPID">',
	                '</div>',
	            '</header>',
	            '<div id="agid-spid-panel-content">',
	                '<div class="agid-spid-panel-content-center">',
	                    '<div id ="agid-spid-enter-title-container">',
	                        '<h1 id="agid-spid-enter-title-page">Scegli il tuo provider SPID</h1>',
	                    '</div>',
	                    '<div id="agid-spid-idp-list" class="agid-spid-row">',
	                        spidProvidersButtons,       
	                    '</div>',
	                    '<div id="agid-cancel-access-container">',
	                        '<a id="agid-spid-cancel-access-button" href="#">',
	                            '<div id="agid-cancel-access-button" class="agid-transparent-button" role="button">',
	                                '<span>Annulla l\'accesso</span>',
	                            '</div>',
	                        '</a>',
	                    '</div>',
	                    '<div id="agid-logo-container" aria-hidden="true">',
	                        '<img id="agid-logo" class="agid-logo" src="./img/agid-logo-bb-short.png" aria-hidden="true" />',
	                    '</div>',
	                '</div>',
	            '</div>',
	            '<footer id="agid-spid-panel-footer">',
	                '<div id="agid-action-button-container">',
	                    '<a href="#">',
	                        '<div id="nospid" class="agid-action-button" role="button">',
	                            '<span>Non hai SPID?</span>',
	                        '</div>',
	                    '</a>',
	                    '<a href="#">',
	                        '<div id="cosaspid" class="agid-action-button" role="button">',
	                            '<span>Cos\'e SPID?</span>',
	                        '</div>',
	                    '</a>',
	                '</div>',
	            '</footer>',
	        '</section>'
		].join('');
	},
	spidProviderButton: function(providerData) {
	    return [
	        '<span class="agid-spid-col l3 m6 s6 xs12" role="button">',
	            '<a href="', providerData.url, '"',
	                // la seconda classe è necessaria? non è in nessun CSS, potrebbe essere messa in config, oppure affidarsi al nome della config
	                'class="agid-spid-idp-button agid-spid-idp-infocertid"',
	                'title="', providerData.title, '"',
	                'style="background-image: url(img/idp-logos/', providerData.logo, ')">',
	            '</a>',
	        '</span>'
	    ].join('');		
	},
	spidButton: function(sizeClass) {
	    return [
	        '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * begin * -->',
	        '<button class="agid-spid-enter agid-spid-enter-size-', sizeClass, '" style="display:none">',
	            '<span aria-hidden="true" class="agid-spid-enter-icon">',
	                '<img aria-hidden="true" src="img/spid-ico-circle-bb.svg" onerror="this.src=\'img/spid-ico-circle-bb.png\'; this.onerror=null;" alt="Entra con SPID" />',
	            '</span>',
	            '<span class="agid-spid-enter-text">Entra con SPID</span>',
	        '</button>',
	        '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * end * -->'
	    ].join('');
	},
	modalCloseButton: function(text) {
		return [
	        '<div class="modal-content">',
	            '<span id="closemodalbutton" class="close" >&times;</span>',
	            '<p>', text, '</p>',
	        '</div>'
	    ].join('');
	}
}
