/*
 * Modulo SPID smart button
 */
var _SPID,
    SPID = (function (_SPID) {

        "use strict";

        var _agidSpidEnterWrapper,
            _spidIdpList,
            _spidPanelSelect,
            // questa funzione consente la gestione dell'esposizione verso l'esterno dei metodi pubblici
            // e permette inoltre di restituire un'istanza di _SPID tramite la funzione init()
            SPID = function (config) {
                this.internalSPID = new _SPID();
                this.internalSPID._init(config);

                /* FUNZIONI PUBBLICHE*/
                //in questo modo riesco a rendere pubblico questo metodo
                this.changeLanguage = function (lang) {
                    return this.internalSPID.changeLanguage(lang);
                };
                //aggiungere qui i metodi da rendere pubblici
            };

        _SPID.prototype.getTemplate = function (templateName, content) {
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

        // Chiudi gli overlay in sequenza, prima info modal poi i providers
        _SPID.prototype.handleEscKeyEvent = function (event) {
            var isEscKeyHit = event.keyCode === 27;

            if (isEscKeyHit) {
                // eslint-disable-next-line no-use-before-define
                this.hideProvidersPanel();
            }
        };

        _SPID.prototype.showProvidersPanel = function () {
            var _spid = this;
            showElement(_agidSpidEnterWrapper);
            giveFocusTo(_spidPanelSelect);
            document.addEventListener('keyup', function (event) {
                _spid.handleEscKeyEvent(event);
            });
        };

        _SPID.prototype.hideProvidersPanel = function () {
            var _spid = this;
            hideElement(_agidSpidEnterWrapper);
            document.addEventListener('keyup', function (event) {
                _spid.handleEscKeyEvent(event);
            });
        };

        function exitChoiceModalAnimations() {
            var elem = document.getElementsByClassName('choosedButton')[0];
            document.getElementsByClassName('agid-spid-enter-icon')[0].classList.remove('in');
            document.getElementsByClassName('agid-spid-little-man-icon')[0].classList.add('agid-spid-enter-logo-animation-out');
            document.getElementById('agid-spid-panel-select').classList.add('agid-spid-panel-anim');
            elem.classList.remove('agid-enter-transition');
            elem.classList.remove('choosedButton');
            elem.classList.add('agid-reverse-enter-transition');
            setTimeout(function () {
                elem.classList.remove('agid-reverse-enter-transition');
                //document.getElementsByClassName('agid-spid-enter-icon')[0].classList.remove('agid-spid-enter-icon-animation-out');
                document.getElementsByClassName('agid-spid-little-man-icon')[0].classList.remove('agid-spid-enter-logo-animation-out');

            }, 2000);
        }

        _SPID.prototype.renderAvailableProviders = function () {
            var _spid = this,
                agid_spid_enter = document.querySelector('#spid-enter'),
                spidProvidersButtonsHTML = '';

            _spid._availableProviders.forEach(function (provider) {
                spidProvidersButtonsHTML += _spid.getTemplate('spidProviderButton', provider);
            });

            agid_spid_enter.innerHTML = _spid.getTemplate('spidProviderChoiceModal', spidProvidersButtonsHTML);
            // Vengono creati una sola volta all'init, non necessitano unbind
            document.querySelector('#agid-spid-panel-close-button').addEventListener('click', function () {
                _spid.hideProvidersPanel();
                exitChoiceModalAnimations();
            });
            document.querySelector('#spid-cancel-access-button').addEventListener('click', function () {
                _spid.hideProvidersPanel();
                exitChoiceModalAnimations();
            });
        };

        function loadStylesheet(url) {
            var linkElement = document.createElement('link');

            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = url;
            document.head.appendChild(linkElement);
        }

        _SPID.prototype.addContainersWrapper = function (wrapperID) {
            _agidSpidEnterWrapper = document.createElement('section');

            _agidSpidEnterWrapper.id = wrapperID;
            hideElement(_agidSpidEnterWrapper);
            document.body.insertBefore(_agidSpidEnterWrapper, document.body.firstChild);
            _agidSpidEnterWrapper.innerHTML = this.getTemplate('spidMainContainers', null);
        };

        function getSelectors() {
            _spidIdpList = document.querySelector('#spid-idp-list');
            _spidPanelSelect = document.querySelector('#agid-spid-panel-select');
        }

        _SPID.prototype.renderSpidModalContainers = function () {
            var agidSpidEnterWrapperId = 'spid-enter-container',
                existentWrapper = document.getElementById(agidSpidEnterWrapperId);

            if (!existentWrapper) {
                loadStylesheet(this.resources.stylesheetUrl);
                this.addContainersWrapper(agidSpidEnterWrapperId);
            }
        };

        _SPID.prototype.renderModule = function () {
            this.renderSpidModalContainers();
            this.renderAvailableProviders();
            this.updateSpidButtons();
            getSelectors();
        };

        function getMergedProvidersData(agidProvidersList, options) {
            var property;
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

        _SPID.prototype.checkStyleOptions = function (styleOptions) {
            var supportedSizes = ['small', 'medium', 'large'],
                supportedColorScheme = ["positive", "negative"],
                supportedCornerStyle = ["rounded", "sharp"],
                supportedFluid = [true, false];
            if (supportedSizes.indexOf(styleOptions.size.toLowerCase()) === -1) {
                return 'Le dimensioni supportate sono ' + supportedSizes + ' trovato invece:' + this._style.size;
            } else if (supportedColorScheme.indexOf(styleOptions.colorScheme.toLowerCase()) === -1) {
                return 'I colori supportati sono ' + supportedColorScheme + ' trovati invece:' + this._style.colorScheme;
            } else if (supportedCornerStyle.indexOf(styleOptions.cornerStyle.toLowerCase()) === -1) {
                return 'Il tipo di angoli supportati sono ' + supportedCornerStyle + ' trovati invece:' + this._style.cornerStyle;
            } else if (supportedFluid.indexOf(styleOptions.fluid) === -1) {
                return 'I valori del parametro supportati sono ' + supportedFluid + ' trovati invece:' + this._style.fluid;
            } else {
                return true;
            }
        };

        function checkMandatoryOptions(options) {
            if (!options || !options.url || !options.supported || options.supported.length < 1) {
                return false;
            } else {
                return true;
            }
        }

        _SPID.prototype.getMergedDefaultOptions = function (options) {
            options = options || {};
            options.lang = this._lang = options.lang || this._lang;
            options.selector = this._selector = options.selector || this._selector;
            options.protocol = options.protocol || this._protocol;
            options.size = this._style.size = options.size || this._style.size;
            options.colorScheme = this._style.colorScheme = options.colorScheme || this._style.colorScheme;
            options.fluid = this._style.fluid = options.fluid || this._style.fluid;
            options.cornerStyle = this._style.cornerStyle = options.cornerStyle || this._style.cornerStyle;

            return options;
        };

        /**
         * @param {Object} options - opzionale, fare riferimento al readme per panoramica completa
         */
        _SPID.prototype._init = function (options) {
            var msg,
                _spid = this;
            if (!checkMandatoryOptions(options)) {
                console.error('Non sono stati forniti i parametri obbligatori della configurazione');
                return;
            }
            _spid.initResources();
            options = _spid.getMergedDefaultOptions(options);
            msg = _spid.checkStyleOptions(_spid._style);
            if (msg !== true) {
                console.error(msg);
                return;
            }
            _spid.initTemplates();

            _spid._availableProviders = addExtraProviders(_spid._availableProviders, options);
            _spid._availableProviders = getMergedProvidersData(_spid._availableProviders, options);
            _spid.renderModule();
        };

        /**
         * @param {string} lang - il locale da caricare, due caratteri eg 'it' | 'en' | 'de'.
         */
        _SPID.prototype.changeLanguage = function (lang) {
            var _spid = this;
            _spid._lang = lang;
            _spid.renderModule();
        };


        _SPID.prototype.updateSpidButtons = function () {
            var spidButtonsPlaceholders = document.querySelectorAll(this._selector),
                hasButtonsOnPage = spidButtonsPlaceholders.length,
                i = 0, j = 0, t = 0,
                spidButtons,
                spidProvidersBtn, delaySeconds,
                _spid = this;

            if (!this._availableProviders) {
                console.error('Si è verificato un errore nel caricamento dei providers, impossibile renderizzare i pulsanti SPID');
                return;
            };

            if (!hasButtonsOnPage) {
                console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID');
                return;
            };
            // Binda gli eventi dopo aver renderizzato i pulsanti SPID
            for (i; i < hasButtonsOnPage; i++) {
                spidButtonsPlaceholders[i].innerHTML = this.getTemplate('spidButton', this._style);
                spidButtons = document.querySelectorAll('.agid-spid-enter');
                Array.prototype.forEach.call(spidButtons, function (spidbtn) {
                    spidbtn.addEventListener('click', function () {
                        var parent = spidbtn.parentElement;
                        parent.classList.add("agid-enter-transition");
                        parent.classList.add("choosedButton");
                        _spid.showProvidersPanel();

                        document.getElementById('agid-logo').classList.add('agid-fade-in-left');
                        document.getElementById('agid-close-button').classList.add('agid-fade-in-left');
                        document.getElementById('agid-spid-panel-select').classList.add('agid-spid-panel-anim');
                        document.getElementsByClassName('agid-spid-enter-icon')[0].classList.add('agid-spid-enter-icon-animation');
                        document.getElementsByClassName('agid-spid-enter-icon')[0].classList.add('in');
                        spidProvidersBtn = document.getElementsByClassName('agid-spid-idp');
                        delaySeconds = 1.10;
                        for (j = 0; j < spidProvidersBtn.length; j++) {
                            spidProvidersBtn[j].classList.add('agid-spid-idp-fade-in');
                            spidProvidersBtn[j].setAttribute('style', 'animation-delay: ' + delaySeconds + 's');
                            delaySeconds = delaySeconds + 0.10;
                        }
                        setTimeout(function () {
                            parent.classList.remove('agid-enter-transition');
                            document.getElementById('agid-logo').classList.remove('agid-fade-in-left');
                            document.getElementById('agid-close-button').classList.remove('agid-fade-in-left');
                            document.getElementById('agid-spid-panel-select').classList.remove('agid-spid-panel-anim');
                            for (t = 0; t < spidProvidersBtn.length; t++) {
                                spidProvidersBtn[t].classList.remove('agid-spid-idp-fade-in');
                                spidProvidersBtn[t].removeAttribute('style');
                            }
                        }, 2000);
                    });
                });
            }
        };

        _SPID.prototype.setResources = function (resources) {
            this.resources = resources;
        };

        _SPID.prototype.getResources = function () {
            // Cloniamo l'oggetto in modo che non sia modificabile dall'esterno
            return JSON.parse(JSON.stringify(this.resources));
        };

        // Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
        _SPID.prototype.getI18n = function (labelKey, placeholderValue) {
            var locale = this._lang,
                copy = this._i18n.lang &&
                    this._i18n.lang[locale] &&
                    this._i18n.lang[locale][labelKey],
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

        return new function () {
            var instance;

            this.init = function (config, success, error) {
                instance = new SPID(config, success, error);
                return instance;
            };
        };

    })(_SPID || {});
