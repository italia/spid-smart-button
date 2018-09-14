describe('SPID', function () {

    var SPID = window.SPID,
        axe = window.axe,
        agidSpidWrapperID = '#spid-enter-container',
        accediConSpid = 'Accedi a SPID con ',
        supportedProviders = [
            'https://loginspid.aruba.it',
            'https://identity.infocert.it',
            'https://posteid.poste.it',
            'sielte.it',
            'https://login.id.tim.it/affwebservices/public/saml2sso',
            'https://idp.namirialtsp.com/idp',
            'https://spid.register.it',
            'https://spid.intesa.it'
        ],
        genericConfig = {
            url: '/generic/url/{{idp}}',
            supported: supportedProviders
        };

    function injectSpidPlaceHolder(selector) {
        var _selector = 'spid-button';
        if (selector) {
            _selector = selector;
        }
        var spidButtonPlaceholder = document.createElement('div');
        spidButtonPlaceholder.innerHTML = '<div class="agid-spid-enter-button" id="' + _selector + '" aria-live="polite"></div>';
        document.body.appendChild(spidButtonPlaceholder);
    }

    function isElementVisible(elementID) {
        return !document.querySelector(elementID).hasAttribute('hidden');
    }

    function domCleanup() {
        var agidSpidWrapper = document.querySelectorAll('body > section'),
            spidPlaceholder = document.querySelectorAll('.agid-spid-enter-button');

        Array.from(agidSpidWrapper).forEach(function (agidWrapper) {
            agidWrapper.remove();
        });
        Array.from(spidPlaceholder).forEach(function (spidButton) {
            spidButton.parentElement.remove();
        });
    }

    function triggerKeyEvent(keyCode) {
        // Credit to Elger van Boxtel
        // https://elgervanboxtel.nl/site/blog/simulate-keydown-event-with-javascript
        var e = new Event("keyup");
        e.keyCode = keyCode;
        e.which = e.keyCode;
        e.altKey = false;
        e.ctrlKey = true;
        e.shiftKey = false;
        e.metaKey = false;
        e.bubbles = true;
        document.dispatchEvent(e);
    }

    describe('when script is included in the page', function () {
        it('should create a module instance in the global scope', function () {
            expect(SPID).toBeDefined();
        });
    });

    describe('when module instance is available', function () {
        beforeEach(function () {
            spyOn(console, 'log'); // silenzia log di aXe
            spyOn(console, 'warn');
            spyOn(console, 'error');
            domCleanup();
        });

        afterEach(function () {
            domCleanup();
        });

        describe('init method', function () {
            it('should inject the modal wrapper HTML needed to print the providers popup', function (done) {
                // GIVEN
                var agidSpidWrapper;
                // WHEN
                SPID.init(genericConfig);
                agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                // THEN
                expect(!!agidSpidWrapper).toBeTruthy();
                done();

            });

            it('should fetch italian language if no option was provided', function (done) {
                // WHEN
                SPID.init(genericConfig);
                // THEN
                var text = document.getElementById('spid-enter-title-page').innerHTML;
                expect(text).toEqual('Scegli il tuo provider SPID')
                done();
            });

            it('should NOT inject the modal wrapper HTML more than once if SPID are provided with the same selector', function (done) {
                // GIVEN
                var spid1 = SPID.init(genericConfig);
                var spid2 = SPID.init(genericConfig);
                var spid3 = SPID.init(genericConfig);
                var agidSpidWrapper;
                // WHEN
                agidSpidWrapper = document.querySelectorAll(agidSpidWrapperID);
                // THEN
                expect(agidSpidWrapper.length).toBe(1);
                done();
            });

            it('should warn the dev if no placeholder is found to render the smartbuttons', function (done) {
                // WHEN
                SPID.init(genericConfig);
                // THEN
                expect(console.warn).toHaveBeenCalled();
                done();
            });

            it('should warn the dev if no correct selector is found to render the smartbuttons', function (done) {
                // GIVEN
                var config = {
                    url: '/generic/url/{{idp}}',
                    selector: 'my-spid-button',
                    supported: supportedProviders
                };
                // WHEN
                SPID.init(config);
                // THEN
                expect(console.warn).toHaveBeenCalled();
                done();
            });

            it('should call the correct selector to render the smartbuttons', function (done) {
                // GIVEN
                var config = {
                    url: '/generic/url/{{idp}}',
                    selector: '#my-spid-button',
                    supported: supportedProviders
                };
                injectSpidPlaceHolder('my-spid-button');
                // WHEN
                SPID.init(config);
                // THEN
                var spidButtons = document.querySelectorAll(config.selector);
                expect(spidButtons.length).toEqual(1);
                done();
            });

            describe('when SPID button placeholder are present in the page', function () {
                it('should render the SPID button if supplied size is valid regardless of the case', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        size: "SMALL",
                        supported: supportedProviders
                    };
                    injectSpidPlaceHolder();
                    // WHEN
                    SPID.init(config);
                    var spidButtons = document.querySelectorAll('.agid-spid-enter');
                    // THEN
                    expect(spidButtons.length).toBeTruthy();
                    done();
                });

                it('should throw an error if supplied SPID button size is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        size: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should throw an error if supplied SPID button color scheme is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        colorScheme: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should throw an error if supplied SPID button style is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        fluid: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should throw an error if supplied SPID button corner style is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        cornerStyle: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });
            });

            describe('when supplied with a configuration object', function () {
                it('should not add to providers hidden inputs payload if is a GET', function (done) {
                    // WHEN
                    SPID.init(genericConfig);
                    var hiddenInputs = document.querySelectorAll('#spid-idp-list input');
                    // THEN
                    expect(hiddenInputs.length).toEqual(0);
                    done();
                });

                it('should request the provided language in the config', function (done) {
                    // GIVEN
                    var config = {
                        url: 'url{{idp}}',
                        lang: 'de',
                        supported: supportedProviders
                    };

                    // WHEN
                    SPID.init(config);
                    var title = document.getElementById('spid-enter-title-page').innerHTML;
                    expect(title).toEqual('Wähle Ihren SPIDProvider')
                    done();
                });

                it('should log error message if no config is provided', function (done) {
                    // WHEN
                    SPID.init(null);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should log error message if no url is provided in config', function (done) {
                    // WHEN
                    var config = {
                        supported: supportedProviders
                    };
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should log error message if it\'s not present {{idp}} placeholder in url', function (done) {
                    // WHEN
                    var config = {
                        url: 'url',
                        supported: supportedProviders
                    };
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should log error message if no supported providers are provided', function (done) {
                    // WHEN
                    var config = {
                        url: 'url{{idp}}'
                    };
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should log error message if is provided an empty array of supported providers', function (done) {
                    // WHEN
                    var config = {
                        url: 'url{{idp}}',
                        supported: []
                    };
                    SPID.init(config);
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });

                it('should change provider entityID if provided with mapping options', function (done) {
                    var config = {
                        method: 'POST',               // opzionale
                        url: '/Login{{idp}}',
                        fieldName: 'testName',
                        mapping: {
                            'https://posteid.poste.it': 'poste'
                        },
                        supported: supportedProviders
                    };
                    // WHEN

                    SPID.init(config);
                    var providers = document.querySelectorAll('#spid-idp-list form'),
                        hiddenInput;
                    for (var i = 0; i < providers.length; i++) {
                        if (providers[i][0].getAttribute('title') === accediConSpid + 'Poste ID') {
                            hiddenInput = providers[i][1];
                        }
                    }
                    // THEN
                    expect(hiddenInput.value).toEqual('poste');
                    done();

                });

                it('should enable provider button if that provider is supported and disable other providers', function (done) {
                    var config = {
                        url: '/Login{{idp}}',
                        supported: [
                            'https://posteid.poste.it'
                        ],
                    };
                    // WHEN
                    SPID.init(config);
                    var providers = document.querySelectorAll('#spid-idp-list a'),
                        disabled = document.querySelectorAll("#spid-idp-list a[disabled]");
                    // THEN
                    expect(disabled.length).toEqual(providers.length - 1);
                    //expect(enabled.length).toEqual(1);
                    done();
                });

                it('should add extra providers if specified in options and make them supported', function (done) {
                    var config = {
                        url: '/Login{{idp}}',
                        supported: supportedProviders,
                        extraProviders: [
                            {
                                "protocols": ["SAML"],
                                "entityName": "Ciccio ID",
                                "logo": "spid-idp-aruba.svg",
                                "entityID": "https://loginciccio.it",
                                "active": true
                            }
                        ]
                    };
                    // WHEN
                    SPID.init(config);
                    var disabled = document.querySelectorAll('#spid-idp-list a[disabled]'),
                        extraProvider = document.querySelectorAll('#spid-idp-list a[title="Accedi a SPID con Ciccio ID"]');
                    // THEN
                    expect(disabled.length).toEqual(0);
                    expect(extraProvider.length).toEqual(1);
                    done();
                });

                it('should disable all providers that don\'t support the kind of protocol in config', function (done) {
                    var config = {
                        url: '/Login',
                        supported: supportedProviders,
                        protocol: ["OIDC"]
                    };
                    // WHEN
                    SPID.init(config);
                    var providers = document.querySelectorAll('#spid-idp-list button'),
                        enabled = document.querySelectorAll("#spid-idp-list button:enabled"),
                        disabled = document.querySelectorAll("#spid-idp-list button:disabled");
                    // THEN
                    expect(enabled.length).toEqual(0);
                    expect(disabled.length).toEqual(providers.length);
                    done();
                });

                describe('when provided with a post method', function () {
                    it('should add to providers the hidden input payload with the correct name', function (done) {
                        // GIVEN
                        var config = {
                            method: 'POST',               // opzionale
                            url: '/Login',
                            fieldName: 'testName',
                            supported: supportedProviders
                        };
                        // WHEN
                        SPID.init(config);
                        var providers = document.querySelectorAll('#spid-idp-list button'),
                            hiddenInputs = document.querySelectorAll('#spid-idp-list input[name="testName"]');
                        // THEN
                        expect(hiddenInputs.length).toEqual(providers.length);
                        done();
                    });

                    it('should add to providers the hidden inputs payload defined in extrafields', function (done) {
                        // GIVEN
                        var config = {
                            method: 'POST',               // opzionale
                            url: '/Login',
                            fieldName: 'testName',
                            extraFields: {                // opzionale
                                foo: 'bar',
                                baz: 'baz'
                            },
                            supported: supportedProviders
                        };
                        // WHEN
                        SPID.init(config);
                        var providers = document.querySelectorAll('#spid-idp-list button'),
                            hiddenInputs = document.querySelectorAll('#spid-idp-list input[name="testName"]'),
                            fooInput = document.querySelectorAll('#spid-idp-list input[name="foo"]'),
                            bazInput = document.querySelectorAll('#spid-idp-list input[name="baz"]');
                        // THEN
                        expect(hiddenInputs.length).toEqual(providers.length);
                        expect(fooInput.length).toEqual(providers.length);
                        expect(bazInput.length).toEqual(providers.length);
                        done();
                    });

                });
            });
        });

        describe('changeLanguage method', function () {
            it('should call only the i18n endpoint for the new copy', function (done) {
                // GIVEN
                var spid = SPID.init(genericConfig);
                // WHEN
                spid.changeLanguage('en');
                // THEN
                var title = document.getElementById('spid-enter-title-page').innerHTML;
                expect(title).toEqual('Choose your SPID provider');
                done();
            });
        });

        describe('when a SPID button is clicked', function () {
            it('should display the provider choice modal', function (done) {
                // GIVEN
                var isChoiceModalVisible;

                injectSpidPlaceHolder();

                SPID.init(genericConfig);
                // WHEN
                document.querySelector('.agid-spid-enter-size-medium').click();
                isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                // THEN
                expect(isChoiceModalVisible).toBeTruthy();
                done();
            });

            it('should give focus to the displayed modal for accessibility', function (done) {
                // If this test fails in Chrome it may be due to focused developer tools:
                // https://stackoverflow.com/questions/23045172/focus-event-not-firing-via-javascript-in-chrome#answer-23045332

                // GIVEN
                injectSpidPlaceHolder();
                SPID.init(genericConfig);
                var choiceModal = document.querySelector('#agid-spid-panel-select');
                // WHEN
                document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                // THEN
                choiceModal.addEventListener('focus', function () {
                    expect(choiceModal).toBe(document.activeElement);
                    done();
                });
            });
        });

        describe('when the providers modal is displayed it should allow to close it by', function () {
            it('click on the top right X button', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                SPID.init(genericConfig);
                var isChoiceModalVisible;

                document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                // WHEN
                document.querySelector('#agid-spid-panel-close-button').click();
                isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                // THEN
                expect(isChoiceModalVisible).toBeFalsy();
                done();
            });

            it('click on the bottom list cancel button', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                SPID.init(genericConfig);
                var isChoiceModalVisible;

                document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                // WHEN
                document.querySelector('#spid-cancel-access-button').click();
                isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                // THEN
                expect(isChoiceModalVisible).toBeFalsy();
                done();
            });

            it('hit on the keyboard esc key', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                SPID.init(genericConfig);
                var isChoiceModalVisible;

                document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                // WHEN
                triggerKeyEvent(27);
                isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                // THEN
                expect(isChoiceModalVisible).toBeFalsy();
                done();
            });
        });

        // A11y accessibility testing
        describe('aXe accessibility check (A11y)', function () {
            it('should not find any violation in the module HTML', function (done) {
                // GIVEN
                var axeOptions = {
                    "rules": {
                        "color-contrast": { enabled: false },
                        "valid-lang": { enabled: false }
                    }
                },
                    agidSpidWrapper,
                    report;
                injectSpidPlaceHolder();
                // WHEN
                SPID.init(genericConfig);
                // Mostra il modale dei providers
                agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                agidSpidWrapper.removeAttribute('hidden');
                // THEN
                axe.run(agidSpidWrapper, axeOptions, function (error, result) {
                    if (result.violations.length) {
                        report = JSON.stringify(result.violations, null, 4);
                    }
                    // Logga il report in caso di errori passandolo come secondo argomento
                    expect(result.violations.length).toBe(0, report);
                    done();
                });
            });
        });
    });
});
