// Lingua delle etichette sostituibile all'init, default Italiano
window.AgidSpidEnter.prototype.language = 'it';
// L'oggeto viene popolato dalla chiamata ajax getLocalisedMessages()
window.AgidSpidEnter.prototype.i18n = {};

// Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
window.AgidSpidEnter.prototype.getI18n = function (labelKey, placeholderValue) {
    var locale      = this.language,
        copy        = this.i18n.language &&
                      this.i18n.language[locale] &&
                      this.i18n.language[locale][labelKey],
        placeholder = /\{\d}/;

    if (placeholderValue) {
        copy = copy.replace(placeholder, placeholderValue);
    }

    // In caso di label mancante fornisci un feedback al dev
    if (!copy) {
        console.error('La chiave richiesta non è disponibile nel locale selezionato:', locale, labelKey);
    }

    return copy || labelKey;
};
