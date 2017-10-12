// Modulo SPID
window.agidSpidEnter = (function () {
    var hasSpidProviders = false,
        infoModal,
        spidPanelSelect;

    function renderAvailableProviders(data) {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '';

        for (var provider in data.spidProviders) {
            var providerData = data.spidProviders[provider];

            if (!providerData.url) return;

            spidProvidersButtonsHTML += agidSpidEnterTpl.spidProviderButton(providerData);
        };

        agid_spid_enter.innerHTML = agidSpidEnterTpl.spidProviderChoiceModal(spidProvidersButtonsHTML);

        hasSpidProviders = true;

        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-spid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#nospid').addEventListener('click', function () {
            openInfoModal(agidSpidEnterTpl.nonHaiSpid());
        });
        document.querySelector('#cosaspid').addEventListener('click', function () {
            openInfoModal(agidSpidEnterTpl.cosaSpid());
        });
    }

    function renderSpidButtons() {
        if (!hasSpidProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        var agid_spid_enter_buttons = document.querySelectorAll('.agid-spid-enter-button');

        Array.from(agid_spid_enter_buttons).forEach(function (spidButton) {
            var foundDataSize   = spidButton.getAttribute('data-size'),
                dataSize        = foundDataSize.toLowerCase(),
                supportedSizes  = ['s', 'm', 'l', 'xl'],
                isSupportedSize = supportedSizes.indexOf(dataSize) !== -1;

            if (isSupportedSize) {
                spidButton.innerHTML = agidSpidEnterTpl.spidButton(dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });

        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach(function (spidButton) {
            spidButton.addEventListener('click', showProvidersPanel);
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
        var toshow  = spidPanelSelect,
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

        base.addEventListener('animationstart', function () {
            panel.style.display = 'block';
            base.style.display = 'block';
        }, true);

        base.addEventListener('animationend', function () {
            panel.style.display = 'block';
            base.style.display = 'block';
            // a11y: porta il focus sul pannello appena mostrato
            toshow.focus();        
        }, true);
    }

    function hideProvidersPanel(name) {
        var toHide          = spidPanelSelect,
            base            = document.querySelector('#agid-spid-button-anim-base'),
            panel           = document.querySelector('#agid-spid-button-anim'),
            buttons         = document.querySelector('.agid-spid-enter-button'),
            hiddenattribute = document.createAttribute('hidden');
            

        toHide.setAttributeNode(hiddenattribute);
        toHide.style.display = 'none';

        Array.from(buttons).forEach(function (button) {
            button.style.display = 'block';
            button.removeAttribute('hidden');
        });

        // hide animation panel
        animate_element_out('agid-spid-button-anim');
        animate_element_out('agid-spid-button-anim-base');
        animate_element_out('agid-spid-button-anim-icon');
        animate_element_out('agid-spid-panel-select');

        base.addEventListener('animationstart', function () {
            panel.style.display = 'block';
            base.style.display  = 'block';
        }, true);

        base.addEventListener('animationend', function () {
            var newone;

            panel.style.display = 'none';
            base.style.display  = 'none';

            newone = base.cloneNode(true);
            base.parentNode.replaceChild(newone, base);
        }, true);
    }

    // Randomizza l'ordine dei tasti dei provider prima di mostrarli
    function shuffleIdp() {
        var ul = document.querySelector('#agid-spid-idp-list');

        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }

    function openInfoModal(htmlContent){
        infoModal.innerHTML     = agidSpidEnterTpl.infoModal(htmlContent);
        infoModal.style.display = 'block';
        // a11y: porta il focus sulla finestra informa
        infoModal.focus();

        document.querySelector('#closemodalbutton').addEventListener('click', closeInfoModal);
    };

    function closeInfoModal() {
        infoModal.style.display = 'none';
        infoModal.innerHTML     = '';
        // a11y: Ritorna il focus al modale dei providers
        spidPanelSelect.focus();
    }

    function ajaxRequest(method, url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 && xhr.responseText) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            }.bind(this);
            xhr.send();
        });
    }

    function getAvailableProviders() {
        return ajaxRequest('GET', agidSpidEnterConfig.spidProvidersEndpoint)
            .then(renderAvailableProviders)
            .then(renderSpidButtons)
            .catch(function(e) {
                console.error('Si è verificato un errore nel caricamento dei provider SPID', e);
            });
    }

    function isElementVisible(element) {
        return element.style.display !== 'none';
    }

    function renderSpidModalContainer() {
        var agidSpidEnterWrapper = document.createElement('SECTION');

        agidSpidEnterWrapper.id  = 'agid-spid-enter-container';

        document.body.insertBefore(agidSpidEnterWrapper, document.body.firstChild);

        agidSpidEnterWrapper.innerHTML = agidSpidEnterTpl.spidMainContainers();
    }

    // Chiudi gli overlay in sequenza, prima info modal poi i providers
    function bindEscKeyEvent() {
        document.addEventListener('keyup', function(e) {
            var isEscKeyHit             = e.keyCode === 27,
                isInfoModalVisible      = isElementVisible(infoModal),
                isprovidersPanelVisible = isElementVisible(spidPanelSelect);

            if (isEscKeyHit) {
                if (isInfoModalVisible) {
                    closeInfoModal();
                } else if (isprovidersPanelVisible) {
                    hideProvidersPanel();
                }
            }
        });
    }

    function getSelectors() {
       infoModal       = document.querySelector('#agid-infomodal');
       spidPanelSelect = document.querySelector('#agid-spid-panel-select');
    }

    function init() {
        renderSpidModalContainer();
        getAvailableProviders()
            .then(getSelectors)
            .then(bindEscKeyEvent);
    };

    init();

    // Metodi pubblici
    return {
        updateSpidButtons: renderSpidButtons
    };
}());
