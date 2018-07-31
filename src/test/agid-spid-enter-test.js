describe('SPID', function () {
    var SPID = window.SPID,
        axe = window.axe,
        agidSpidWrapperID = '#agid-spid-enter-container',
        agidInfoModalID = '#agid-infomodal',
        agidModalButtonID = '#nospid',
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
        },
        ajaxFail = {
            providersEndpoint: '/src/data/spidProviders-fail.json',
            localisationEndpoint: '/src/data/spidI18n-fail.json'
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
            //SUT = window.SPID.init(genericConfig, resolve);
            spyOn(console, 'log'); // silenzia log di aXe
            spyOn(console, 'warn');
            spyOn(console, 'error');
            domCleanup();
        });

        afterEach(function () {
            domCleanup();
            //SPID = null;
        });

        describe('init method', function () {
            it('should inject the modal wrapper HTML needed to print the providers popup', function (done) {
                // GIVEN
                var agidSpidWrapper;
                // WHEN
                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                    // THEN
                    expect(!!agidSpidWrapper).toBeTruthy();
                    done();
                })

            });

            it('should fetch italian language if no option was provided, and not provide payload for the providers call', function (done) {
                // GIVEN
                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                // WHEN
                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    // THEN
                    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
                    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"lang":"it"}');
                    done();
                });
            });

            it('should NOT inject the modal wrapper HTML more than once', function (done) {
                // GIVEN
                var p1 = new Promise(function (resolve) { SPID.init(genericConfig, resolve) });
                var p2 = new Promise(function (resolve) { SPID.init(genericConfig, resolve) });
                var p3 = new Promise(function (resolve) { SPID.init(genericConfig, resolve) });
                var initCalls = [p1, p2, p3],
                    agidSpidWrapper;
                // WHEN
                Promise.all(initCalls).then(function () {
                    agidSpidWrapper = document.querySelectorAll(agidSpidWrapperID);
                    // THEN
                    expect(agidSpidWrapper.length).toBe(1);
                    done();
                });
            });

            it('should warn the dev if no placeholder is found to render the smartbuttons', function (done) {
                // WHEN
                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    // THEN
                    expect(console.warn).toHaveBeenCalled();
                    done();
                });
            });

            it('should warn the dev if no correct selector is found to render the smartbuttons', function (done) {
                // GIVEN
                var config = {
                    url: '/generic/url/{{idp}}',
                    selector: 'my-spid-button',
                    supported: supportedProviders
                };
                // WHEN
                new Promise(function (resolve) {
                    SPID.init(config, resolve);
                }).then(function () {
                    // THEN
                    expect(console.warn).toHaveBeenCalled();
                    done();
                });
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
                new Promise(function (resolve) {
                    SPID.init(config, resolve);
                }).then(function () {
                    // THEN
                    var spidButtons = document.querySelectorAll(config.selector);
                    expect(spidButtons.length).toEqual(1);
                    done();
                });
            });

            //describe('on failure', function () {
                // it('should log failure when ajax calls do not all  data', function (done) {
                //     // GIVEN
                //     spyOn(SPID, "initResources").and.callFake(function () {
                //         SPID.setResources(ajaxFail);
                //     });
                //     // WHEN
                //     new Promise(function (resolve, reject) {
                //         SPID.init(genericConfig, resolve, reject);
                //     }).catch(function () {
                //         // THEN
                //         expect(console.error).toHaveBeenCalled();
                //         done();
                //     });
                // });

                // it('should NOT inject the modal wrapper HTML at all', function (done) {
                //     // GIVEN
                //     spyOn(SUT, "initResources").and.callFake(function () {
                //         SUT.setResources(ajaxFail);
                //     });
                //     // WHEN
                //     new Promise(function (resolve, reject) {
                //         SUT.init(genericConfig, resolve, reject);
                //     }).catch(function () {
                //         var agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                //         // THEN
                //         expect(!!agidSpidWrapper).toBeFalsy();
                //         done();
                //     });
                // });

            //});

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
                    new Promise(function (resolve) {
                        SPID.init(config, resolve);
                    }).then(function () {
                        var spidButtons = document.querySelectorAll('.agid-spid-enter');
                        // THEN
                        expect(spidButtons.length).toBeTruthy();
                        done();
                    });
                });

                it('should throw an error if supplied SPID button size is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        size: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should throw an error if supplied SPID button color scheme is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        colorScheme: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should throw an error if supplied SPID button style is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        fluid: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should throw an error if supplied SPID button corner style is invalid', function (done) {
                    // GIVEN
                    var config = {
                        url: '/generic/url/{{idp}}',
                        cornerStyle: "extra",
                        supported: supportedProviders
                    };
                    // WHEN
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when supplied with a configuration object', function () {
                it('should not add to providers hidden inputs payload if is a GET', function (done) {
                    // WHEN
                    new Promise(function (resolve) {
                        SPID.init(genericConfig, resolve);
                    }).then(function () {
                        var hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input');
                        // THEN
                        expect(hiddenInputs.length).toEqual(0);
                        done();
                    });
                });

                // it('should request the provided language in the config', function (done) {
                //     // GIVEN
                //     var config = {
                //         url: 'url',
                //         lang: 'de',
                //         supported: supportedProviders
                //     };

                //     spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                //     spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                //     // WHEN
                //     new Promise(function (resolve) {
                //         SPID.init(config, resolve);
                //     }).then(function () {
                //         // THEN
                //         expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
                //         expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"lang":"de"}');
                //         done();
                //     });
                // });

                it('should log error message if no config is provided', function (done) {
                    // WHEN
                    new Promise(function (resolve, reject) {
                        SPID.init(null, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should log error message if no url is provided in config', function (done) {
                    // WHEN
                    var config = {
                        supported: supportedProviders
                    }
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should log error message if no supported providers are provided', function (done) {
                    // WHEN
                    var config = {
                        url: 'url'
                    }
                    new Promise(function (resolve, reject) {
                        SPID.init(config, resolve, reject);
                    }).catch(function () {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should change provider entityID if provided with mapping options', function (done) {
                    var config = {
                        method: 'POST',               // opzionale
                        url: '/Login',
                        fieldName: 'testName',
                        mapping: {
                            'https://posteid.poste.it': 'poste'
                        },
                        supported: supportedProviders
                    };
                    // WHEN
                    new Promise(function (resolve) {
                        SPID.init(config, resolve);
                    }).then(function () {
                        var hiddenInput = document.querySelectorAll('#agid-spid-provider-Poste-ID input[name="testName"]');
                        // THEN
                        expect(hiddenInput[0].value).toEqual('poste');
                        done();
                    });
                });

                it('should enable provider button if that provider is supported and disable other providers', function (done) {
                    var config = {
                        url: '/Login',
                        supported: [
                            'https://posteid.poste.it'
                        ],
                    };
                    // WHEN
                    new Promise(function (resolve) {
                        SPID.init(config, resolve);
                    }).then(function () {
                        var providers = document.querySelectorAll('#agid-spid-idp-list a'),
                            disabled = document.querySelectorAll("#agid-spid-idp-list a[disabled]");
                        // THEN
                        expect(disabled.length).toEqual(providers.length - 1);
                        //expect(enabled.length).toEqual(1);
                        done();
                    });
                });

                it('should add extra providers if specified in options and make them supported', function (done) {
                    var config = {
                        url: '/Login',
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
                    new Promise(function (resolve) {
                        SPID.init(config, resolve);
                    }).then(function () {
                        var disabled = document.querySelectorAll('#agid-spid-idp-list a[disabled]'),
                            extraProvider = document.querySelectorAll('#agid-spid-idp-list a[title="Accedi a SPID con Ciccio ID"]');
                        // THEN
                        expect(disabled.length).toEqual(0);
                        expect(extraProvider.length).toEqual(1);
                        done();
                    });
                });

                it('should disable all providers that don\'t support the kind of protocol in config', function (done) {
                    var config = {
                        url: '/Login',
                        supported: supportedProviders,
                        protocol: ["OIDC"]
                    };
                    // WHEN
                    new Promise(function (resolve) {
                        SPID.init(config, resolve);
                    }).then(function () {
                        var providers = document.querySelectorAll('#agid-spid-idp-list button'),
                            enabled = document.querySelectorAll("#agid-spid-idp-list button:enabled"),
                            disabled = document.querySelectorAll("#agid-spid-idp-list button:disabled");
                        // THEN
                        expect(enabled.length).toEqual(0);
                        expect(disabled.length).toEqual(providers.length);
                        done();
                    });
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
                        new Promise(function (resolve) {
                            SPID.init(config, resolve);
                        }).then(function () {
                            var providers = document.querySelectorAll('#agid-spid-idp-list button'),
                                hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input[name="testName"]');
                            // THEN
                            expect(hiddenInputs.length).toEqual(providers.length);
                            done();
                        });
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
                        new Promise(function (resolve) {
                            SPID.init(config, resolve);
                        }).then(function () {
                            var providers = document.querySelectorAll('#agid-spid-idp-list button'),
                                hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input[name="testName"]'),
                                fooInput = document.querySelectorAll('#agid-spid-idp-list input[name="foo"]'),
                                bazInput = document.querySelectorAll('#agid-spid-idp-list input[name="baz"]');
                            // THEN
                            expect(hiddenInputs.length).toEqual(providers.length);
                            expect(fooInput.length).toEqual(providers.length);
                            expect(bazInput.length).toEqual(providers.length);
                            done();
                        });
                    });

                });
            });
        });

        //describe('changeLanguage method', function () {
            // it('should call only the i18n endpoint for the new copy', function (done) {
            //     // GIVEN
            //     new Promise(function (resolve) {
            //         SPID.init(genericConfig, resolve);
            //     }).then(function () {
            //         spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
            //         spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
            //         // WHEN
            //         SPID.changeLanguage('en');
            //         // THEN
            //         expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
            //         expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"lang":"en"}');
            //         done();
            //     });
            // });

            // it('should log failure when ajax call does not return data', function (done) {

            //     spyOn(SPID, "initResources").and.callFake(function () {
            //         SPID.setResources(ajaxFail);
            //     });
            //     new Promise(function (resolve, reject) {
            //         SPID.init(genericConfig, resolve, reject);
            //     }).catch(function () {
            //         // WHEN
            //         SPID.changeLanguage('en');
            //         expect(console.error).toHaveBeenCalled();
            //         done();
            //     });
            // });
        //});

        // describe('updateSpidButtons method', function () {
        //     it('should render again the spidbuttons in the placeholders if data was fetched successfully', function (done) {
        //         // GIVEN
        //         var spidButtons;

        //         new Promise(function (resolve) {
        //             SPID.init(genericConfig, resolve);
        //         }).then(function () {
        //             injectSpidPlaceHolder();
        //             // WHEN
        //             SPID.updateSpidButtons();
        //             spidButtons = document.querySelectorAll('#spid-button');
        //             // THEN
        //             expect(spidButtons.length).toBe(1);
        //             done();
        //         });
        //     });

            // it('should not render the spidbuttons if providers data was not fetched and throw error', function (done) {
            //     // GIVEN
            //     var spidButtons;
            //     spyOn(SPID, "initResources").and.callFake(function () {
            //         SPID.setResources(ajaxFail);
            //     });
            //     new Promise(function (resolve, reject) {
            //         SPID.init(genericConfig, resolve, reject);
            //     }).catch(function () {
            //         injectSpidPlaceHolder();
            //         // WHEN
            //         SPID.updateSpidButtons();
            //         spidButtons = document.querySelectorAll('.agid-spid-enter');
            //         // THEN
            //         expect(spidButtons.length).toBe(0);
            //         expect(console.error).toHaveBeenCalled();
            //         done();
            //     });
            // });
       // });

        describe('when a SPID button is clicked', function () {
            it('should display the provider choice modal', function (done) {
                // GIVEN
                var isChoiceModalVisible;

                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    // WHEN
                    document.querySelector('.agid-spid-enter-size-medium').click();
                    isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeTruthy();
                    done();
                });
            });

            it('should give focus to the displayed modal for accessibility', function (done) {
                // If this test fails in Chrome it may be due to focused developer tools:
                // https://stackoverflow.com/questions/23045172/focus-event-not-firing-via-javascript-in-chrome#answer-23045332

                // GIVEN
                injectSpidPlaceHolder();
                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
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
        });

        describe('when the providers modal is displayed it should allow to close it by', function () {
            it('click on the top right X button', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isChoiceModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    // WHEN
                    document.querySelector('#agid-spid-panel-close-button').click();
                    isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeFalsy();
                    done();
                });
            });

            it('click on the bottom list cancel button', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isChoiceModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    // WHEN
                    document.querySelector('#agid-cancel-access-button').click();
                    isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeFalsy();
                    done();
                });
            });

            it('hit on the keyboard esc key', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
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
        });

        describe('when the informative buttons in the footer are clicked', function () {
            it('should open the informative modal on top of the providers modal', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isInfoModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    // WHEN
                    document.querySelector(agidModalButtonID).click();
                    isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeTruthy();
                    done();
                });
            });
        });

        describe('when the informative modal is displayed on top of the providers modal it should allow to close it by', function () {
            it('click on the top right X button in the modal', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isInfoModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    document.querySelector(agidModalButtonID).click();
                    // WHEN
                    document.querySelector('#closemodalbutton').click();
                    isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeFalsy();
                    done();
                });
            });

            it('hit on the keyboard esc key', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isInfoModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    document.querySelector(agidModalButtonID).click();
                    // WHEN
                    triggerKeyEvent(27);
                    isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeFalsy();
                    done();
                });
            });

            it('should not react to keystrokes different than ESC', function (done) {
                // GIVEN
                injectSpidPlaceHolder();

                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    var isInfoModalVisible;

                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-medium').click();
                    document.querySelector(agidModalButtonID).click();
                    // WHEN
                    triggerKeyEvent(7);
                    isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeTruthy();
                    done();
                });
            });
        });

        // describe('getI18n utility', function () {
        //     it('should the key name when the value cannot be found', function () {
        //         // GIVEN
        //         var key = 'undefined.key',
        //             copy;
        //         // WHEN
        //         copy = SPID.getI18n(key);
        //         // THEN
        //         expect(copy).toEqual(key);
        //         expect(console.error).toHaveBeenCalled();
        //     });
        // });

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
                    agidModalButton,
                    report;
                // WHEN
                new Promise(function (resolve) {
                    SPID.init(genericConfig, resolve);
                }).then(function () {
                    // Mostra il modale dei provide
                    agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                    agidSpidWrapper.removeAttribute('hidden');
                    // Mostra modale informativo per avere tutti gli elementi HTML visibili e testabili
                    agidModalButton = document.querySelector(agidModalButtonID);
                    agidModalButton.click();
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
});
