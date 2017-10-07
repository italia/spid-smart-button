function displaySPIDConfiguredProviders() {
    var agid_spid_enter = document.getElementById('agid-spid-enter'),
        spidProvidersButtonsHTML = '';

    for (var provider in config) {
        var providerData = config[provider];

        if (!providerData.url) return;

        spidProvidersButtonsHTML += spidTpl.spidProviderButton(providerData);
    };

    agid_spid_enter.innerHTML = spidTpl.spidProviderChoiceModal(spidProvidersButtonsHTML);

    document.getElementById('agid-spid-panel-close-button').addEventListener('click', function() { hidePanel('agid-spid-panel-select') });
    document.getElementById('agid-spid-cancel-access-button').addEventListener('click', function() { hidePanel('agid-spid-panel-select') });
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
    var tohide          = document.getElementById(name),
        base            = document.getElementById('agid-spid-button-anim-base'),
        panel           = document.getElementById('agid-spid-button-anim'),
        hiddenattribute = document.createAttribute('hidden'),
        buttons         = document.getElementsByClassName('agid-spid-enter-button');

    tohide.setAttributeNode(hiddenattribute);
    tohide.style.display = 'none';

    Array.from(buttons).forEach(function (button) {
        button.style.display = 'block';
        button.removeAttribute('hidden');
    });

    // hide animation panel
    animate_element_out('agid-spid-button-anim');
    animate_element_out('agid-spid-button-anim-base');
    animate_element_out('agid-spid-button-anim-icon');
    animate_element_out('agid-spid-panel-select');

    base.addEventListener('animationstart', function() {
        panel.style.display = 'block';
        base.style.display  = 'block';
    }, true);

    base.addEventListener('animationend', function() {
        var newone;

        panel.style.display = 'none';
        base.style.display  = 'none';

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

    // Binda gli eventi dopo aver renderizzato i pulsanti SPID
    Array.from(document.getElementsByClassName('agid-spid-enter')).forEach(function (spidButton) {
        spidButton.addEventListener('click', function() {
            showPanel('agid-spid-panel-select')
        });
    });

    document.addEventListener('keyup', function(e) {
        if (e.keyCode == 27) {
            hidePanel('agid-spid-panel-select');
        }
    });
};

agid_spid_enter();
        
function openModal(text){
    var modal = document.getElementById('infomodal');

    modal.innerHTML     = spidTpl.modalCloseButton(text);
    modal.style.display = 'block';

    document.getElementById('closemodalbutton').addEventListener('click', function() { closeModal(); });
};

function closeModal() {
    var modal = document.getElementById('infomodal');

    modal.style.display = 'none';
    modal.innerHTML     = '';
}
