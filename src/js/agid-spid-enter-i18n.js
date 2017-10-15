// L'oggeto viene popolato dalla chiamata ajax getLocalisedMessages()
window.agidSpidEnterI18n = {};

// Null safe access, se la label non è trovata non si verificano errori runtime, suggerimento in console
function getSpidI18n(labelKey) {
    var locale = document.getElementsByTagName('html')[0].getAttribute('lang') ||
                 window.agidSpidEnterI18n['spid-texts'].default,

        copy   = window.agidSpidEnterI18n.language &&
                 window.agidSpidEnterI18n.language[locale] &&
                 window.agidSpidEnterI18n.language[locale][labelKey];

    // In caso di label mancante fornisci un feedback al dev
    if (!window.agidSpidEnterI18n.language[locale]) {
        console.error('Il locale richiesto non è disponibile:', locale);
    } else if (!window.agidSpidEnterI18n.language[locale][labelKey]) {
        console.error('La chiave richiesta non è disponibile nel locale selezionato:', labelKey);
    }

    return copy || labelKey;
}
