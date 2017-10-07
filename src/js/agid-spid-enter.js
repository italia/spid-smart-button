function displaySPIDConfiguredProviders() {
    var agid_spid_enter = document.getElementById('agid-spid-enter'),
        spidProvidersButtonsHTML = '',
        spidProviderChoiceModalWithButtonsHTML;

    // Cicla l'oggetto config e aggiunge i pulsanti dei provider disponibili
    for (var provider in config) {
        var providerData = config[provider];

        if (!providerData.url) return;

        spidProvidersButtonsHTML += spidTpl.spidProviderButton(providerData);
    };

    spidProviderChoiceModalWithButtonsHTML = spidTpl.spidProviderChoiceModal(spidProvidersButtonsHTML);

    // Renderizza il modale con i provider di SPID
    agid_spid_enter.innerHTML = spidProviderChoiceModalWithButtonsHTML;

    document.getElementById('nospid').addEventListener('click', function(ev) { openModal('Non hai SPID?'); });
    document.getElementById('cosaspid').addEventListener('click', function(ev) { openModal('Cos\'è SPID?'); });
}

function renderSPIDbuttons(sizeClass, sizeComment) {
    var agid_spid_enter_button = document.getElementsByClassName('agid-spid-enter-button-size-' + sizeClass);

    for (var i = 0; i < agid_spid_enter_button.length; i++) {
        agid_spid_enter_button[i].innerHTML = spidTpl.spidButton(sizeClass, sizeComment);
    }

}

function insertButtonS() {
    renderSPIDbuttons('s', 'SMALL');
}

function insertButtonM() {
    renderSPIDbuttons('m', 'MEDIUM');
}

function insertButtonL() {
    renderSPIDbuttons('l', 'LARGE');
}

function insertButtonXl() {
    renderSPIDbuttons('xl', 'EXTRALARGE');
}

function animate_element_in(e) {
    var element = document.getElementById(e);

    element.style.display = 'block';
    element.classList.remove(e + '-anim-in');
    element.classList.remove(e + '-anim-out');
    element.classList.add(e + '-anim-in');
}

function animate_element_out(e) {
    var element = document.getElementById(e);

    element.classList.remove(e + '-anim-in');
    element.classList.remove(e + '-anim-out');
    element.classList.add(e + '-anim-out');
}

function showPanel(name) {
    var toshow,
        base,
        panel,
        buttons,
        hiddenattribute;

    shuffleIdp();

    toshow = document.getElementById(name);
    toshow.removeAttribute('hidden');
    toshow.style.display = 'block';
    buttons = document.getElementsByClassName('agid-spid-enter-button');
    
    for (z = 0; z < buttons.length; z++) {
        buttons[z].style.display = 'none';
        hiddenattribute = document.createAttribute('hidden');
        buttons[z].setAttributeNode(hiddenattribute);
    }

    // show animation panel
    animate_element_in('agid-spid-button-anim');
    animate_element_in('agid-spid-button-anim-base');
    animate_element_in('agid-spid-button-anim-icon');
    animate_element_in('agid-spid-panel-select');

    base  = document.getElementById('agid-spid-button-anim-base'),
    panel = document.getElementById('agid-spid-button-anim');

    base.addEventListener('animationstart', function() {
        panel.style.display = 'block';
        base.style.display = 'block';
    }, true);

    base.addEventListener('animationend', function() {
        panel.style.display = 'block';
        base.style.display = 'block';
    }, true);
}

function hidePanel(name) {
    var base,
        panel,
        tohide,
        hiddenattribute,
        buttons;

    tohide = document.getElementById(name);
    hiddenattribute = document.createAttribute('hidden');
    tohide.setAttributeNode(hiddenattribute);
    tohide.style.display = 'none';
    buttons = document.getElementsByClassName('agid-spid-enter-button');

    for (z = 0; z < buttons.length; z++) {
        buttons[z].style.display = 'block';
        buttons[z].removeAttribute('hidden');
    };
    // hide animation panel
    animate_element_out('agid-spid-button-anim');
    animate_element_out('agid-spid-button-anim-base');
    animate_element_out('agid-spid-button-anim-icon');
    animate_element_out('agid-spid-panel-select');

    base = document.getElementById('agid-spid-button-anim-base');
    panel = document.getElementById('agid-spid-button-anim');

    base.addEventListener('animationstart', function() {
        panel.style.display = 'block';
        base.style.display = 'block';
    }, true);

    base.addEventListener('animationend', function() {
        var newone;

        panel.style.display = 'none';
        base.style.display = 'none';

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
        
function openModal(text){
    var modal = document.getElementById('infomodal');

    modal.innerHTML = spidTpl.modalCloseButton(text);

    modal.style.display = 'block';

    var span = document.getElementById('closemodalbutton');

    span.addEventListener('click', function(ev) { closeModal(); });
};

function closeModal() {
    var modal = document.getElementById('infomodal');

    modal.style.display = 'none';
    modal.innerHTML = '';
}
