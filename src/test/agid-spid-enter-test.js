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
        window.AgidSpidEnter.prototype.config = config;
    }

    beforeEach(function () {
        setSUTconfig(ajaxSuccess);
        spyOn(console, 'warn');
        spyOn(console, 'error');
    });

    afterEach(function () {
        // Pulisci il DOM
        var agidSpidWrapper = document.querySelector('body > section');

        agidSpidWrapper && agidSpidWrapper.remove();
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
    });

    // A11y accessibility testing
    describe('axe accessibility check', function () {
        it('should not find any violation in the module HTML', function (done) {
            // GIVEN
            var agidSpidWrapper,
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
                axe.run(agidSpidWrapper, {}, function (error, result) {
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
