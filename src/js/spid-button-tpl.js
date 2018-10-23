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

    function getImageResource(imagePath, altText) {
        return [
            '<img aria-hidden="true"',
                'src="', this.getResources().assetsBaseUrl, imagePath, '.svg"',
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
                    '<div id="spid-enter">', '</div>'
                ].join('');
            },

            spidProviderChoiceModal: function (spidProvidersButtons) {
                var imgPath = 'img/spid-ico-circle-black.svg';

                return [
                    '<section id="spid-button-panel-select" class="spid-button-panel" aria-labelledby="spid-enter-title-page" tabindex="0">',
                        '<header class="spid-button-header">',
                            '<div class="spid-button-panel-back spid-button-panel-element">',
                                '<div id="spid-button-logo" class="spid-button-display-logo spid-button-fade-out-left">',
                                    getImageResource.call(this, 'img/spid-logo', this.getI18n('alt_logo_SPID')),
                                '</div>',
                                '<div id="spid-button-close-button" class="spid-button-display-close spid-button-fade-out-right">',
                                    '<button tabindex="0" id="spid-button-panel-close-button" class="spid-button-navigable" aria-labelledby="spid-cancel-access-button">',

                                        getImageResource.call(this, 'img/close', this.getI18n('naviga_indietro')),
                                    '</button>',
                                '</div>',
                            '</div>',
                        '</header>',

                        '<div id="spid-button-panel-content">',
                        //'<div >',
                            '<img class="spid-button-little-man-icon" src="', this.getResources().assetsBaseUrl, imgPath,'" alt="',this.getI18n('entra_con_SPID'),'" class="spid-button-littleMan-icon"></img>',
                        //'</div>',                            
                        '<div class="spid-button-panel-content-center">',
                            '<h1 id="spid-enter-title-page" class="spid-button-fade-in-bottom spid-button-fade-out-bottom">',this.getI18n('scegli_provider_SPID'),'</h1>',
                            
                            '<div id="spid-idp-list">',
                                    spidProvidersButtons,
                                '</div>',
                                '<div id="spid-non-hai-spid">',
                                    '<span class="spid-button-non-hai-spid-font">', this.getI18n("non_hai_SPID"),'</span>',
                                    '<span id="spid-nonhai-spid" class="spid-button-link spid-button-non-hai-spid-font">' ,this.getI18n("scopri_di_piu"),'</span>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div id="spid-foot-btn" class="spid-button-circular-shadow">',
                            '<button id="spid-cancel-access-button" class="spid-button-font">',
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
                                       : this.getI18n('idp_disabled');

                                       providerUri = providerData.url.replace('{{idp}}', encodeURIComponent(providerData.entityID));
                if (providerData.method === 'POST') {
                    // Crea gli input field chiave=valore dall'oggetto
                    var fieldName = providerData.fieldName || 'idp';
                    providerPayloadInputs += hiddenField(fieldName, providerData.entityID);
                    if (providerData.extraFields) {
                        for (property in providerData.extraFields) {
                            providerPayloadInputs += hiddenField(property, providerData.extraFields[property]);
                        }
                    }
                    return [
                        '<span class="spid-button-idp">',
                            '<form action="', providerUri, '" method="', providerData.method, '">',
                                '<button type="submit"',
                                    'class="spid-button-idp-button"',
                                    'title="', providerEntityName, '"',
                                    (providerData.supported) ? '' : 'disabled', '>',
                                    '<img src="', this.getResources().assetsBaseUrl, 'img/idp-logos/', providerData.logo, '" alt="', providerData.entityName, '">',
                                '</button>',
                                providerPayloadInputs,
                            '</form>',
                        '</span>'
                        ].join('');
                } else if (providerData.method === 'GET') {
                    return [
                        '<span class="spid-button-idp">',
                            '<a title="', providerEntityName, '" href="', providerUri,'"',
                            (providerData.supported) ? '' : 'disabled','>',
                                '<img src="', this.getResources().assetsBaseUrl, 'img/idp-logos/', providerData.logo, '" alt="', providerData.entityName, '">',
                            '</a>',
                        '</span>'
                    ].join('');
                }
            },

            spidButton: function (style) {
                var fluid = style.fluid ? " spid-button-fluid " : "";
                var imgPath = style.colorScheme == 'negative' ? 'img/spid-ico-circle-lb.svg' : 'img/spid-ico-circle-bb.svg';
                return [
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * begin * -->',
                    '<div id="spid-enter-button-container">',
                        '<button class="spid-button spid-button-font spid-button-', style.colorScheme, ' spid-button-', style.cornerStyle, ' spid-button-size-', style.size, fluid,'" hidden>',
                            '<span aria-hidden="true" class="spid-button-icon">',
                                '<img src="', this.getResources().assetsBaseUrl, imgPath,'" alt="',this.getI18n('entra_con_SPID'),'"></img>',
                            '</span>',
                            '<span class="spid-button-text">', this.getI18n('entra_con_SPID'), '</span>',
                        '</button>',
                    '</div>',
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * end * -->'
                ].join('');
            }
        };
    }

    return _SPID;

})(languages, providers);
/* eslint-enable indent */
