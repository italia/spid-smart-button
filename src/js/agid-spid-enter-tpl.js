/* eslint-disable */
var _SPID = (function(languages, providers){

    // costruttore dell'oggetto SPID
    // qui vengono avvalorate le proprietà con i valori di default
    function _SPID() {
        this.resources = {};
        this.templates = {};
        this._lang = 'it'; // Lingua delle etichette sostituibile all'init, default Italiano
        this._i18n = languages(); // L'oggetto viene popolato dalla chiamata ajax getLocalisedMessages()
        this._availableProviders = providers();
        this._selector = '#spid-button';
        this._protocol = "SAML";
        this._style = {
            size: "medium",
            colorScheme: "positive",
            fluid: false,
            cornerStyle: "rounded"
        };
    }

    function svgWithPngFallback(imagePath, altText) {
        return [
            '<img aria-hidden="true"',
                'src="', this.getResources().assetsBaseUrl, imagePath, '.svg"',
                //NON CI SONO LE IMMAGINI PNG
                'onerror="this.src=\'', this.getResources().assetsBaseUrl, imagePath, '.png\'; this.onerror=null;"',
                'alt="', altText, '" style="float:left"/>'
        ].join('');
    };

    function hiddenField(name, value) {
        return ['<input type="hidden" name="', name, '" value="', value, '" />'].join('');
    };

    _SPID.prototype.initTemplates = function(){
        this.templates = {
            spidMainContainers: function () {
                return [
                    '<div id="spid-enter">', '</div>',
                    '<div id="spid-info-modal" class="modal" aria-live="assertive" tabindex="0" hidden>', '</div>'
                ].join('');
            },

            spidProviderChoiceModal: function (spidProvidersButtons) {
                return [
                    '<section id="agid-spid-panel-select" class="agid-spid-panel" aria-labelledby="spid-enter-title-page" tabindex="0">',
                        '<header class="agid-spid-header">',
                            '<div class="agid-spid-panel-back agid-spid-panel-element">',
                                '<div id="agid-logo" class="agid-display-logo agid-fade-out-left">',
                                    svgWithPngFallback.call(this, 'img/spid-logo', this.getI18n('alt_logo_SPID')),
                                '</div>',
                                '<div id="agid-close-button" class="agid-display-close agid-fade-out-right">',
                                    '<button tabindex="0" id="agid-spid-panel-close-button" class="agid-navigable" aria-labelledby="spid-cancel-access-button">',

                                        svgWithPngFallback.call(this, 'img/close', this.getI18n('naviga_indietro')),
                                    '</button>',
                                '</div>',
                            '</div>',
                        '</header>',

                        '<div id="agid-spid-panel-content">',
                            '<div class="agid-spid-panel-content-center">',
                                '<h1 id="spid-enter-title-page" class="agid-fade-in-bottom agid-fade-out-bottom">',this.getI18n('scegli_provider_SPID'),'</h1>',
                                '<div class="agid-body-list">',
                                    '<div id="spid-idp-list">',
                                        spidProvidersButtons,
                                    '</div>',
                                    '<div id="spid-non-hai-spid">',
                                        '<span class="agid-non-hai-spid-font">', this.getI18n("non_hai_SPID"),'</span>',
                                        '<span id="spid-nonhai-spid" class="agid-spid-link agid-non-hai-spid-font">' ,this.getI18n("scopri_di_piu"),'</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div id ="spid-foot-btn" class="agid-fade-in-cancel">',
                            '<button id="spid-cancel-access-button" class="agid-font agid-navigable">',
                                '<span>', this.getI18n('annulla_accesso'), '</span>',
                            '</button>',
                        '</div>',
                    '</section>'
                ].join('');
            },

            spidProviderButton: function (providerData) {
                var providerPayloadInputs = '',
                    providerUri = '',
                    providerEntityName = (providerData.active)
                                       ? this.getI18n('accedi_con_idp', providerData.entityName)
                                       : this.getI18n('idp_disabled'),
                    providerID =  providerData.entityName.replace(' ', '-');
                if (providerData.method === 'POST') {
                    // Crea gli input field chiave=valore dall'oggetto
                    var fieldName = providerData.fieldName || 'idp';
                    providerPayloadInputs += hiddenField(fieldName, providerData.entityID);
                    if (providerData.extraFields) {
                        for (property in providerData.extraFields) {
                            providerPayloadInputs += hiddenField(property, providerData.extraFields[property]);
                        }
                    }
                    providerUri = providerData.url;
                    return [
                        '<span class="agid-spid-idp">',
                            '<form action="', providerUri, '" method="', providerData.method, '">',
                                '<button type="submit"',
                                    'class="agid-spid-idp-button"',
                                    'title="', providerEntityName, '"',
                                    (providerData.supported) ? '' : 'disabled', '>',
                                    '<img src="', this.getResources().assetsBaseUrl, 'img/idp-logos/', providerData.logo, '" alt="', providerData.entityName, '">',
                                '</button>',
                                providerPayloadInputs,
                            '</form>',
                        '</span>'
                        ].join('');
                } else if (providerData.method === 'GET') {
                    providerUri = providerData.url.replace('{{idp}}', encodeURIComponent(providerData.entityID));
                    return [
                        '<span class="agid-spid-idp">',
                            '<a title="', providerEntityName, '" href="', providerUri,'"',
                            (providerData.supported) ? '' : 'disabled','>',
                                '<img src="', this.getResources().assetsBaseUrl, 'img/idp-logos/', providerData.logo, '" alt="', providerData.entityName, '">',
                            '</a>',
                        '</span>'
                    ].join('');
                }
            },

            spidButton: function (style) {
                var fluid = style.fluid ? " agid-spid-enter-fluid " : "";
                var imgPath = style.colorScheme == 'negative' ? 'img/spid-ico-circle-lb.svg' : 'img/spid-ico-circle-bb.svg';
                return [
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * begin * -->',
                    '<div id="spid-enter-button-container">',
                        '<button class="agid-spid-enter agid-font agid-spid-enter-button-', style.colorScheme, ' agid-spid-enter-button-', style.cornerStyle, ' agid-spid-enter-size-', style.size, fluid,'" hidden>',
                            '<span aria-hidden="true" class="agid-spid-enter-icon">',
                                '<img src="', this.getResources().assetsBaseUrl, imgPath,'" alt="',this.getI18n('entra_con_SPID'),'"></img>',
                            '</span>',
                            '<span class="agid-spid-enter-text">', this.getI18n('entra_con_SPID'), '</span>',
                        '</button>',
                    '</div>',
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * end * -->'
                ].join('');
            },

            infoModalContent: function (htmlContent) {
                return [
                        '<section class="agid-spid-panel">',
                            '<header class="agid-spid-header">',
                                '<div class="agid-spid-panel-back agid-spid-panel-element">',
                                    '<div class="agid-display-logo">',
                                        svgWithPngFallback.call(this, 'img/spid-logo', this.getI18n('alt_logo_SPID')),
                                    '</div>',
                                    '<div class="agid-display-close">',
                                        '<button id="spid-close-modal-button" class="agid-navigable" aria-labelledby="spid-close-modal-button">',

                                            svgWithPngFallback.call(this, 'img/close', this.getI18n('aria_chiudi_modale')),
                                        '</button>',
                                    '</div>',
                                '</div>',
                            '</header>',
                            '<div id="spid-infomodal-content">',
                                '<div class="agid-spid-panel-content-center">',
                                    htmlContent,
                                '</div>',
                            '</div>',
                        '</section>'
                ].join('');
            },

            // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
            nonHaiSpid: function () {
                return [
                    '<h1 id="spid-info-modal-title" class="agid-fade-in-bottom">',this.getI18n('non_hai_SPID'),'</h1>',
                    '<h3 class="agid-fade-in-bottom">Inserire il testo corretto</h3>'
                ].join('');
            }
        };
    }

    return _SPID;

})(languages, providers);
/* eslint-enable indent */
