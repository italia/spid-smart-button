describe('agidSpidEnter', function () {
    var SUT               = window.agidSpidEnter,
        axe               = window.axe,
        agidSpidWrapperID = '#agid-spid-enter-container',
        agidInfoModalID   = '#agid-infomodal',
        agidModalButtonID = '#nospid',
        ajaxSuccess       = {
            providersEndpoint: '/src/data/spidProviders.json',
            localisationEndpoint: '/src/data/spidI18n.json'
        },
        ajaxFail          = {
            providersEndpoint: '/src/data/spidProviders-fail.json',
            localisationEndpoint: '/src/data/spidI18n-fail.json'
        };

    function setSUTconfig(config) {
        window.AgidSpidEnter.prototype.config = Object.assign({}, window.AgidSpidEnter.prototype.config, config);
    }

    function injectSpidPlaceHolder(size) {
        var spidButtonPlaceholder = document.createElement('div');
        spidButtonPlaceholder.innerHTML = '<div class="agid-spid-enter-button" aria-live="polite" data-size="' + size + '"></div>';
        document.body.appendChild(spidButtonPlaceholder);
    }

    beforeEach(function () {
        setSUTconfig(ajaxSuccess);
        spyOn(console, 'warn');
        spyOn(console, 'error');
    });

    afterEach(function () {
        // Pulisci il DOM
        var agidSpidWrapper = document.querySelector('body > section'),
            spidPlaceholder = document.querySelector('.agid-spid-enter-button');

        agidSpidWrapper && agidSpidWrapper.remove();
        spidPlaceholder && spidPlaceholder.parentElement.remove();
    });

    describe('when script is included in the page', function () {
        it('should create a module instance in the global scope', function () {
            expect(SUT).toBeDefined();
        });
    });

    describe('init method', function () {
        it('should return an observable promise for flow control', function () {
            // WHEN
            var returnedObj = SUT.init(),
                isPromise   = returnedObj instanceof Promise;
            // THEN
            expect(isPromise).toBeTruthy();
        });

        it('should inject the modal wrapper HTML needed to print the providers popup', function (done) {
            // GIVEN
            var agidSpidWrapper;
            // WHEN
            SUT.init().then(function () {
                agidSpidWrapper = document.querySelector(agidSpidWrapperID);
                // THEN
                expect(!!agidSpidWrapper).toBeTruthy();
                done();
            });
        });

        it('should fetch italian language if no option was provided, and not provide payload for the providers call', function (done) {
            // GIVEN
            spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
            spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
            // WHEN
            SUT.init().then(function () {
                // THEN
                expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/src/data/spidI18n.json');
                expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"it"}');
                done();
            });
        });

        it('should NOT inject the modal wrapper HTML more than once', function (done) {
            // GIVEN
            var initCalls       = [SUT.init(), SUT.init(), SUT.init()],
                agidSpidWrapper;
            // WHEN
            Promise.all(initCalls).then(function () {
                agidSpidWrapper = document.querySelectorAll(agidSpidWrapperID);
                // THEN
                expect(agidSpidWrapper.length).toBe(1);
                done();
            });
        });

        it('should log failure when ajax calls do not all return data', function (done) {
            // GIVEN
            setSUTconfig(ajaxFail);

            SUT.init().then(function () {
                // THEN
                expect(console.error).toHaveBeenCalled();
                done();
            });
        });

        it('should warn the dev if no placeholder is found to render the smartbuttons', function (done) {
            SUT.init().then(function () {
                // THEN
                expect(console.warn).toHaveBeenCalled();
                done();
            });
        });

        it('should warn the dev if no placeholder is found to render the smartbuttons', function (done) {
            SUT.init().then(function () {
                // THEN
                expect(console.warn).toHaveBeenCalled();
                done();
            });
        });

        describe('when SPID button placeholder are present in the page', function () {
            it('should render the SPID button if supplied sizes are valid regardless of the case', function (done) {
                // GIVEN
                var spidButtons;

                injectSpidPlaceHolder('S');
                injectSpidPlaceHolder('m');
                injectSpidPlaceHolder('L');
                injectSpidPlaceHolder('xL');
                // WHEN
                SUT.init().then(function () {
                    spidButtons = document.querySelectorAll('.agid-spid-enter');
                    // THEN
                    expect(spidButtons.length).toBeTruthy();
                    done();
                });
            });

            it('should throw an error if supplied SPID button size is invalid', function (done) {
                // GIVEN
                injectSpidPlaceHolder('H');
                // WHEN
                SUT.init().then(function () {
                    // THEN
                    expect(console.error).toHaveBeenCalled();
                    done();
                });
            });
        });


        describe('when inited with a configuration object', function () {
            it('should request the provided language in the config', function (done) {
                // GIVEN
                var config = {
                    language: 'de'
                };

                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                // WHEN
                SUT.init(config).then(function () {
                    // THEN
                    expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/src/data/spidI18n.json');
                    expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"de"}');
                    done();
                });
            });
        });
    });

    describe('changeLanguage method', function () {
        it('should call only the i18n endpoint for the new copy', function (done) {
            // GIVEN
            SUT.init().then(function () {
                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send').and.callThrough();
                // WHEN
                SUT.changeLanguage('en');
                // THEN
                expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', '/src/data/spidI18n.json');
                expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith('{"language":"en"}');
                done();
            });
        });

        it('should log failure when ajax call does not return data', function (done) {
            // GIVEN
            setSUTconfig(ajaxFail);

            SUT.init().then(function () {
                // WHEN
                SUT.changeLanguage('en');
                // THEN
                expect(console.error).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('when a SPID button is clicked', function () {
        it('should display the provider choice modal', function (done) {
            // GIVEN
            var isChoiceModalVisible;

            injectSpidPlaceHolder('S');

            SUT.init().then(function () {
                // WHEN
                document.querySelector('.agid-spid-enter.agid-spid-enter-size-s').click();
                isChoiceModalVisible = !document.querySelector(agidSpidWrapperID).hasAttribute('hidden');
                // THEN
                expect(isChoiceModalVisible).toBeTruthy();
                done();
            });
        });

        it('should give focus to the displayed modal for accessibility', function (done) {
            // If this test fails in Chrome it may be due to focused developer tools:
            // https://stackoverflow.com/questions/23045172/focus-event-not-firing-via-javascript-in-chrome#answer-23045332

            // GIVEN
            injectSpidPlaceHolder('m');

            SUT.init().then(function () {
                var choiceModal = document.querySelector('#agid-spid-panel-select');

                document.querySelector('.agid-spid-enter.agid-spid-enter-size-m').click();
                // WHEN
                choiceModal.addEventListener('focus', function () {
                    // THEN
                    expect(choiceModal).toBe(document.activeElement);
                    done();
                });
            });
        });
    });

    // A11y accessibility testing
    describe('axe accessibility check', function () {
        it('should not find any violation in the module HTML', function (done) {
            // GIVEN
            var axeOptions = {
                    "rules": {
                        "color-contrast": { enabled: false },
                        "valid-lang": { enabled: false }
                    }
                },
                agidSpidWrapper,
                agidInfoModal,
                agidModalButton,
                report;
            // WHEN
            SUT.init().then(function () {
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

                    expect(result.violations.length).toBe(0, report);
                    done();
                });
            });
        });
    });
});
