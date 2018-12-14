/*
 * SPID Smart Button
 */
var SPID = (function () {
        "use strict";

        /* UTILITY FUNCTIONS */

        var loadStylesheet = function(url) {
            var linkElement = document.createElement('link');

            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = url;
            document.head.appendChild(linkElement);
        };

        var imageTag = function(imagePath, altText) {
            return [
                '<img aria-hidden="true"',
                    'src="', SPID.assetsBaseUrl, imagePath, '.svg"',
                    'alt="', altText, '" style="float:left" />'
            ].join('');
        };
    
        var hiddenField = function (name, value) {
            return ['<input type="hidden" name="', name, '" value="', value, '" />'].join('');
        };

        /* SPID BUTTON CLASS */

        // class for objects returned by SPID.init()
        var spidObj = function (config, providers) {
            this.config = config;
            this._providers = providers;
        };

        /* PUBLIC METHODS */

        /**
         * @param {string} lang - il locale da caricare, due caratteri eg 'it' | 'en' | 'de'.
         */
        spidObj.prototype.changeLanguage = function (lang) {
            var _spid = this;
            _spid.config.lang = lang;
            _spid._render();
        };

        /* PRIVATE METHODS */

        spidObj.prototype._showElement = function (dom) {
            dom.removeAttribute('hidden');
        };

        spidObj.prototype._hideElement = function(dom) {
            var hiddenAttribute = document.createAttribute("hidden");
            dom.setAttributeNode(hiddenAttribute);
        }

        // a11y: porta il focus sull'elemento interattivo mostrato
        spidObj.prototype._giveFocusTo = function(element) {
            var spid = this;
            var focusElement = setInterval(function () {
                element.focus();
            }, 100);
            spid._spidPanelSelect.addEventListener('focus', function () {
                clearInterval(focusElement);
            });
        }

        // Chiudi gli overlay in sequenza, prima info modal poi i providers
        spidObj.prototype._handleEscKeyEvent = function (event) {
            var spid = this;

            if (event.keyCode === 27) {  // ESC key
                spid._hideProvidersPanel();
            }
        };

        var EscKeyHandler;
        spidObj.prototype._showProvidersPanel = function () {
            var spid = this;
            spid._showElement(spid._spidButtonWrapper);
            spid._giveFocusTo(spid._spidPanelSelect);
            EscKeyHandler = function (event) {
                spid._handleEscKeyEvent(event);
            };
            document.addEventListener('keyup', EscKeyHandler);
        };

        spidObj.prototype._hideProvidersPanel = function () {
            var spid = this;
            spid._hideElement(spid._spidButtonWrapper);
            spid._exitChoiceModalAnimations();

            // unbind Esc key listener
            document.removeEventListener('keyup', EscKeyHandler);
            EscKeyHandler = null;
        };

        spidObj.prototype._exitChoiceModalAnimations = function() {
            // TODO: limit this to our markup or namespace
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

        spidObj.prototype._render = function () {
            var spid = this;

            // render modal containers
            var wrapperId = 'spid-enter-container';

            // if wrapper does not exist, create it
            if (!document.getElementById(wrapperId)) {
                loadStylesheet(SPID.stylesheetUrl);

                // add containers wrapper
                spid._spidButtonWrapper = document.createElement('section');
                spid._spidButtonWrapper.id = wrapperId;
                spid._hideElement(spid._spidButtonWrapper);
                document.body.insertBefore(spid._spidButtonWrapper, document.body.firstChild);
                spid._spidButtonWrapper.innerHTML = '<div id="spid-enter"></div>';
            }

            // render providers
            var modal = document.querySelector('#spid-enter');
            modal.innerHTML = spid._renderProvidersChoiceModal();
            
            // Vengono creati una sola volta all'init e non necessitano unbind
            document.querySelector('#spid-button-panel-close-button').addEventListener('click', function () {
                spid._hideProvidersPanel();
            });
            document.querySelector('#spid-cancel-access-button').addEventListener('click', function () {
                spid._hideProvidersPanel();
            });

            // update buttons
            var spidButtonsPlaceholders = document.querySelectorAll(spid.config.selector);
            if (spidButtonsPlaceholders.length == 0) {
                console.warn('Nessun placeholder HTML trovato nella pagina per i pulsanti SPID.');
                return;
            };

            // Binda gli eventi dopo aver renderizzato i pulsanti SPID
            for (var i = 0; i < spidButtonsPlaceholders.length; i++) {
                spidButtonsPlaceholders[i].innerHTML = spid._renderButton();
                var spidButtons = document.querySelectorAll('.spid-button');
                spidButtons.forEach(function (spidbtn) {
                    spidbtn.addEventListener('click', function () {
                        var parent = spidbtn.parentElement;
                        parent.classList.add("spid-button-transition");
                        parent.classList.add("choosedButton");
                        spid._showProvidersPanel();

                        document.getElementById('spid-button-logo').classList.add('spid-button-fade-in-left');
                        document.getElementById('spid-button-close-button').classList.add('spid-button-fade-in-left');
                        document.getElementById('spid-button-panel-select').classList.add('spid-button-panel-anim');
                        document.getElementsByClassName('spid-button-icon')[0].classList.add('spid-button-icon-animation');
                        document.getElementsByClassName('spid-button-icon')[0].classList.add('in');
                        var spidProvidersBtn = document.getElementsByClassName('spid-button-idp');
                        var delaySeconds = 1.10;
                        for (var j = 0; j < spidProvidersBtn.length; j++) {
                            spidProvidersBtn[j].classList.add('spid-button-idp-fade-in');
                            spidProvidersBtn[j].setAttribute('style', 'animation-delay: ' + delaySeconds + 's');
                            delaySeconds = delaySeconds + 0.10;
                        }
                        setTimeout(function () {
                            parent.classList.remove('spid-button-transition');
                            document.getElementById('spid-button-logo').classList.remove('spid-button-fade-in-left');
                            document.getElementById('spid-button-close-button').classList.remove('spid-button-fade-in-left');
                            document.getElementById('spid-button-panel-select').classList.remove('spid-button-panel-anim');
                            for (var t = 0; t < spidProvidersBtn.length; t++) {
                                spidProvidersBtn[t].classList.remove('spid-button-idp-fade-in');
                                spidProvidersBtn[t].removeAttribute('style');
                            }
                        }, 2000);
                    });
                });
            }
            
            spid._spidPanelSelect = document.querySelector('#spid-button-panel-select');
        };

        // Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
        spidObj.prototype._getI18n = function (labelKey, placeholderValue) {
            var lang = this.config.lang,
                copy = SPID.i18n[lang] && SPID.i18n[lang][labelKey],
                placeholderRegex = /\{\d}/;

            if (placeholderValue !== undefined) {
                copy = copy.replace(placeholderRegex, placeholderValue);
            }

            // In caso di label mancante fornisci un feedback al dev
            if (!copy) {
                console.error('La chiave richiesta non è disponibile nella lingua selezionata:', locale, labelKey);
            }

            return copy || labelKey;
        };

        spidObj.prototype._renderProvidersChoiceModal = function() {
            var spid = this;

            var imgPath = 'img/spid-logo-animation-black.svg';

            var providerButtons = '';
            spid._providers.forEach(function (idp) {
                providerButtons += spid._renderProviderButton(idp);
            });

            return [
                '<section id="spid-button-panel-select" class="spid-button-panel" aria-labelledby="spid-enter-title-page" tabindex="0">',
                    '<header class="spid-button-header">',
                        '<div class="spid-button-panel-back spid-button-panel-element">',
                            '<div id="spid-button-logo" class="spid-button-display-logo spid-button-fade-out-left">',
                            imageTag('img/spid-logo', spid._getI18n('alt_logo_SPID')),
                            '</div>',
                            '<div id="spid-button-close-button" class="spid-button-display-close spid-button-fade-out-right">',
                                '<button tabindex="0" id="spid-button-panel-close-button" class="spid-button-navigable" aria-labelledby="spid-cancel-access-button">',
                                imageTag('img/close', spid._getI18n('naviga_indietro')),
                                '</button>',
                            '</div>',
                        '</div>',
                    '</header>',

                    '<div id="spid-button-panel-content">',
                        '<img class="spid-button-little-man-icon" src="', SPID.assetsBaseUrl, imgPath,'" alt="',spid._getI18n('entra_con_SPID'),'" class="spid-button-littleMan-icon"></img>',
                        '<div class="spid-button-panel-content-center">',
                            '<h1 id="spid-enter-title-page" class="spid-button-fade-in-bottom spid-button-fade-out-bottom">', spid._getI18n('scegli_provider_SPID'),'</h1>',
                            '<div id="spid-idp-list">',
                                providerButtons,
                            '</div>',
                            '<div id="spid-non-hai-spid">',
                                '<span class="spid-button-non-hai-spid-font">', spid._getI18n("non_hai_SPID"),'</span>',
                                '<span id="spid-nonhai-spid" class="spid-button-link spid-button-non-hai-spid-font">' , spid._getI18n("scopri_di_piu"),'</span>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div id="spid-foot-btn" class="spid-button-circular-shadow">',
                        '<button id="spid-cancel-access-button" class="spid-button-font">',
                            '<span>', spid._getI18n('annulla_accesso'), '</span>',
                        '</button>',
                    '</div>',
                '</section>'
            ].join('');
        };

        spidObj.prototype._renderProviderButton = function (idp) {
            var spid = this;

            var isSupported = spid.config.supported.indexOf(idp.entityID) > -1
                && idp.protocols.indexOf(spid.config.protocol) > -1;

            var linkTitle = idp.active
                ? spid._getI18n('accedi_con_idp', idp.entityName)
                : spid._getI18n('idp_disabled');
            
            // apply mapping if any
            var entityID = (idp.entityID in spid.config.mapping)
                ? spid.config.mapping[idp.entityID]
                : idp.entityID;
                idp.entityID;

            var actionURL = spid.config.url.replace('{{idp}}', encodeURIComponent(entityID));

            if (spid.config.method === 'POST') {
                var inputs = hiddenField(spid.config.fieldName, entityID);
                for (var inputName in spid.config.extraFields) {
                    inputs += hiddenField(inputName, spid.config.extraFields[inputName]);
                }
                return [
                    '<span class="spid-button-idp">',
                        '<form action="', actionURL, '" method="POST">',
                            '<button type="submit"',
                                'class="spid-button-idp-button"',
                                'title="', linkTitle, '"',
                                isSupported ? '' : 'disabled', '>',
                                '<img src="', SPID.assetsBaseUrl, 'img/idp-logos/', idp.logo, '" alt="', idp.entityName, '">',
                            '</button>',
                            inputs,
                        '</form>',
                    '</span>'
                    ].join('');
            } else if (spid.config.method === 'GET') {
                return [
                    '<span class="spid-button-idp">',
                        '<a title="', linkTitle, '" href="', actionURL,'"',
                            (isSupported ? '' : 'disabled'),'>',
                            '<img src="', SPID.assetsBaseUrl, 'img/idp-logos/', idp.logo, '" alt="', idp.entityName, '">',
                        '</a>',
                    '</span>'
                ].join('');
            }
        };

        spidObj.prototype._renderButton = function () {
            var spid = this;

            var fluid = spid.config.fluid ? " spid-button-fluid " : "";
            var imgPath = spid.config.colorScheme == 'negative' ? 'img/spid-ico-circle-lb.svg' : 'img/spid-ico-circle-bb.svg';
            return [
                '<div id="spid-enter-button-container">',
                    '<button class="spid-button spid-button-font spid-button-', spid.config.colorScheme, ' spid-button-', spid.config.cornerStyle, ' spid-button-size-', spid.config.size, fluid,'" hidden>',
                        '<span aria-hidden="true" class="spid-button-icon">',
                            '<img src="', SPID.assetsBaseUrl, imgPath,'" alt="', spid._getI18n('entra_con_SPID'),'" />',
                        '</span>',
                        '<span class="spid-button-text">', spid._getI18n('entra_con_SPID'), '</span>',
                    '</button>',
                '</div>',
            ].join('');
        };

        /* SPID.init() FACTORY METHOD */

        var defaults = {
            lang:           'it',
            method:         'GET',
            fieldName:      'idp',
            extraFields:    {},
            selector:       '#spid-button',
            mapping:        {},
            extraProviders: [],
            protocol:       'SAML',
            size:           'medium',
            colorScheme:    'positive',
            fluid:          false,
            cornerStyle:    'rounded'
        };

        var supportedSizes = ['small', 'medium', 'large'],
            supportedColorScheme = ["positive", "negative"],
            supportedCornerStyle = ["rounded", "sharp"],
            supportedFluid = [true, false];

        return {
            init: function (config) {
                // validate
                var error;
                if (typeof config !== 'object' || config === null) {
                    error = 'Non è stata fornita la configurazione';
                } else {
                    // apply defaults
                    for (var key in defaults)
                        if (!(key in config))
                            config[key] = defaults[key];
                    
                    // more validation
                    if (!config.url) {
                        error = 'Non è stato fornito l\'url obbligatorio in configurazione';
                    } else if (config.method == 'GET' && config.url.indexOf('{{idp}}') === -1) {
                        error = 'L\'url non contiene il placeholder {{idp}}';
                    } else if (!config.supported || config.supported.length < 1) {
                        error = 'Non sono stati forniti gli IdP supportati nel parametro \'supported\'';
                    } else if (supportedSizes.indexOf(config.size) === -1) {
                        error = 'Le dimensioni supportate sono ' + supportedSizes + '; valore non valido:' + config.size;
                    } else if (supportedColorScheme.indexOf(config.colorScheme) === -1) {
                        error = 'I colori supportati sono ' + supportedColorScheme + '; valore non valido:' + config.colorScheme;
                    } else if (supportedCornerStyle.indexOf(config.cornerStyle) === -1) {
                        error = 'Il valori supportati per il parametro cornerStyle sono ' + supportedCornerStyle + '; valore non valido:' + config.cornerStyle;
                    } else if (supportedFluid.indexOf(config.fluid) === -1) {
                        error = 'I valori supportati per il parametro fluid sono ' + supportedFluid + '; valore non valido:' + config.fluid;
                    }
                }
                if (error) {
                    console.error(error);
                    return;
                }
                
                // clone providers
                var providers = JSON.parse(JSON.stringify(SPID.providers));

                // add extra providers  
                config.extraProviders.forEach(function (idp) {
                    // set defaults
                    if (!('protocols' in idp)) idp.protocols = ["SAML"];

                    providers.push(idp);
                    config.supported.push(idp.entityID);
                });
                
                var spid = new spidObj(config, providers);
                spid._render();
                return spid;
            }
        };
    })();
