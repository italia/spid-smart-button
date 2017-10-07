function displaySPIDConfiguredProviders() {
    var agid_spid_enter = document.getElementById('agid-spid-enter'),
        panel_html      = [
            '<div id="agid-spid-button-anim">',
                '<div id="agid-spid-button-anim-base"></div>',
                '<div id="agid-spid-button-anim-icon"></div>',
            '</div>',
            '<section id="agid-spid-panel-select" class="agid-spid-panel" aria-labelledby="agid-spid-enter-title-page" hidden>',
                '<header id="agid-spid-panel-header">',
                    '<nav class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">',
                        '<div role="button">',
                            '<a href="#" onclick="hidePanel(\'agid-spid-panel-select\')" class="agid-spid-button">',
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
                        '<div id="agid-spid-idp-list" class="agid-spid-row">'
        ].join('');

    // Cicla l'oggetto config e aggiunge i pulsanti dei provider disponibili
    for (var provider in config) {
        var providerData = config[provider];

        if (!providerData.url) return;

        panel_html += [
            '<span class="agid-spid-col l3 m6 s6 xs12" role="button">',
                '<a href="', providerData.url, '"',
                    // la seconda classe è necessaria? non è in nessun CSS, potrebbe essere messa in config, oppure affidarsi al nome della config
                    'class="agid-spid-idp-button agid-spid-idp-infocertid"',
                    'title="', providerData.title, '"',
                    'style="background-image: url(\'img/idp-logos/' + providerData.logo, '\')">',
                '</a>',
            '</span>'
        ].join('');
    };

    panel_html += [
                    '</div>',
                    '<div id="agid-cancel-access-container">',
                        '<a href="#"  onclick="hidePanel(\'agid-spid-panel-select\')">',
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

    agid_spid_enter.innerHTML = panel_html;

    document.getElementById("nospid").addEventListener('click', function(ev) { openmodal('Non hai SPID?'); });
    document.getElementById("cosaspid").addEventListener('click', function(ev) { openmodal('Cos\'è SPID?');});
}

function insertButtonS() {
var agid_spid_enter_button_xl = document.getElementsByClassName("agid-spid-enter-button-size-s");
        var i;
        for (i = 0; i < agid_spid_enter_button_xl.length; i++) {
agid_spid_enter_button_xl[i].innerHTML = '\
			<!-- AGID - SPID BUTTON SMALL * begin * -->\
			<button class="agid-spid-enter agid-spid-enter-size-s" onclick="showPanel(\'agid-spid-panel-select\')">\
				<span class="agid-spid-enter-icon"><img aria-hidden="true"  src="img/spid-ico-circle-bb.svg" onerror="this.src=\'img/spid-ico-circle-bb.png\'; this.onerror=null;" alt="Entra con SPID" /></span>\
				<span class="agid-spid-enter-text">Entra con SPID</span>\
			</button>\
			<!-- AGID - SPID BUTTON SMALL * end * -->		\
		';
}
}

function insertButtonM() {
var agid_spid_enter_button_xl = document.getElementsByClassName("agid-spid-enter-button-size-m");
        var i;
        for (i = 0; i < agid_spid_enter_button_xl.length; i++) {
agid_spid_enter_button_xl[i].innerHTML = '\
			<!-- AGID - SPID BUTTON MEDIUM * begin * -->\
			<button class="agid-spid-enter agid-spid-enter-size-m" onclick="showPanel(\'agid-spid-panel-select\')">\
				<span class="agid-spid-enter-icon"><img aria-hidden="true" src="img/spid-ico-circle-bb.svg" onerror="this.src=\'img/spid-ico-circle-bb.png\'; this.onerror=null;" alt="Entra con SPID" /></span>\
				<span class="agid-spid-enter-text">Entra con SPID</span>\
			</button>\
			<!-- AGID - SPID BUTTON MEDIUM * end * -->	\
		';
}
}

function insertButtonL() {
var agid_spid_enter_button_xl = document.getElementsByClassName("agid-spid-enter-button-size-l");
        var i;
        for (i = 0; i < agid_spid_enter_button_xl.length; i++) {
agid_spid_enter_button_xl[i].innerHTML = '\
			<!-- AGID - SPID BUTTON LARGE * begin * -->\
			<button class="agid-spid-enter agid-spid-enter-size-l" onclick="showPanel(\'agid-spid-panel-select\')">\
				<span class="agid-spid-enter-icon"><img aria-hidden="true"  src="img/spid-ico-circle-bb.svg" onerror="this.src=\'img/spid-ico-circle-bb.png\'; this.onerror=null;" alt="Entra con SPID" /></span>\
				<span class="agid-spid-enter-text">Entra con SPID</span>\
			</button>\
			<!-- AGID - SPID BUTTON LARGE * end * -->	\
		';
}
}

function insertButtonXl() {
var agid_spid_enter_button_xl = document.getElementsByClassName("agid-spid-enter-button-size-xl");
        var i;
        for (i = 0; i < agid_spid_enter_button_xl.length; i++) {
agid_spid_enter_button_xl[i].innerHTML = '\
			<!-- AGID - SPID BUTTON EXTRALARGE * begin * -->\
			<button  class="agid-spid-enter agid-spid-enter-size-xl agid-spid-idp-list" onclick="showPanel(\'agid-spid-panel-select\')">\
				<span aria-hidden="true" class="agid-spid-enter-icon"><img aria-hidden="true" src="img/spid-ico-circle-bb.svg" onerror="this.src=\'img/spid-ico-circle-bb.png\'; this.onerror=null;" alt="Entra con SPID" /></span>\
				<span class="agid-spid-enter-text">Entra con SPID</span>\
			</button>\
			<!-- AGID - SPID BUTTON EXTRALARGE * end * -->		\
		';
}
}

function animate_element_in(e) {
    var element = document.getElementById(e);

    element.style.display = "block";
    element.classList.remove(e + "-anim-in");
    element.classList.remove(e + "-anim-out");
    element.classList.add(e + "-anim-in");
}

function animate_element_out(e) {
    var element = document.getElementById(e);

    element.classList.remove(e + "-anim-in");
    element.classList.remove(e + "-anim-out");
    element.classList.add(e + "-anim-out");
}

function showPanel(name) {
    var toshow,
        base,
        panel,
        buttons,
        hiddenattribute;

    shuffleIdp();

    toshow = document.getElementById(name);
    toshow.removeAttribute("hidden");
    toshow.style.display = "block";
    buttons = document.getElementsByClassName("agid-spid-enter-button");
    
    for (z = 0; z < buttons.length; z++) {
        buttons[z].style.display = "none";
        hiddenattribute = document.createAttribute("hidden");
        buttons[z].setAttributeNode(hiddenattribute);
    }

    // show animation panel
    animate_element_in("agid-spid-button-anim");
    animate_element_in("agid-spid-button-anim-base");
    animate_element_in("agid-spid-button-anim-icon");
    animate_element_in("agid-spid-panel-select");

    base  = document.getElementById("agid-spid-button-anim-base"),
    panel = document.getElementById("agid-spid-button-anim");

    base.addEventListener("animationstart", function() {
        panel.style.display = "block";
        base.style.display = "block";
    }, true);

    base.addEventListener("animationend", function() {
        panel.style.display = "block";
        base.style.display = "block";
    }, true);
}

function hidePanel(name) {
    var base,
        panel,
        tohide,
        hiddenattribute,
        buttons;

    tohide = document.getElementById(name);
    hiddenattribute = document.createAttribute("hidden");
    tohide.setAttributeNode(hiddenattribute);
    tohide.style.display = "none";
    buttons = document.getElementsByClassName("agid-spid-enter-button");

    for (z = 0; z < buttons.length; z++) {
        buttons[z].style.display = "block";
        buttons[z].removeAttribute("hidden");
    };
    // hide animation panel
    animate_element_out("agid-spid-button-anim");
    animate_element_out("agid-spid-button-anim-base");
    animate_element_out("agid-spid-button-anim-icon");
    animate_element_out("agid-spid-panel-select");

    base = document.getElementById("agid-spid-button-anim-base");
    panel = document.getElementById("agid-spid-button-anim");

    base.addEventListener("animationstart", function() {
        panel.style.display = "block";
        base.style.display = "block";
    }, true);

    base.addEventListener("animationend", function() {
        var newone;

        panel.style.display = "none";
        base.style.display = "none";

        newone = base.cloneNode(true);
        base.parentNode.replaceChild(newone, base);
    }, true);
}

function shuffleIdp() {
    var ul = document.querySelector('#agid-spid-idp-list');

    for (var i = ul.children.length; i >= 0; i--) {
        ul.appendChild(ul.children[Math.random() * i | 0]);
    }
}

function agid_spid_enter() {
        displaySPIDConfiguredProviders();

        insertButtonS();
        insertButtonM();
        insertButtonL();
        insertButtonXl();
        document.addEventListener('keyup', function(e) {
        if (e.keyCode == 27) {
        hidePanel('agid-spid-panel-select');
        }
        });
        };
        agid_spid_enter();
        
        function openmodal(text){
        console.log("Openmodal " + text);
                var modal = document.getElementById("infomodal");
                modal.innerHTML = '<div class=\"modal-content\"><span id="closemodalbutton" class="close" >&times;</span><p>' + text + '</p></div>'
                modal.style.display = "block";
                var span = document.getElementById("closemodalbutton");
                span.addEventListener("click", function(ev) { closemodal(); });
                console.log(span);
        };
        function closemodal() {
        console.log("Closingmodal ");
                var modal = document.getElementById("infomodal");
                modal.style.display = "none";
                modal.innerHTML = '';
        }
