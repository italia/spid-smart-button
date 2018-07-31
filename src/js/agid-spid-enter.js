/*
 * Modulo SPID smart button
 */
var SPID;
SPID = (function (SPID) {

    "use strict";

    /* eslint no-underscore-dangle: 0 */

    /** VARIABILI PRIVATE */
    var self = this,
        _agidSpidEnterWrapper,
        _spidIdpList,
        _infoModal,
        _spidPanelSelect,
        _lang = 'it', // Lingua delle etichette sostituibile all'init, default Italiano
        _i18n = {}, // L'oggetto viene popolato dalla chiamata ajax getLocalisedMessages()
        _availableProviders,
        _selector = '#spid-button',
        _protocol = "SAML",
        _style = {
            size: "medium",
            colorScheme: "positive",
            fluid: false,
            cornerStyle: "rounded"
        },
        _SPID = SPID;

    /** FUNZIONI PRIVATE */

    SPID.prototype.getTemplate = function (templateName, content) {
        return this.templates[templateName].call(this, content);
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

    function openInfoModal(htmlContent, _spid) {
        _infoModal.innerHTML = _spid.getTemplate('infoModalContent', htmlContent);
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

    function renderAvailableProviders(_spid) {
        var agid_spid_enter = document.querySelector('#agid-spid-enter'),
            spidProvidersButtonsHTML = '';

        _availableProviders.forEach(function (provider) {
            spidProvidersButtonsHTML += _spid.getTemplate('spidProviderButton', provider);
        });

        agid_spid_enter.innerHTML = _spid.getTemplate('spidProviderChoiceModal', spidProvidersButtonsHTML);
        // Vengono creati una sola volta all'init, non necessitano unbind
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-cancel-access-button').addEventListener('click', hideProvidersPanel);
        document.querySelector('#agid-spid-panel-close-button').addEventListener('click', function () {
            var elem = document.getElementsByClassName("choosedButton")[0];
            elem.classList.remove("enterTransition");
            elem.classList.remove("choosedButton");
            elem.classList.add("reverseEnterTransition");
            setTimeout(function () {
                elem.classList.remove("reverseEnterTransition");
            }, 2000);
        });
        document.querySelector('#agid-cancel-access-button').addEventListener('click', function () {
            var elem = document.getElementsByClassName("choosedButton")[0];
            elem.classList.remove("enterTransition");
            elem.classList.remove("choosedButton");
            elem.classList.add("reverseEnterTransition");
            setTimeout(function () {
                elem.classList.remove("reverseEnterTransition");
            }, 2000);
        });
        document.querySelector('#nospid').addEventListener('click', function () {
            openInfoModal(_spid.getTemplate('nonHaiSpid', null), _spid);
        });
    }

    /*
     * Helper function per gestire tramite promise il risultato asincrono di success/fail, come $.ajax
     */
    function ajaxRequest(method, url, payload, done, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && xhr.responseText) {
                    done(null, JSON.parse(xhr.responseText), callback);
                } else {
                    done(xhr.responseText, null, callback);
                }
            }
        }.bind(this);
        xhr.send(JSON.stringify(payload));
    }

    function getLocalisedMessages(setMessages, _spid) {
        var languageRequest = {
            lang: _lang
        };
        ajaxRequest('GET', _spid.resources.localisationEndpoint, languageRequest, setMessages);
    }

    function getAvailableProviders(setProviders, _spid) {
        ajaxRequest('GET', _spid.resources.providersEndpoint, null, setProviders);
    }

    function loadStylesheet(url) {
        var linkElement = document.createElement('link');

        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    function addContainersWrapper(wrapperID, _spid) {
        _agidSpidEnterWrapper = document.createElement('section');

        _agidSpidEnterWrapper.id = wrapperID;
        hideElement(_agidSpidEnterWrapper);
        document.body.insertBefore(_agidSpidEnterWrapper, document.body.firstChild);
        _agidSpidEnterWrapper.innerHTML = _spid.getTemplate('spidMainContainers', null);
    }

    function getSelectors() {
        _spidIdpList = document.querySelector('#agid-spid-idp-list');
        _infoModal = document.querySelector('#agid-infomodal');
        _spidPanelSelect = document.querySelector('#agid-spid-panel-select');
    }

    function renderSpidModalContainers(_spid) {
        var agidSpidEnterWrapperId = 'agid-spid-enter-container',
            existentWrapper = document.getElementById(agidSpidEnterWrapperId);

        if (!existentWrapper) {
            loadStylesheet(_spid.resources.stylesheetUrl);
            addContainersWrapper(agidSpidEnterWrapperId, _spid);
        }
    }

    SPID.prototype.renderModule = function () {
        renderSpidModalContainers(this);
        renderAvailableProviders(this);
        this.updateSpidButtons();
        getSelectors();
    };

    function getMergedProvidersData(agidProvidersList, options) {
        var property, hasProtocol;
        return agidProvidersList.map(function (agidIdpConfig) {
            agidIdpConfig.url = options.url;
            agidIdpConfig.method = options.method || 'GET';
            if (agidIdpConfig.method === 'POST') {
                agidIdpConfig.fieldName = options.fieldName;
                agidIdpConfig.extraFields = options.extraFields;
            }

            for (property in options.mapping) {
                if (agidIdpConfig.entityID === property) {
                    agidIdpConfig.entityID = options.mapping[property];
                }
            }

            if (!agidIdpConfig.supported) {
                if (options.supported.indexOf(agidIdpConfig.entityID) === -1 || agidIdpConfig.protocols.indexOf(options.protocol) === -1) {
                    agidIdpConfig.supported = false;
                } else {
                    agidIdpConfig.supported = true;
                }
            } else if (agidIdpConfig.protocols.indexOf(options.protocol) === -1) {
                agidIdpConfig.supported = false;
            }

            return agidIdpConfig;
        });
    }

    function addExtraProviders(agidProvidersList, options) {
        var i;
        if (options.extraProviders) {
            for (i = 0; i < options.extraProviders.length; i++) {
                options.extraProviders[i].supported = true;
            }
            agidProvidersList = agidProvidersList.concat(options.extraProviders);
        }
        return agidProvidersList;
    }

    function checkStyleOptions(styleOptions) {
        var supportedSizes = ['small', 'medium', 'large'],
            supportedColorScheme = ["positive", "negative"],
            supportedCornerStyle = ["rounded", "sharp"],
            supportedFluid = [true, false];
        if (supportedSizes.indexOf(styleOptions.size.toLowerCase()) === -1) {
            return 'Le dimensioni supportate sono ' + supportedSizes + ' trovato invece:' + _style.size;
        } else if (supportedColorScheme.indexOf(styleOptions.colorScheme.toLowerCase()) === -1) {
            return 'I colori supportati sono ' + supportedColorScheme + ' trovati invece:' + _style.colorScheme;
        } else if (supportedCornerStyle.indexOf(styleOptions.cornerStyle.toLowerCase()) === -1) {
            return 'Il tipo di angoli supportati sono ' + supportedCornerStyle + ' trovati invece:' + _style.cornerStyle;
        } else if (supportedFluid.indexOf(styleOptions.fluid) === -1) {
            return 'I valori del parametro supportati sono ' + supportedFluid + ' trovati invece:' + _style.fluid;
        } else {
            return true;
        }
    }

    function checkMandatoryOptions(options) {
        if (!options || !options.url || !options.supported || options.supported.length < 1) {
            return false;
        } else {
            return true;
        }
    }

    function getMergedDefaultOptions(options) {
        options = options || {};
        options.lang = options.lang || _lang;
        options.selector = _selector = options.selector || _selector;
        options.protocol = options.protocol || _protocol;
        options.size = _style.size = options.size || _style.size;
        options.colorScheme = _style.colorScheme = options.colorScheme || _style.colorScheme;
        options.fluid = _style.fluid = options.fluid || _style.fluid;
        options.cornerStyle = _style.cornerStyle = options.cornerStyle || _style.cornerStyle;

        return options;
    }

    function manageError(err, errorCallback) {
        console.error('Si è verificato un errore nel caricamento dei dati', err);
        errorCallback && errorCallback();
    }

    /** FUNZIONI PUBBLICHE */

    /**
     * @param {Object} options - opzionale, fare riferimento al readme per panoramica completa
     * @param {function} success - callback opzionale per gestire il caso di successo
     * @param {function} error - callback opzionale per gestire il caso di errore
     */
    SPID.prototype._init = function (options, success, error, _spid) {
        var msg;
        if (!checkMandatoryOptions(options)) {
            console.error('Non sono stati forniti i parametri obbligatori della configurazione');
            error && error();
            return;
        }
        _spid.initResources();
        options = getMergedDefaultOptions(options);
        msg = checkStyleOptions(_style);
        if (msg !== true) {
            console.error(msg);
            error && error();
            return;
        }
        _lang = options.lang;

        getLocalisedMessages(function (err, data) {
            if (err) {
                manageError(err, error);
                return;
            }
            _spid.initTemplates();
            _i18n = data;
            getAvailableProviders(function (err, data) {
                if (err) {
                    manageError(err, error);
                    return;
                }
                _availableProviders = addExtraProviders(data.spidProviders, options);
                _availableProviders = getMergedProvidersData(_availableProviders, options);
                _spid.renderModule();
                success && success();
                return _spid;
            }, _spid);
        }, _spid);
    };

    /**
     * @param {string} lang - il locale da caricare, due caratteri eg 'it' | 'en' | 'de'.
     * @param {function} success - callback opzionale per gestire il caso di successo
     * @param {function} error - callback opzionale per gestire il caso di errore
     */
    function changeLanguage(lang, success, error) {
        _lang = lang;

        getLocalisedMessages(function (err, data) {
            if (err) {
                manageError(err, error);
                return;
            }
            _i18n = data;
            this.renderModule();
            success && success();
        });
    };

    SPID.prototype.updateSpidButtons = function () {
        var spidButtonsPlaceholders = document.querySelectorAll(_selector),
            hasButtonsOnPage = spidButtonsPlaceholders.length,
            i = 0, j = 0,
            btn,
            spidButtons;

        if (!_availableProviders) {
            console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
            return;
        };

        if (!hasButtonsOnPage) {
            console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
            return;
        };
        for (i; i < hasButtonsOnPage; i++) {
            spidButtonsPlaceholders[i].innerHTML = this.getTemplate('spidButton', _style);
            btn = spidButtonsPlaceholders[i].getElementsByClassName("agid-spid-enter");
            Array.prototype.forEach.call(btn, function (el) {
                el.addEventListener('click', function () {
                    var parent = el.parentElement;
                    parent.classList.add("enterTransition");
                    parent.classList.add("choosedButton");
                    setTimeout(function () {
                        parent.classList.remove("enterTransition");
                    }, 2000);
                });
            });
        }
        spidButtons = document.querySelectorAll('.agid-spid-enter');

        // Binda gli eventi dopo aver renderizzato i pulsanti SPID
        for (j; j < spidButtons.length; j++) {
            spidButtons[j].addEventListener('click', showProvidersPanel);
        }
    };

    SPID.prototype.setResources = function (resources) {
        this.resources = resources;
    };

    SPID.prototype.getResources = function () {
        // Cloniamo l'oggetto in modo che non sia modificabile dall'esterno
        return JSON.parse(JSON.stringify(this.resources));
    };

    // Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
    SPID.prototype.getI18n = function (labelKey, placeholderValue) {
        var locale = _lang,
            copy = _i18n.lang &&
                _i18n.lang[locale] &&
                _i18n.lang[locale][labelKey],
            placeholder = /\{\d}/;

        if (placeholderValue) {
            copy = copy.replace(placeholder, placeholderValue);
        }

        // In caso di label mancante fornisci un feedback al dev
        if (!copy) {
            console.error('La chiave richiesta non è disponibile nella lingua selezionata:', locale, labelKey);
        }

        return copy || labelKey;
    };

    return {
        init: function (config, success, error) {
            var _spid = new _SPID();
            return _spid._init(config, success, error, _spid);
        },
        changeLanguage: changeLanguage
    };
})(SPID || {});
