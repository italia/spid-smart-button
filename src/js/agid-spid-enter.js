/*
 * Modulo SPID smart button
 */
window.AgidSpidEnter = function () {
    var self = this,
        hasSpidProviders = false,
        infoModal,
        spidPanelSelect;

    function getTpl(templateName, content) {
        return self.tpl[templateName].call(self, content);
    }

    function showElement(dom) {
        dom.removeAttribute('hidden');
    }

    function hideElement(dom) {
        var hiddenAttribute = document.createAttribute("hidden");
        dom.setAttributeNode(hiddenAttribute);
    }

    function closeInfoModal() {
        hideElement(infoModal);
        infoModal.innerHTML = '';
        // a11y: Restituisci il focus al modale dei providers
        spidPanelSelect.focus();
    }

    function openInfoModal(htmlContent) {
        infoModal.innerHTML = getTpl('infoModal', htmlContent);
        showElement(infoModal);
        // a11y: porta il focus sulla finestra informa
        infoModal.focus();
        // Viene distrutto e ricreato, non necessita unbind
        document.querySelector('#closemodalbutton').addEventListener('click', closeInfoModal);
    };

    // Randomizza l'ordine dei tasti dei provider prima di mostrarli
    function shuffleIdp() {
        var ul = document.querySelector('#agid-spid-idp-list'),
            i;

        for (i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }

    function animate_element_in(elementId) {
        var element = document.getElementById(elementId);

        showElement(element);
        element.classList.remove(elementId + '-anim-in');
        element.classList.remove(elementId + '-anim-out');
        element.classList.add(elementId + '-anim-in');
    }

    function animate_element_out(elementId) {
        var element = document.getElementById(elementId);

        element.classList.remove(elementId + '-anim-in');
        element.classList.remove(elementId + '-anim-out');
        element.classList.add(elementId + '-anim-out');
    }

    function isElementVisible(element) {
        return !element.hasAttribute('hidden') || element.style.display !== "" && element.style.display !== "none";
    }

    // Chiudi gli overlay in sequenza, prima info modal poi i providers
    function handleEscKeyEvent(event) {
        var isEscKeyHit             = event.keyCode === 27,
            isInfoModalVisible      = isElementVisible(infoModal),
            isProvidersPanelVisible = isElementVisible(spidPanelSelect);

        if (isEscKeyHit) {
            if (isInfoModalVisible) {
                closeInfoModal();
            } else if (isProvidersPanelVisible) {
                // eslint-disable-next-line no-use-before-define
                hideProvidersPanel();
            }
        }
    }

    function showProvidersPanel() {
        shuffleIdp();
        showElement(spidPanelSelect);
        // Mostra modale providers con animazione splash-in
        animate_element_in('agid-spid-button-anim');
        animate_element_in('agid-spid-button-anim-base');
        animate_element_in('agid-spid-button-anim-icon');
        animate_element_in('agid-spid-panel-select');

        document.addEventListener('keyup', handleEscKeyEvent);
    }

    function hideProvidersPanel() {
        hideElement(spidPanelSelect);
        // Nascondi modale providers con animazione splash-out
        animate_element_out('agid-spid-button-anim');
        animate_element_out('agid-spid-button-anim-base');
        animate_element_out('agid-spid-button-anim-icon');
        animate_element_out('agid-spid-panel-select');

        document.removeEventListener('keyup', handleEscKeyEvent);
    }

    function renderAvailableProviders(data) {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '',
            provider,
            providerData;

        for (provider in data.spidProviders) {
            providerData = data.spidProviders[provider];

            if (!providerData.url) {
                return;
            }

            spidProvidersButtonsHTML += getTpl('spidProviderButton', providerData);
        };

        agid_spid_enter.innerHTML = getTpl('spidProviderChoiceModal', spidProvidersButtonsHTML);

        hasSpidProviders = true;
        // Vengono creati una sola volta all'init, non necessitano unbind
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-spid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#nospid').addEventListener('click', function () {
            openInfoModal(getTpl('nonHaiSpid'));
        });
        document.querySelector('#cosaspid').addEventListener('click', function () {
            openInfoModal(getTpl('cosaSpid'));
        });
    }

    function getSpidButtonsPlaceholders() {
        var spidButtonsPlaceholdersObj   = document.querySelectorAll('.agid-spid-enter-button'),
            spidButtonsPlaceholdersArray = Array.from(spidButtonsPlaceholdersObj);

        return spidButtonsPlaceholdersArray;
    }

    function renderSpidButtons() {
        var spidButtonsPlaceholders = getSpidButtonsPlaceholders(),
            hasButtonsOnPage        = spidButtonsPlaceholders.length;

        if (!hasSpidProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        if (!hasButtonsOnPage) {
            console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
            return;
        };

        spidButtonsPlaceholders.forEach(function (spidButton) {
            var foundDataSize   = spidButton.getAttribute('data-size'),
                dataSize        = foundDataSize.toLowerCase(),
                supportedSizes  = ['s', 'm', 'l', 'xl'],
                isSupportedSize = supportedSizes.indexOf(dataSize) !== -1;

            if (isSupportedSize) {
                spidButton.innerHTML = getTpl('spidButton', dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });
        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach(function (spidButton) {
            spidButton.addEventListener('click', showProvidersPanel);
        });
    }

    /*
     * Helper function per gestire tramite promise il risultato asincrono di success/fail
     */
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

    function getLocalisedMessages() {
        return ajaxRequest('GET', self.config.localisationEndpoint);
    }

    function getAvailableProviders() {
        return ajaxRequest('GET', self.config.providersEndpoint);
    }

    function addStylesheet(url) {
        var linkElement  = document.createElement('link');

        linkElement.rel  = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function addContainersWrapper(wrapperID) {
        var agidSpidEnterWrapper = document.createElement('section');

        agidSpidEnterWrapper.id  = wrapperID;
        document.body.insertBefore(agidSpidEnterWrapper, document.body.firstChild);
        agidSpidEnterWrapper.innerHTML = getTpl('spidMainContainers');
    }

    function getSelectors() {
        infoModal       = document.querySelector('#agid-infomodal');
        spidPanelSelect = document.querySelector('#agid-spid-panel-select');
    }

    function renderSpidModalContainers() {
        var agidSpidEnterWrapperId = 'agid-spid-enter-container',
            existentWrapper        = document.getElementById(agidSpidEnterWrapperId),
            agidSpidEnterWrapper;

        if (!existentWrapper) {
            addStylesheet(self.config.stylesheetUrl);
            addContainersWrapper(agidSpidEnterWrapperId);
        }
    }

    function init() {
        var fetchData = [getLocalisedMessages(), getAvailableProviders()];

        return Promise.all(fetchData)
            .then(function (data) {
                self.i18n = data[0];
                renderSpidModalContainers();
                renderAvailableProviders(data[1]);
                renderSpidButtons();
                getSelectors();

                document.querySelector('#agid-spid-button-anim')
                    .addEventListener('animationend', function () {
                        // a11y: porta il focus sul pannello appena mostrato
                        spidPanelSelect.focus();
                    }, true);
            })
            .catch(function (error) {
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    /*
     * Metodi Pubblici
     */
    return {
        init: init,
        updateSpidButtons: renderSpidButtons
    };
};
