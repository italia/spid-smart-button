window.agidSpidEnterTpl = {
	spidMainContainers: function() {
		return [
			'<link rel="stylesheet" href="css/agid-spid-enter.min.css">',
            '<div id="agid-infomodal" class="modal"></div>',
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
	infoModal: function(htmlContent) {
		return [
	        '<div class="modal-content">',
	            '<span id="closemodalbutton" class="close" >&times;</span>',
	            '<div>', htmlContent, '</div>',
	        '</div>'
	    ].join('');
	},
	cosaSpid: function() {
		return [
			'<h1>HTML Ipsum Presents</h1>',
			'<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>',
			'<h2>Header Level 2</h2>',
			'<ol>',
			   '<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>',
			   '<li>Aliquam tincidunt mauris eu risus.</li>',
			'</ol>',
			'<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>',
			'<h3>Header Level 3</h3>',
			'<ul>',
			   '<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>',
			   '<li>Aliquam tincidunt mauris eu risus.</li>',
			'</ul>'
	    ].join('');
	}
}
