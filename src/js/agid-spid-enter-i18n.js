// L'oggeto viene popolato dalla chiamata ajax getLocalisedMessages()
window.AgidSpidEnter.prototype.i18n = {};

// Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
window.AgidSpidEnter.prototype.getI18n = function (labelKey) {
    var locale = document.getElementsByTagName('html')[0].getAttribute('lang') ||
                 this.i18n['spid-texts'].default,

        copy   = this.i18n.language &&
                 this.i18n.language[locale] &&
                 this.i18n.language[locale][labelKey];

    // In caso di label mancante fornisci un feedback al dev
    if (!this.i18n.language[locale]) {
        console.error('Il locale richiesto non è disponibile:', locale);
    } else if (!this.i18n.language[locale][labelKey]) {
        console.error('La chiave richiesta non è disponibile nel locale selezionato:', labelKey);
    }

    return copy || labelKey;
};
