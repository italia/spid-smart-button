describe('agidSpidEnter', () => {
    let SUT = window.agidSpidEnter;
    const axe = window.axe;
    const agidSpidWrapperID = '#agid-spid-enter-container';
    const agidInfoModalID = '#agid-infomodal';
    const agidModalCosaBtID = '#cosaspid';
    const agidModalButtonID = '#nospid';
    const ajaxSuccess = {
        providersEndpoint: '/src/data/spidProviders.json',
        localisationEndpoint: '/src/data/spidI18n.json'
    };
    const ajaxFail = {
        providersEndpoint: '/src/data/spidProviders-fail.json',
        localisationEndpoint: '/src/data/spidI18n-fail.json'
    };

    function setSUTconfig(config) {
        window.AgidSpidEnter.prototype.config = Object.assign({}, window.AgidSpidEnter.prototype.config, config);
    }

    function injectSpidPlaceHolder(size) {
        const spidButtonPlaceholder = document.createElement('div');
        spidButtonPlaceholder.innerHTML = `<div class="agid-spid-enter-button" aria-live="polite" data-size="${size}"></div>`;
        document.body.appendChild(spidButtonPlaceholder);
    }

    function isElementVisible(elementID) {
        return !document.querySelector(elementID).hasAttribute('hidden');
    }

    function domCleanup() {
        const agidSpidWrapper = document.querySelectorAll('body > section');
        const spidPlaceholder = document.querySelectorAll('.agid-spid-enter-button');

        Array.from(agidSpidWrapper).forEach((agidWrapper) => agidWrapper.remove());
        Array.from(spidPlaceholder).forEach((spidButton) =>  spidButton.parentElement.remove());
    }

    function triggerKeyEvent(keyCode) {
        // Credit to Elger van Boxtel
        // https://elgervanboxtel.nl/site/blog/simulate-keydown-event-with-javascript
        const e = new Event("keyup");
        e.keyCode  = keyCode;
        e.which    = e.keyCode;
        e.altKey   = false;
        e.ctrlKey  = true;
        e.shiftKey = false;
        e.metaKey  = false;
        e.bubbles  = true;
        document.dispatchEvent(e);
    }

    describe('when script is included in the page', () => {
        it('should create a module instance in the global scope', () => {
            expect(SUT).toBeDefined();
        });
    });

    describe('when module instance is available', () => {
        beforeEach(() => {
            SUT = new window.AgidSpidEnter();
            setSUTconfig(ajaxSuccess);
            spyOn(console, 'log'); // silenzia log di aXe
            spyOn(console, 'warn');
            spyOn(console, 'error');
            domCleanup();
        });

        afterEach(() => {
            domCleanup();
            SUT = null;
        });

        describe('init method', () => {
            it('should return an observable promise for flow control', () => {
                // WHEN
                const returnedObj = SUT.init();
                const isPromise = returnedObj instanceof Promise;
                // THEN
                expect(isPromise).toBeTruthy();
            });

            it('should inject the modal wrapper HTML needed to print the providers popup', (done) => {
                // GIVEN
                // WHEN
                SUT.init().then(() => {
                    let agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                    // THEN
                    expect(!!agidSpidWrapper).toBeTruthy();
                    done();
                });
            });

            it('should fetch italian language if no option was provided, and not provide payload for the providers call', (done) => {
                // GIVEN
                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                // WHEN
                SUT.init().then(() => {
                    // THEN
                    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
                    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"it"}');
                    done();
                });
            });

            it('should NOT inject the modal wrapper HTML more than once', (done) => {
                // GIVEN
                const initCalls = [SUT.init(), SUT.init(), SUT.init()];
                // WHEN
                Promise.all(initCalls).then(() => {
                    let agidSpidWrapper = document.querySelectorAll(agidSpidWrapperID);
                    // THEN
                    expect(agidSpidWrapper.length).toBe(1);
                    done();
                });
            });

            it('should warn the dev if no placeholder is found to render the smartbuttons', (done) => {
                // WHEN
                SUT.init().then(() => {
                    // THEN
                    expect(console.warn).toHaveBeenCalled();
                    done();
                });
            });

            describe('on failure', () => {
                it('should log failure when ajax calls do not all return data', (done) => {
                    // GIVEN
                    setSUTconfig(ajaxFail);
                    // WHEN
                    SUT.init().then(() => {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should NOT inject the modal wrapper HTML at all', (done) => {
                    // GIVEN
                    domCleanup();
                    setSUTconfig(ajaxFail);
                    // WHEN
                    SUT.init().then(() => {
                        const agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                        // THEN
                        expect(!!agidSpidWrapper).toBeFalsy();
                        done();
                    });
                });
            });

            describe('when SPID button placeholder are present in the page', () => {
                it('should render the SPID button if supplied sizes are valid regardless of the case', (done) => {
                    // GIVEN
                    injectSpidPlaceHolder('S');
                    injectSpidPlaceHolder('m');
                    injectSpidPlaceHolder('L');
                    injectSpidPlaceHolder('xL');
                    // WHEN
                    SUT.init().then(() => {
                        const spidButtons = document.querySelectorAll('.agid-spid-enter');
                        // THEN
                        expect(spidButtons.length).toBeTruthy();
                        done();
                    });
                });

                it('should throw an error if supplied SPID button size is invalid', (done) => {
                    // GIVEN
                    injectSpidPlaceHolder('H');
                    // WHEN
                    SUT.init().then(() => {
                        // THEN
                        expect(console.error).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when not supplied with a configuration object', () => {
                it('should add to the active providers the default hidden inputs payload', (done) => {
                    // WHEN
                    SUT.init().then(() => {
                        const providers = document.querySelectorAll('#agid-spid-idp-list button:enabled');
                        const hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input[name="provider"]');
                        // THEN
                        expect(hiddenInputs.length).toEqual(providers.length);
                        done();
                    });
                });
            });

            describe('when supplied with a configuration object', () => {
                it('should request the provided language in the config', (done) => {
                    // GIVEN
                    const config = {
                        language: 'de'
                    };

                    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                    spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                    // WHEN
                    SUT.init(config).then(() => {
                        // THEN
                        expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
                        expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"de"}');
                        done();
                    });
                });

                describe('when provided with a payload', () => {
                    it('should add to the active providers the hidden inputs payload from common', (done) => {
                        // GIVEN
                        const config = {
                            providersPayload: {
                                common: {
                                    testName: 'testValue'
                                }
                            }
                        };
                        // WHEN
                        SUT.init(config).then(() => {
                            const providers = document.querySelectorAll('#agid-spid-idp-list button:enabled');
                            const hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input[name="testName"]');
                            // THEN
                            expect(hiddenInputs.length).toEqual(providers.length);
                            done();
                        });
                    });

                    it('should add to the active providers the hidden inputs payload from common and the specific per provider', (done) => {
                        // GIVEN
                        const config = {
                            providersPayload: {
                                common: {
                                    testName: 'testValue'
                                },
                                aruba: {
                                    specific: true
                                }
                            }
                        };
                        // WHEN
                        SUT.init(config).then(() => {
                            const providers = document.querySelectorAll('#agid-spid-idp-list button:enabled');
                            const hiddenInputs = document.querySelectorAll('#agid-spid-idp-list input[name="testName"]');
                            const specificInput = document.querySelectorAll('#agid-spid-idp-list input[name="specific"]');
                            // THEN
                            expect(hiddenInputs.length).toEqual(providers.length);
                            expect(specificInput.length).toEqual(1);
                            done();
                        });
                    });

                    it('should change the provider input name when specified', (done) => {
                        // GIVEN
                        const config = {
                            providersPayload: {
                                common: {
                                    providerHiddenName: 'entityId'
                                }
                            }
                        };
                        injectSpidPlaceHolder('xL');
                        // WHEN
                        SUT.init(config).then(() => {
                            const provider = document.querySelector('#agid-spid-provider-poste input[value="poste"]');
                            // THEN
                            expect(provider.name).toEqual('entityId');
                            done();
                        });
                    });

                    it('should ovveride attributes from common when present also in the the provider specific config', (done) => {
                        // GIVEN
                        const config = {
                            providersPayload: {
                                common: {
                                    data: 'common'
                                },
                                tim: {
                                    data: 'override'
                                }
                            }
                        };
                        injectSpidPlaceHolder('xL');
                        // WHEN
                        SUT.init(config).then(() => {
                            const posteData = document.querySelector('#agid-spid-provider-poste input[name="data"]');
                            const arubaData = document.querySelector('#agid-spid-provider-aruba input[name="data"]');
                            const timData = document.querySelector('#agid-spid-provider-tim input[name="data"]');
                            // THEN
                            expect(posteData.value).toEqual('common');
                            expect(arubaData.value).toEqual('common');
                            expect(timData.value).toEqual('override');
                            done();
                        });
                    });
                });
            });
        });

        describe('changeLanguage method', () => {
            it('should call only the i18n endpoint for the new copy', (done) => {
                // GIVEN
                SUT.init().then(() => {
                    spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                    spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                    // WHEN
                    SUT.changeLanguage('en');
                    // THEN
                    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('GET', '/src/data/spidI18n.json');
                    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"en"}');
                    done();
                });
            });

            it('should log failure when ajax call does not return data', (done) => {
                // GIVEN
                setSUTconfig(ajaxFail);

                SUT.init().then(() => {
                    // WHEN
                    SUT.changeLanguage('en');
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('updateSpidButtons method', () => {
            it('should render again the spidbuttons in the placeholders if data was fetched successfully', (done) => {
                // GIVEN
                SUT.init().then(() => {
                    injectSpidPlaceHolder('S');
                    // WHEN
                    SUT.updateSpidButtons();
                    let spidButtons = document.querySelectorAll('.agid-spid-enter');
                    // THEN
                    expect(spidButtons.length).toBe(1);
                    done();
                });
            });

            it('should not render the spidbuttons if providers data was not fetched and throw error', (done) => {
                // GIVEN
                setSUTconfig(ajaxFail);

                SUT.init().then(() => {
                    injectSpidPlaceHolder('S');
                    // WHEN
                    SUT.updateSpidButtons();
                    let spidButtons = document.querySelectorAll('.agid-spid-enter');
                    // THEN
                    expect(spidButtons.length).toBe(0);
                    expect(console.error).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when a SPID button is clicked', () => {
            it('should display the provider choice modal', (done) => {
                // GIVEN
                injectSpidPlaceHolder('S');

                SUT.init().then(() => {
                    // WHEN
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-s').click();
                    let isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeTruthy();
                    done();
                });
            });

            it('should give focus to the displayed modal for accessibility', (done) => {
                // If this test fails in Chrome it may be due to focused developer tools:
                // https://stackoverflow.com/questions/23045172/focus-event-not-firing-via-javascript-in-chrome#answer-23045332

                // GIVEN
                injectSpidPlaceHolder('m');

                SUT.init().then(() => {
                    const choiceModal = document.querySelector('#agid-spid-panel-select');
                    // WHEN
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-m').click();
                    // THEN
                    choiceModal.addEventListener('focus', () => {
                        expect(choiceModal).toBe(document.activeElement);
                        done();
                    });
                });
            });
        });

        describe('when the providers modal is displayed it should allow to close it by', () => {
            it('click on the top right X button', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    // WHEN
                    document.querySelector('#agid-spid-panel-close-button').click();
                    let isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeFalsy();
                    done();
                });
            });

            it('click on the bottom list cancel button', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    // WHEN
                    document.querySelector('#agid-cancel-access-button').click();
                    let isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeFalsy();
                    done();
                });
            });

            it('hit on the keyboard esc key', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    // WHEN
                    triggerKeyEvent(27);
                    let isChoiceModalVisible = isElementVisible(agidSpidWrapperID);
                    // THEN
                    expect(isChoiceModalVisible).toBeFalsy();
                    done();
                });
            });
        });

        describe('when the informative buttons in the footer are clicked', () => {
            it('should open the informative modal on top of the providers modal', (done) => {
                // GIVEN
                injectSpidPlaceHolder('L');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-l').click();
                    // WHEN
                    document.querySelector(agidModalButtonID).click();
                    let isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeTruthy();
                    done();
                });
            });
        });

        describe('when the informative modal is displayed on top of the providers modal it should allow to close it by', () => {
            it('click on the top right X button in the modal', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    document.querySelector(agidModalCosaBtID).click();
                    // WHEN
                    document.querySelector('#closemodalbutton').click();
                    let isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeFalsy();
                    done();
                });
            });

            it('hit on the keyboard esc key', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    document.querySelector(agidModalButtonID).click();
                    // WHEN
                    triggerKeyEvent(27);
                    let isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeFalsy();
                    done();
                });
            });

            it('should not react to keystrokes different than ESC', (done) => {
                // GIVEN
                injectSpidPlaceHolder('Xl');

                SUT.init().then(() => {
                    document.querySelector('.agid-spid-enter.agid-spid-enter-size-xl').click();
                    document.querySelector(agidModalButtonID).click();
                    // WHEN
                    triggerKeyEvent(7);
                    let isInfoModalVisible = isElementVisible(agidInfoModalID);
                    // THEN
                    expect(isInfoModalVisible).toBeTruthy();
                    done();
                });
            });
        });

        describe('getI18n utility', () => {
            it('should return the key name when the value cannot be found', () => {
                // GIVEN
                const key = 'undefined.key';
                // WHEN
                let copy = window.AgidSpidEnter.prototype.getI18n(key);
                // THEN
                expect(copy).toEqual(key);
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe('version method', () => {
            it('should return the semantic version number of the module', () => {
                // GIVEN
                window.AgidSpidEnter.prototype.config.version = '000';
                // WHEN
                let version = SUT.version();
                // THEN
                expect(version).toEqual('000');
            });
        });

        // A11y accessibility testing
        describe('aXe accessibility check (A11y)', () => {
            it('should not find any violation in the module HTML', (done) => {
                // GIVEN
                const axeOptions = {
                    "rules": {
                        "color-contrast": { enabled: false },
                        "valid-lang": { enabled: false }
                    }
                };
                let agidSpidWrapper;
                let agidModalButton;
                let report;
                // WHEN
                SUT.init().then(() => {
                    // Mostra il modale dei provide
                    agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                    agidSpidWrapper.removeAttribute('hidden');
                    // Mostra modale informativo per avere tutti gli elementi HTML visibili e testabili
                    agidModalButton = document.querySelector(agidModalButtonID);
                    agidModalButton.click();
                    // THEN
                    axe.run(agidSpidWrapper, axeOptions, (error, result) => {
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
