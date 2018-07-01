/*
 * Modulo SPID smart button
 */
window.AgidSpidEnter = function () {
    "use strict";

    const self = this;
    let agidSpidEnterWrapper;
    let spidIdpList;
    let infoModal;
    let spidPanelSelect;

    self.availableProviders = null;

    function getTpl(templateName, content) {
        return self.tpl[templateName].call(self, content);
    }

    function showElement(dom) {
        dom.removeAttribute('hidden');
    }

    function hideElement(dom) {
        const hiddenAttribute = document.createAttribute("hidden");
        dom.setAttributeNode(hiddenAttribute);
    }

    // a11y: porta il focus sull'elemento interattivo mostrato
    function giveFocusTo(element) {
        const focusElement = setInterval(() => element.focus(), 100);
        spidPanelSelect.addEventListener('focus', () => clearInterval(focusElement));
    }

    function closeInfoModal() {
        hideElement(infoModal);
        infoModal.innerHTML = '';
        giveFocusTo(spidPanelSelect);
    }

    function openInfoModal(htmlContent) {
        infoModal.innerHTML = getTpl('infoModalContent', htmlContent);
        showElement(infoModal);
        // L'attributo aria-live assertive farà leggere il contenuto senza bisogno di focus
        // Viene distrutto e ricreato, non necessita unbind
        document.querySelector('#closemodalbutton').addEventListener('click', closeInfoModal);
    };

    // Randomizza l'ordine dei tasti dei provider prima di mostrarli
    function shuffleIdp() {
        // eslint-disable-next-line vars-on-top
        for (let i = spidIdpList.children.length; i >= 0; i--) {
            spidIdpList.appendChild(spidIdpList.children[Math.random() * i | 0]);
        }
    }

    // Chiudi gli overlay in sequenza, prima info modal poi i providers
    function handleEscKeyEvent(event) {
        const isEscKeyHit = event.keyCode === 27;
        const isInfoModalVisible = !infoModal.hasAttribute('hidden');

        if (isEscKeyHit) {
            if (isInfoModalVisible) {
                closeInfoModal();
            } else {
                // eslint-disable-next-line no-use-before-define
                hideProvidersPanel();
            }
        }
    }

    function showProvidersPanel() {
        shuffleIdp();
        showElement(agidSpidEnterWrapper);
        giveFocusTo(spidPanelSelect);
        document.addEventListener('keyup', handleEscKeyEvent);
    }

    function hideProvidersPanel() {
        hideElement(agidSpidEnterWrapper);
        document.removeEventListener('keyup', handleEscKeyEvent);
    }

    function renderAvailableProviders() {
        const agid_spid_enter = document.querySelector('#agid-spid-enter');
        let spidProvidersButtonsHTML = '';

        self.availableProviders.forEach((provider) => {
            spidProvidersButtonsHTML += getTpl('spidProviderButton', provider);
        });

        agid_spid_enter.innerHTML = getTpl('spidProviderChoiceModal', spidProvidersButtonsHTML);

        // Vengono creati una sola volta all'init, non necessitano unbind
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#nospid').addEventListener('click', () => openInfoModal(getTpl('nonHaiSpid')));
        document.querySelector('#cosaspid').addEventListener('click', () => openInfoModal(getTpl('cosaSpid')));
    }

    function renderSpidButtons() {
        const spidButtonsPlaceholdersObj = document.querySelectorAll('.agid-spid-enter-button');
        const spidButtonsPlaceholdersArray = Array.from(spidButtonsPlaceholdersObj);
        const hasButtonsOnPage = spidButtonsPlaceholdersArray.length;

        if (!self.availableProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        if (!hasButtonsOnPage) {
            console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
            return;
        };

        spidButtonsPlaceholdersArray.forEach((spidButton) => {
            const foundDataSize   = spidButton.getAttribute('data-size');
            const dataSize        = foundDataSize.toLowerCase();
            const supportedSizes  = ['s', 'm', 'l', 'xl'];
            const isSupportedSize = supportedSizes.indexOf(dataSize) !== -1;

            if (isSupportedSize) {
                spidButton.innerHTML = getTpl('spidButton', dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });
        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach((spidButton) => {
            spidButton.addEventListener('click', showProvidersPanel);
        });
    }

    /*
     * Helper function per gestire tramite promise il risultato asincrono di success/fail, come $.ajax
     */
    function ajaxRequest(method, url, payload) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 && xhr.responseText) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(payload));
        });
    }

    function getLocalisedMessages() {
        const languageRequest = {
            language: self.language
        };

        return ajaxRequest('GET', self.config.localisationEndpoint, languageRequest);
    }

    function getAvailableProviders() {
        return ajaxRequest('GET', self.config.providersEndpoint);
    }

    function loadStylesheet(url) {
        const linkElement  = document.createElement('link');

        linkElement.rel  = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function addContainersWrapper(wrapperID) {
        agidSpidEnterWrapper = document.createElement('section');

        agidSpidEnterWrapper.id  = wrapperID;
        hideElement(agidSpidEnterWrapper);
        document.body.insertBefore(agidSpidEnterWrapper, document.body.firstChild);
        agidSpidEnterWrapper.innerHTML = getTpl('spidMainContainers');
    }

    function getSelectors() {
        spidIdpList      = document.querySelector('#agid-spid-idp-list');
        infoModal        = document.querySelector('#agid-infomodal');
        spidPanelSelect  = document.querySelector('#agid-spid-panel-select');
    }

    function renderSpidModalContainers() {
        const agidSpidEnterWrapperId = 'agid-spid-enter-container';
        const existentWrapper = document.getElementById(agidSpidEnterWrapperId);

        if (!existentWrapper) {
            loadStylesheet(self.config.stylesheetUrl);
            addContainersWrapper(agidSpidEnterWrapperId);
        }
    }

    function renderModule() {
        renderSpidModalContainers();
        renderAvailableProviders();
        renderSpidButtons();
        getSelectors();
    }

    function mergeProvidersData(agidProvidersList, providersPayload) {
        let availableProviders = [];

        agidProvidersList.forEach((agidIdpConfig) => {
            if (agidIdpConfig.isActive) {
                if (providersPayload) {
                    agidIdpConfig.payload = Object.assign({}, providersPayload.common, providersPayload[agidIdpConfig.provider]);
                } else {
                    agidIdpConfig.payload = {};
                }
            }
            availableProviders.push(agidIdpConfig);
        });

        self.availableProviders = availableProviders;
    }

    function setOptions(options) {
        self.language         = options.language || self.language;
        self.formActionUrl    = options.formActionUrl || self.formActionUrl;
        self.formSubmitMethod = options.formSubmitMethod || self.formSubmitMethod;
    }

    /**
     * @param {string} language - il locale da caricare, due caratteri eg 'it' | 'en'.
     * @returns {Promise} La promise rappresenta lo stato della chiamata ajax per le copy
     */
    function changeLanguage(language) {
        setOptions({
            language: language
        });

        return getLocalisedMessages()
            .then((data) => {
                self.i18n = data;
                renderModule();
            })
            .catch((error) => {
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    /**
     * @param {Object} options - opzionale, fare riferimento al readme per panoramica completa
     * @returns {Promise} La promise rappresenta lo stato della chiamata ajax per i dati
     */
    function init(options) {
        let fetchData;

        if (options) {
            setOptions(options);
        }

        fetchData = [getLocalisedMessages(), getAvailableProviders()];

        return Promise.all(fetchData)
            .then((data) => {
                self.i18n = data[0];
                mergeProvidersData(data[1].spidProviders, options && options.providersPayload);
                renderModule();
            })
            .catch((error) => {
                self.availableProviders = null;
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    function version() {
        return self.config.version;
    }

    /*
     * Metodi Pubblici
     */
    return {
        init,
        changeLanguage,
        updateSpidButtons: renderSpidButtons,
        version
    };
};
