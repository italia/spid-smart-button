/* eslint-disable */

(function(){
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

    window.SPID.prototype.initTemplates = function(){
        this.templates = {
            spidMainContainers: function () {
                return [
                    '<div id="agid-spid-enter">', '</div>',
                    '<div id="agid-infomodal" class="modal" aria-live="assertive" tabindex="0" hidden>', '</div>'
                ].join('');
            },

            spidProviderChoiceModal: function (spidProvidersButtons) {
                return [
                    '<div id="agid-spid-enter-anim"></div>',
                    '<section id="agid-spid-panel-select" aria-labelledby="agid-spid-enter-title-page" tabindex="0">',
                        '<header id="agid-spid-panel-header">',
                            '<div class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">',
                                '<div class="agid-display-logo fadeInLeft fadeOutLeft">',
                                    svgWithPngFallback.call(this, 'img/spid-logo', this.getI18n('alt_logo_SPID')),
                                '</div>',
                                '<div class="agid-display-close fadeInRight fadeOutRight">',
                                    '<button tabindex="0" id="agid-spid-panel-close-button" class="agid-navigable" aria-labelledby="agid-cancel-access-button">',

                                        svgWithPngFallback.call(this, 'img/close', this.getI18n('naviga_indietro')),
                                    '</button>',
                                '</div>',
                            '</div>',
                        '</header>',

                        '<div id="agid-spid-panel-content">',
                            '<div class="agid-spid-panel-content-center">',
                                '<h1 id="agid-spid-enter-title-page" class="fadeInBottom fadeOutBottom">',this.getI18n('scegli_provider_SPID'),'</h1>',
                                '<div class="agid-body-list">',
                                    '<div id="agid-spid-idp-list">',
                                        spidProvidersButtons,
                                    '</div>',
                                    '<div id="agid-non-hai-spid">',
                                        '<span class="non-hai-spid-agid-font">', this.getI18n("non_hai_SPID"),'</span>',
                                        '<span id="nospid" style="cursor: pointer; color: blue; text-decoration: underline;">' ,this.getI18n("scopri_di_piu"),'</span>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div id ="agid-foot-btn" class="fadeInCancel">',
                            '<button id="agid-cancel-access-button" class="agid-font agid-navigable">',
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
                return [
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * begin * -->',
                    '<div id="enter-button-container">',
                        '<button class="agid-spid-enter agid-font agid-spid-enter-button-', style.colorScheme, ' agid-spid-enter-button-', style.cornerStyle, ' agid-spid-enter-size-', style.size, fluid,'" hidden>',
                            '<span aria-hidden="true" class="agid-spid-enter-icon">',
                                '<img src="', this.getResources().assetsBaseUrl, 'img/spid-ico-circle-bb.svg" alt="',this.getI18n('entra_con_SPID'),'"></img>',
                            '</span>',
                            '<span class="agid-spid-enter-text">', this.getI18n('entra_con_SPID'), '</span>',
                        '</button>',
                    '</div>',
                    '<!-- AGID - SPID BUTTON ', style.size.toUpperCase(), ' * end * -->'
                ].join('');
            },

            infoModalContent: function (htmlContent) {
                return [
                        '<div class="modal-content agid-font">',
                            '<button id="closemodalbutton"',
                                'class="close agid-navigable"',
                                'tabindex="0"',
                                'aria-label="', this.getI18n('aria_chiudi_modale'), '">',
                                '<b aria-hidden="true">&times;</b>',
                            '</button>',
                            '<div id="agid-infomodal-content" role="main" tabindex="0" aria-labelledby="agid-infomodal-title">',
                                htmlContent,
                            '</div>',
                        '</div>'
                ].join('');
            },

            // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
            nonHaiSpid: function () {
                return [
                    '<h1 id="agid-infomodal-title">Non hai Spid?</h1>',
                    '<ul>',
                        '<li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li>',
                        '<li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>',
                        '<li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>',
                        '<li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>',
                    '</ul>'
                ].join('');
            }
        };
    }
})();
/* eslint-enable indent */
