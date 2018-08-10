/**
 * Indirizzi di produzione delle risorse (attualmente test), inserire indirizzi reali di CDN
 */
var _SPID;
(function (_SPID) {
    _SPID.prototype.initResources = function () {
        this.resources = {
            assetsBaseUrl: 'https://rawgit.com/italia/spid-smart-button/master/',
            stylesheetUrl: 'https://rawgit.com/italia/spid-smart-button/master/prod/agid-spid-enter.min.{{ VERSION }}.css'
        };
    };
})(_SPID || {});
