// Modulo SPID
window.agidSpidEnter = (function () {
    function renderConfiguredProviders() {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '';

        for (var provider in config) {
            var providerData = config[provider];

            if (!providerData.url) return;

            spidProvidersButtonsHTML += agidSpidEnterTpl.spidProviderButton(providerData);
        };

        agid_spid_enter.innerHTML = agidSpidEnterTpl.spidProviderChoiceModal(spidProvidersButtonsHTML);

        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', function() { hideProvidersPanel() });
        document.querySelector('#agid-spid-cancel-access-button').addEventListener('click', function() { hideProvidersPanel(); });
        document.querySelector('#nospid').addEventListener('click', function() { openInfoModal('Non hai SPID?'); });
        document.querySelector('#cosaspid').addEventListener('click', function() { openInfoModal('Cos\'è SPID?'); });
    }

    function renderSpidButtons() {
        var agid_spid_enter_buttons = document.querySelectorAll('.agid-spid-enter-button');

        Array.from(agid_spid_enter_buttons).forEach(function (spidButton) {
            var foundDataSize   = spidButton.getAttribute('data-size'),
                dataSize        = foundDataSize.toLowerCase(),
                supportedSizes  = ['s', 'm', 'l', 'xl'],
                isSupportedSize = supportedSizes.indexOf(dataSize) != -1;

            if (isSupportedSize) {
                spidButton.innerHTML = agidSpidEnterTpl.spidButton(dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });

        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach(function (spidButton) {
            spidButton.addEventListener('click', function() {
                showProvidersPanel();
            });
        });
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

    function showProvidersPanel() {
        var toshow  = document.querySelector('#agid-spid-panel-select'),
            base    = document.querySelector('#agid-spid-button-anim-base'),
            panel   = document.querySelector('#agid-spid-button-anim'),
            buttons = document.querySelector('.agid-spid-enter-button'),
            hiddenattribute;

        shuffleIdp();

        toshow.removeAttribute('hidden');
        toshow.style.display = 'block';
        
        Array.from(buttons).forEach(function (button) {
            hiddenattribute = document.createAttribute('hidden');
            button.style.display = 'none';
            button.setAttributeNode(hiddenattribute);
        });

        // show animation panel
        animate_element_in('agid-spid-button-anim');
        animate_element_in('agid-spid-button-anim-base');
        animate_element_in('agid-spid-button-anim-icon');
        animate_element_in('agid-spid-panel-select');

        base.addEventListener('animationstart', function() {
            panel.style.display = 'block';
            base.style.display = 'block';
        }, true);

        base.addEventListener('animationend', function() {
            panel.style.display = 'block';
            base.style.display = 'block';
        }, true);
    }

    function hideProvidersPanel(name) {
        var tohide          = document.querySelector('#agid-spid-panel-select'),
            base            = document.querySelector('#agid-spid-button-anim-base'),
            panel           = document.querySelector('#agid-spid-button-anim'),
            buttons         = document.querySelector('.agid-spid-enter-button'),
            hiddenattribute = document.createAttribute('hidden');
            

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

    function renderSpidModalContainer() {
        var agidSpidEnterWrapper = document.createElement('SECTION');

        agidSpidEnterWrapper.id  = 'agid-spid-enter-container';

        document.body.insertBefore(agidSpidEnterWrapper, document.body.firstChild);

        agidSpidEnterWrapper.innerHTML = agidSpidEnterTpl.spidMainContainers();
    }

    function openInfoModal(text){
        var modal = document.querySelector('#infomodal');

        modal.innerHTML     = agidSpidEnterTpl.modalCloseButton(text);
        modal.style.display = 'block';

        document.querySelector('#closemodalbutton').addEventListener('click', function() { closeInfoModal() });
    };

    function closeInfoModal() {
        var modal = document.querySelector('#infomodal');

        modal.style.display = 'none';
        modal.innerHTML     = '';
    }

    function init() {
        renderSpidModalContainer();
        renderConfiguredProviders();
        renderSpidButtons();

        // Chiudi pannelo con ESC key
        document.addEventListener('keyup', function(e) {
            if (e.keyCode == 27) {
                hideProvidersPanel();
            }
        });
    };

    init();

    // Metodi pubblici
    return {
        updateSpidButtons: renderSpidButtons
    }
}());
