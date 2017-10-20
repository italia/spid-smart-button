describe('agidSpidEnter', function () {
    var SUT               = window.agidSpidEnter,
        agidSpidWrapperID = '#agid-spid-enter-container';

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
            var agidSpidWrapper = document.querySelector('body > section');
            // rimuovi container se già presenti da altri test
            agidSpidWrapper && agidSpidWrapper.remove();
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
            var agidSpidWrapper = document.querySelector('body > section'),
                initCalls       = [SUT.init(), SUT.init(), SUT.init()];
            // rimuovi container se già presenti da altri test
            agidSpidWrapper && agidSpidWrapper.remove();
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
