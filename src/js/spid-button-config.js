/**
 * Indirizzi di produzione delle risorse (attualmente test), inserire indirizzi reali di CDN
 */
var _SPID;
(function (_SPID) {
    _SPID.prototype.initResources = function () {
        this.resources = {
            assetsBaseUrl: 'https://italia.github.io/spid-smart-button/',
            stylesheetUrl: 'https://italia.github.io/spid-smart-button/spid-button.min.css'
        };
    };
})(_SPID || {});
