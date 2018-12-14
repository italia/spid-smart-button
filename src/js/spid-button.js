/*
 * Modulo SPID smart button
 */
var _SPID,
    SPID = (function (_SPID) {

        "use strict";

        var _spidButtonWrapper,
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
            showElement(_spidButtonWrapper);
            giveFocusTo(_spidPanelSelect);
            document.addEventListener('keyup', function (event) {
                _spid.handleEscKeyEvent(event);
            });
        };

        _SPID.prototype.hideProvidersPanel = function () {
            var _spid = this;
            hideElement(_spidButtonWrapper);
            document.addEventListener('keyup', function (event) {
                _spid.handleEscKeyEvent(event);
            });
        };

        function exitChoiceModalAnimations() {
            var elem = document.getElementsByClassName('choosedButton')[0];
            document.getElementsByClassName('spid-button-icon')[0].classList.remove('in');
            document.getElementsByClassName('spid-button-little-man-icon')[0].classList.add('spid-button-logo-animation-out');
            document.getElementById('spid-button-panel-select').classList.add('spid-button-panel-anim');
            elem.classList.remove('spid-button-transition');
            elem.classList.remove('choosedButton');
            elem.classList.add('spid-button-reverse-enter-transition');
            setTimeout(function () {
                elem.classList.remove('spid-button-reverse-enter-transition');
                //document.getElementsByClassName('agid-spid-enter-icon')[0].classList.remove('agid-spid-enter-icon-animation-out');
                document.getElementsByClassName('spid-button-little-man-icon')[0].classList.remove('spid-button-logo-animation-out');

            }, 2000);
        }

        _SPID.prototype.renderAvailableProviders = function () {
            var _spid = this,
                spid_button = document.querySelector('#spid-enter'),
                spidProvidersButtonsHTML = '';

            _spid._availableProviders.forEach(function (provider) {
                spidProvidersButtonsHTML += _spid.getTemplate('spidProviderButton', provider);
            });

            spid_button.innerHTML = _spid.getTemplate('spidProviderChoiceModal', spidProvidersButtonsHTML);
            // Vengono creati una sola volta all'init, non necessitano unbind
            document.querySelector('#spid-button-panel-close-button').addEventListener('click', function () {
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
            _spidButtonWrapper = document.createElement('section');

            _spidButtonWrapper.id = wrapperID;
            hideElement(_spidButtonWrapper);
            document.body.insertBefore(_spidButtonWrapper, document.body.firstChild);
            _spidButtonWrapper.innerHTML = this.getTemplate('spidMainContainers', null);
        };

        function getSelectors() {
            _spidIdpList = document.querySelector('#spid-idp-list');
            _spidPanelSelect = document.querySelector('#spid-button-panel-select');
        }

        _SPID.prototype.renderSpidModalContainers = function () {
            var spidButtonWrapperId = 'spid-enter-container',
                existentWrapper = document.getElementById(spidButtonWrapperId);

            if (!existentWrapper) {
                loadStylesheet(this.resources.stylesheetUrl);
                this.addContainersWrapper(spidButtonWrapperId);
            }
        };

        _SPID.prototype.renderModule = function () {
            this.renderSpidModalContainers();
            this.renderAvailableProviders();
            this.updateSpidButtons();
            getSelectors();
        };

        function getMergedProvidersData(spidButtonProvidersList, options) {
            var property;
            return spidButtonProvidersList.map(function (spidButtonIdpConfig) {
                spidButtonIdpConfig.url = options.url;
                spidButtonIdpConfig.method = options.method || 'GET';
                if (spidButtonIdpConfig.method === 'POST') {
                    spidButtonIdpConfig.fieldName = options.fieldName;
                    spidButtonIdpConfig.extraFields = options.extraFields;
                }

                for (property in options.mapping) {
                    if (spidButtonIdpConfig.entityID === property) {
                        spidButtonIdpConfig.entityID = options.mapping[property];
                    }
                }
                
                if (!('_supported' in spidButtonIdpConfig)) {
                    spidButtonIdpConfig._supported = options.supported.indexOf(spidButtonIdpConfig.entityID) > -1
                        && spidButtonIdpConfig.protocols.indexOf(options.protocol) > -1;
                }

                return spidButtonIdpConfig;
            });
        }

        function addExtraProviders(spidButtonProvidersList, options) {
            var i;
            if (options.extraProviders) {
                for (i = 0; i < options.extraProviders.length; i++) {
                    var provider = options.extraProviders[i];
                    provider._supported = true;

                    // set defaults
                    if (!('protocols' in provider)) provider.protocols = ["SAML"];

                }
                spidButtonProvidersList = spidButtonProvidersList.concat(options.extraProviders);
            }
            return spidButtonProvidersList;
        }

        function checkStyleOptions(styleOptions) {
            var supportedSizes = ['small', 'medium', 'large'],
                supportedColorScheme = ["positive", "negative"],
                supportedCornerStyle = ["rounded", "sharp"],
                supportedFluid = [true, false];
            if (supportedSizes.indexOf(styleOptions.size.toLowerCase()) === -1) {
                return 'Le dimensioni supportate sono ' + supportedSizes + ' trovato invece:' + styleOptions.size;
            } else if (supportedColorScheme.indexOf(styleOptions.colorScheme.toLowerCase()) === -1) {
                return 'I colori supportati sono ' + supportedColorScheme + ' trovati invece:' + styleOptions.colorScheme;
            } else if (supportedCornerStyle.indexOf(styleOptions.cornerStyle.toLowerCase()) === -1) {
                return 'Il tipo di angoli supportati sono ' + supportedCornerStyle + ' trovati invece:' + styleOptions.cornerStyle;
            } else if (supportedFluid.indexOf(styleOptions.fluid) === -1) {
                return 'I valori del parametro supportati sono ' + supportedFluid + ' trovati invece:' + styleOptions.fluid;
            } else {
                return true;
            }
        };

        function checkMandatoryOptions(options) {
            if (!options) {
                return 'Non sono stati forniti i parametri obbligatori della configurazione';
            } else if (!options.url) {
                return 'Non è stato fornito l\'url obbligatorio in configurazione';
            } else if (options.url.indexOf('{{idp}}') === -1) {
                return 'L\'url non contiene il placeholder {{idp}}';
            } else if (!options.supported || options.supported.length < 1) {
                return 'Non sono stati forniti gli IdP supportati nel parametro \'supported\'';
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
            var msgStyle, msgMandatory,
                _spid = this;
            msgMandatory = checkMandatoryOptions(options);
            if (msgMandatory !== true) {
                console.error(msgMandatory);
                return;
            }
            _spid.initResources();
            options = _spid.getMergedDefaultOptions(options);
            msgStyle = checkStyleOptions(_spid._style);
            if (msgStyle !== true) {
                console.error(msgStyle);
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
                spidButtons = document.querySelectorAll('.spid-button');
                Array.prototype.forEach.call(spidButtons, function (spidbtn) {
                    spidbtn.addEventListener('click', function () {
                        var parent = spidbtn.parentElement;
                        parent.classList.add("spid-button-transition");
                        parent.classList.add("choosedButton");
                        _spid.showProvidersPanel();

                        document.getElementById('spid-button-logo').classList.add('spid-button-fade-in-left');
                        document.getElementById('spid-button-close-button').classList.add('spid-button-fade-in-left');
                        document.getElementById('spid-button-panel-select').classList.add('spid-button-panel-anim');
                        document.getElementsByClassName('spid-button-icon')[0].classList.add('spid-button-icon-animation');
                        document.getElementsByClassName('spid-button-icon')[0].classList.add('in');
                        spidProvidersBtn = document.getElementsByClassName('spid-button-idp');
                        delaySeconds = 1.10;
                        for (j = 0; j < spidProvidersBtn.length; j++) {
                            spidProvidersBtn[j].classList.add('spid-button-idp-fade-in');
                            spidProvidersBtn[j].setAttribute('style', 'animation-delay: ' + delaySeconds + 's');
                            delaySeconds = delaySeconds + 0.10;
                        }
                        setTimeout(function () {
                            parent.classList.remove('spid-button-transition');
                            document.getElementById('spid-button-logo').classList.remove('spid-button-fade-in-left');
                            document.getElementById('spid-button-close-button').classList.remove('spid-button-fade-in-left');
                            document.getElementById('spid-button-panel-select').classList.remove('spid-button-panel-anim');
                            for (t = 0; t < spidProvidersBtn.length; t++) {
                                spidProvidersBtn[t].classList.remove('spid-button-idp-fade-in');
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
