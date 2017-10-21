describe('agidSpidEnter', function () {
    var SUT               = window.agidSpidEnter,
        agidSpidWrapperID = '#agid-spid-enter-container',
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
});
