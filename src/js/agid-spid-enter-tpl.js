/* eslint-disable */
window.AgidSpidEnter.prototype.tpl = {
    spidMainContainers: function () {
        return [
            '<div id="agid-spid-enter"></div>',
            '<div id="agid-infomodal" class="modal" aria-live="assertive" hidden></div>'
        ].join('');
    },

    svgWithPngFallback: function (imagePath, altText) {
        return [
            '<img aria-hidden="true"',
                'src="', this.config.assetsBaseUrl, imagePath, '.svg"',
                'onerror="this.src=\'', this.config.assetsBaseUrl, imagePath, '.png\'; this.onerror=null;"',
                'alt="', altText, '" />'
        ].join('');
    },

    spidProviderChoiceModal: function (spidProvidersButtons) {
        return [
            '<div id="agid-spid-button-anim">',
                '<div id="agid-spid-button-anim-base"></div>',
                '<div id="agid-spid-button-anim-icon"></div>',
            '</div>',
            '<section id="agid-spid-panel-select" class="agid-spid-panel" aria-modal="true" aria-labelledby="agid-spid-enter-title-page" tabindex="-1" hidden>',
                '<header id="agid-spid-panel-header">',
                    '<nav class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">',
                        '<div role="button" tabindex="0">',
                            '<a id="agid-spid-panel-close-button" href="#" class="agid-spid-button">',
                                this.tpl.svgWithPngFallback.call(this, 'img/x-icon', this.getI18n('naviga_indietro')),
                            '</a>',
                        '</div>',
                    '</nav>',
                    '<div class="agid-spid-panel-logo agid-spid-panel-element">',
                        this.tpl.svgWithPngFallback.call(this, 'img/spid-logo-c-lb', this.getI18n('alt_logo_SPID')),
                    '</div>',
                '</header>',
                '<div id="agid-spid-panel-content">',
                    '<div class="agid-spid-panel-content-center">',
                        '<div id ="agid-spid-enter-title-container">',
                            '<h1 id="agid-spid-enter-title-page">', this.getI18n('scegli_provider_SPID'), '</h1>',
                        '</div>',
                        '<div id="agid-spid-idp-list" class="agid-spid-row">',
                            spidProvidersButtons,
                        '</div>',
                        '<div id="agid-cancel-access-container">',
                            '<a id="agid-spid-cancel-access-button" href="#" role="button">',
                                '<div id="agid-cancel-access-button" class="agid-transparent-button">',
                                    '<span>', this.getI18n('annulla_accesso'), '</span>',
                                '</div>',
                            '</a>',
                        '</div>',
                        '<div id="agid-logo-container" aria-hidden="true">',
                            this.tpl.svgWithPngFallback.call(this, 'img/agid-logo-bb-short'),
                        '</div>',
                    '</div>',
                '</div>',
                '<footer id="agid-spid-panel-footer">',
                    '<div id="agid-action-button-container">',
                        '<a id="nospid" href="#" role="button">',
                            '<div class="agid-action-button">',
                                '<span>', this.getI18n('non_hai_SPID'), '</span>',
                            '</div>',
                        '</a>',
                        '<a id="cosaspid" href="#" role="button">',
                            '<div class="agid-action-button">',
                                '<span>', this.getI18n('cosa_SPID'), '</span>',
                            '</div>',
                        '</a>',
                    '</div>',
                '</footer>',
            '</section>'
        ].join('');
    },

    spidProviderButton: function (providerData) {
        return [
            '<span class="agid-spid-col l3 m6 s6 xs12" role="button">',
                '<a href="', providerData.url, '"',
                    // la seconda classe è necessaria? non è in nessun CSS, potrebbe essere messa in config, oppure affidarsi al nome della config
                    'class="agid-spid-idp-button agid-spid-idp-infocertid"',
                    'title="', providerData.title, '"',
                    'style="background-image: url(img/idp-logos/', providerData.logo, ')">',
                '</a>',
            '</span>'
        ].join('');
    },

    spidButton: function (sizeClass) {
        return [
            '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * begin * -->',
            '<button class="agid-spid-enter agid-spid-enter-size-', sizeClass, '" style="display:none">',
                '<span aria-hidden="true" class="agid-spid-enter-icon">',
                    this.tpl.svgWithPngFallback.call(this, 'img/spid-ico-circle-bb', this.getI18n('entra_con_SPID')),
                '</span>',
                '<span class="agid-spid-enter-text">', this.getI18n('entra_con_SPID'), '</span>',
            '</button>',
            '<!-- AGID - SPID BUTTON ', sizeClass.toUpperCase(), ' * end * -->'
        ].join('');
    },

    infoModal: function (htmlContent) {
        return [
            '<div class="modal-content">',
                '<span id="closemodalbutton" class="close" role="button" tabindex="0" aria-label="', this.getI18n('aria_chiudi_modale'), '"><b aria-hidden="true">&times;</b></span>',
                '<div>', htmlContent, '</div>',
            '</div>'
        ].join('');
    },

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    nonHaiSpid: function () {
        return [
            '<ul>',
                '<li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li>',
                '<li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>',
                '<li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>',
                '<li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>',
            '</ul>'
        ].join('');
    },

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    cosaSpid: function () {
        return [
            '<h1>HTML Ipsum Presents</h1>',
            '<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>',
            '<h2>Header Level 2</h2>',
            '<ol>',
                '<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>',
                '<li>Aliquam tincidunt mauris eu risus.</li>',
            '</ol>',
            '<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>',
            '<h3>Header Level 3</h3>',
            '<ul>',
                '<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>',
                '<li>Aliquam tincidunt mauris eu risus.</li>',
            '</ul>'
        ].join('');
    }
};
