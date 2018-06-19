/*
 * Modulo SPID smart button
 */
window.SPID = function () {
    "use strict";

    /** VARIABILI PRIVATE */

    /* eslint no-underscore-dangle: 0 */
    var self = this,
        _agidSpidEnterWrapper,
        _spidIdpList,
        _infoModal,
        _spidPanelSelect,
        _version = '{{ VERSION }}', // il placeholder '{{ VERSION }}' viene sostituito con la version del package dal task string-replace, non modificare!
        _language = 'it', // Lingua delle etichette sostituibile all'init, default Italiano
        _i18n = {}, // L'oggetto viene popolato dalla chiamata ajax getLocalisedMessages()
        _availableProviders,
        _defaultGetUrl = '/login?entityId={{entityID}}';

    /** VARIABILI PUBBLICHE */

    this.resources = {};
    this.templates = {};

    /** FUNZIONI PRIVATE */

    function getTemplate(templateName, content) {
        return self.templates[templateName].call(self, content);
    };

    function showElement(dom) {
        dom.removeAttribute('hidden');
    };

    function hideElement(dom) {
        var hiddenAttribute = document.createAttribute("hidden");
        dom.setAttributeNode(hiddenAttribute);
    }

    // a11y: porta il focus sull'elemento interattivo mostrato
    function giveFocusTo(element) {
        var focusElement = setInterval(function () {
            element.focus();
        }, 100);
        _spidPanelSelect.addEventListener('focus', function () {
            clearInterval(focusElement);
        });
    }

    function closeInfoModal() {
        hideElement(_infoModal);
        _infoModal.innerHTML = '';
        giveFocusTo(_spidPanelSelect);
    }

    function openInfoModal(htmlContent) {
        _infoModal.innerHTML = getTemplate('infoModalContent', htmlContent);
        showElement(_infoModal);
        // L'attributo aria-live assertive farà leggere il contenuto senza bisogno di focus
        // Viene distrutto e ricreato, non necessita unbind
        document.querySelector('#closemodalbutton').addEventListener('click', closeInfoModal);
    };

    // Randomizza l'ordine dei tasti dei provider prima di mostrarli
    function shuffleIdp() {
        // eslint-disable-next-line vars-on-top
        for (var i = _spidIdpList.children.length; i >= 0; i--) {
            _spidIdpList.appendChild(_spidIdpList.children[Math.random() * i | 0]);
        }
    }

    // Chiudi gli overlay in sequenza, prima info modal poi i providers
    function handleEscKeyEvent(event) {
        var isEscKeyHit = event.keyCode === 27,
            isInfoModalVisible = !_infoModal.hasAttribute('hidden');

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
        showElement(_agidSpidEnterWrapper);
        giveFocusTo(_spidPanelSelect);
        document.addEventListener('keyup', handleEscKeyEvent);
    }

    function hideProvidersPanel() {
        hideElement(_agidSpidEnterWrapper);
        document.removeEventListener('keyup', handleEscKeyEvent);
    }

    function renderAvailableProviders() {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '';

        _availableProviders.forEach(function (provider) {
            spidProvidersButtonsHTML += getTemplate('spidProviderButton', provider);
        });

        agid_spid_enter.innerHTML = getTemplate('spidProviderChoiceModal', spidProvidersButtonsHTML);

        // Vengono creati una sola volta all'init, non necessitano unbind
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#nospid').addEventListener('click', function () {
            openInfoModal(getTemplate('nonHaiSpid'));
        });
        document.querySelector('#cosaspid').addEventListener('click', function () {
            openInfoModal(getTemplate('cosaSpid'));
        });
    }

    /*
     * Helper function per gestire tramite promise il risultato asincrono di success/fail, come $.ajax
     */
    function ajaxRequest(method, url, payload) {
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
            xhr.send(JSON.stringify(payload));
        });
    }

    function getLocalisedMessages() {
        var languageRequest = {
            language: _language
        };

        return ajaxRequest('GET', self.resources.localisationEndpoint, languageRequest);
    }

    function getAvailableProviders() {
        return ajaxRequest('GET', self.resources.providersEndpoint);
    }

    function loadStylesheet(url) {
        var linkElement = document.createElement('link');

        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function addContainersWrapper(wrapperID) {
        _agidSpidEnterWrapper = document.createElement('section');

        _agidSpidEnterWrapper.id = wrapperID;
        hideElement(_agidSpidEnterWrapper);
        document.body.insertBefore(_agidSpidEnterWrapper, document.body.firstChild);
        _agidSpidEnterWrapper.innerHTML = getTemplate('spidMainContainers');
    }

    function getSelectors() {
        _spidIdpList = document.querySelector('#agid-spid-idp-list');
        _infoModal = document.querySelector('#agid-infomodal');
        _spidPanelSelect = document.querySelector('#agid-spid-panel-select');
    }

    function renderSpidModalContainers() {
        var agidSpidEnterWrapperId = 'agid-spid-enter-container',
            existentWrapper = document.getElementById(agidSpidEnterWrapperId);

        if (!existentWrapper) {
            loadStylesheet(self.resources.stylesheetUrl);
            addContainersWrapper(agidSpidEnterWrapperId);
        }
    }

    function renderModule() {
        renderSpidModalContainers();
        renderAvailableProviders();
        self.updateSpidButtons();
        getSelectors();
    }

    function mergeProvidersData(agidProvidersList, options) {
        var availableProviders = [];

        agidProvidersList.forEach(function (agidIdpConfig) {
            if (options && options.providers) {
                if (options.providers[agidIdpConfig.provider]) {
                    agidIdpConfig.url = options.providers[agidIdpConfig.provider].get || options.providers[agidIdpConfig.provider].post;
                    agidIdpConfig.method = options.providers[agidIdpConfig.provider].get ? 'GET' : 'POST';
                } else {
                    agidIdpConfig.url = options.providers.get || options.providers.post || _defaultGetUrl;
                    agidIdpConfig.method =  !options.providers.get ? (options.providers.post ? 'POST' : 'GET') : 'GET';
                }
            } else {
                agidIdpConfig.url = _defaultGetUrl;
                agidIdpConfig.method = 'GET';
            }
            availableProviders.push(agidIdpConfig);
        });

        _availableProviders = availableProviders;
    }

    function setOptions(options) {
        _language = options.language || _language;
        Object.assign(self.resources, options.resources || {});
    }

    /** FUNZIONI PUBBLICHE */

    this.getVersion = function () {
        return _version;
    };

    /**
     * @param {Object} options - opzionale, fare riferimento al readme per panoramica completa
     * @returns {Promise} La promise rappresenta lo stato della chiamata ajax per i dati
     */
    this.init = function (options) {
        var fetchData;

        self.initResources();
        options && setOptions(options);

        fetchData = [getLocalisedMessages(), getAvailableProviders()];

        return Promise.all(fetchData)
            .then(function (data) {
                self.initTemplates();

                _i18n = data[0];
                // mergeProvidersData(data[1].spidProviders, options && options.providersPayload);
                mergeProvidersData(data[1].spidProviders, options);
                renderModule();
            })
            .catch(function (error) {
                _availableProviders = undefined;
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    /**
     * @param {string} language - il locale da caricare, due caratteri eg 'it' | 'en'.
     * @returns {Promise} La promise rappresenta lo stato della chiamata ajax per le copy
     */
    this.changeLanguage = function (language) {
        setOptions({
            language: language
        });

        return getLocalisedMessages()
            .then(function (data) {
                _i18n = data;
                renderModule();
            })
            .catch(function (error) {
                console.error('Si è verificato un errore nel caricamento dei dati', error);
            });
    };

    this.updateSpidButtons = function () {
        var spidButtonsPlaceholdersObj = document.querySelectorAll('.agid-spid-enter-button'),
            spidButtonsPlaceholdersArray = Array.from(spidButtonsPlaceholdersObj),
            hasButtonsOnPage = spidButtonsPlaceholdersArray.length;

        if (!_availableProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        if (!hasButtonsOnPage) {
            console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
            return;
        };

        spidButtonsPlaceholdersArray.forEach(function (spidButton) {
            var foundDataSize = spidButton.getAttribute('data-size'),
                dataSize = foundDataSize.toLowerCase(),
                supportedSizes = ['s', 'm', 'l', 'xl'],
                isSupportedSize = supportedSizes.indexOf(dataSize) !== -1;

            if (isSupportedSize) {
                spidButton.innerHTML = getTemplate('spidButton', dataSize);
            } else {
                console.error('Le dimenioni supportate sono', supportedSizes, 'trovato invece:', foundDataSize, spidButton);
            }
        });
        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        Array.from(document.querySelectorAll('.agid-spid-enter')).forEach(function (spidButton) {
            spidButton.addEventListener('click', showProvidersPanel);
        });
    };

    this.setResources = function (resources) {
        self.resources = resources;
    };

    this.getResources = function () {
        // Cloniamo l'oggetto in modo che non sia modificabile dall'esterno
        return Object.assign({}, self.resources);
    };

    // Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
    this.getI18n = function (labelKey, placeholderValue) {
        var locale = _language,
            copy = _i18n.language &&
                _i18n.language[locale] &&
                _i18n.language[locale][labelKey],
            placeholder = /\{\d}/;

        if (placeholderValue) {
            copy = copy.replace(placeholder, placeholderValue);
        }

        // In caso di label mancante fornisci un feedback al dev
        if (!copy) {
            console.error('La chiave richiesta non è disponibile nel locale selezionato:', locale, labelKey);
        }

        return copy || labelKey;
    };

};
