window.AgidSpidEnter.prototype.tpl = {
    spidMainContainers: () => `
        <div id="agid-spid-enter"></div>
        <div id="agid-infomodal" class="modal" aria-live="assertive" tabindex="0" hidden></div>
    `,

    svgWithPngFallback: function (imagePath, altText) {
        return `
            <img aria-hidden="true"
                src="${this.config.assetsBaseUrl}${imagePath}.svg"
                onerror="this.src='${this.config.assetsBaseUrl}${imagePath}.png'; this.onerror=null;"
                alt="${altText}" />
        `;
    },

    spidProviderChoiceModal: function (spidProvidersButtons) {
        return `
            <div id="agid-spid-enter-anim"></div>
            <section id="agid-spid-panel-select" aria-labelledby="agid-spid-enter-title-page" tabindex="0">
                <header id="agid-spid-panel-header">
                    <nav class="agid-spid-panel-back agid-spid-panel-element" aria-controls="agid-spid-panel-select">
                        <button tabindex="0" id="agid-spid-panel-close-button" class="agid-spid-button agid-navigable" aria-labelledby="agid-cancel-access-button">
                            ${this.tpl.svgWithPngFallback.call(this, 'img/x-icon', this.getI18n('naviga_indietro'))}
                        </button>
                    </nav>
                    <div class="agid-spid-panel-logo agid-spid-panel-element">
                        ${this.tpl.svgWithPngFallback.call(this, 'img/spid-logo-c-lb', this.getI18n('alt_logo_SPID'))}
                    </div>
                </header>
                <div id="agid-spid-panel-content">
                    <div class="agid-spid-panel-content-center">
                        <div id ="agid-spid-enter-title-container">
                            <h1 id="agid-spid-enter-title-page" class="agid-font">${this.getI18n('scegli_provider_SPID')}</h1>
                        </div>
                        <div id="agid-spid-idp-list" class="agid-spid-row">
                            ${spidProvidersButtons}
                        </div>
                        <div id="agid-cancel-access-container">
                            <button id="agid-cancel-access-button" class="agid-transparent-button agid-font agid-navigable">
                                <span>${this.getI18n('annulla_accesso')}</span>
                            </button>
                        </div>
                        <div id="agid-logo-container" aria-hidden="true">
                            ${this.tpl.svgWithPngFallback.call(this, 'img/agid-logo-bb-short')}
                        </div>
                    </div>
                </div>
                <footer id="agid-spid-panel-footer">
                    <div id="agid-action-button-container">
                        <button id="nospid" class="agid-action-button agid-font agid-navigable">
                            <span>${this.getI18n('non_hai_SPID')}</span>
                        </button>
                        <button id="cosaspid" class="agid-action-button agid-font agid-navigable">
                            <span>${this.getI18n('cosa_SPID')}</span>
                        </button>
                    </div>
                </footer>
            </section>
        `;
    },

    hiddenField: (name, value) => `<input type="hidden" name="${name}" value="${value}" />`,

    spidProviderButton: function (providerData) {
        const { isActive, title, payload, provider, logo } = providerData;
        const providerTitle = (isActive) ? this.getI18n('accedi_con_idp', title) : this.getI18n('idp_disabled');
        let providerHiddenName = 'provider';
        let providerPayloadInputs = '';

        // Crea gli input field chiave=valore dall'oggetto
        if (payload) {
            // Imposta il name dell'identity provider o fallback su un default
            providerHiddenName = payload.providerHiddenName || providerHiddenName;
            delete payload.providerHiddenName;

            providerPayloadInputs += this.tpl.hiddenField(providerHiddenName, provider);

            for (let property in payload) {
                providerPayloadInputs += this.tpl.hiddenField(property, payload[property]);
            }
        }

        return `
            <span class="agid-spid-col l3 m6 s6 xs12">
                <form id="agid-spid-provider-${provider}"
                    action="${this.formActionUrl}" method="${this.formSubmitMethod}">
                    <button type="submit"
                        class="agid-spid-idp-button agid-spid-idp-${provider}"
                        title="${providerTitle}"
                        style="background-image: url('${this.config.assetsBaseUrl}img/idp-logos/${logo}')"
                        ${(isActive) ? '' : 'disabled'}>
                    </button>
                    ${providerPayloadInputs}
                </form>
            </span>
        `;
    },

    spidButton: function (sizeClass) {
        return `
            <!-- AGID - SPID BUTTON ${sizeClass.toUpperCase()} * begin * -->
            <button class="agid-spid-enter agid-font agid-spid-enter-size-${sizeClass}" hidden>
                <span aria-hidden="true" class="agid-spid-enter-icon">
                        ${this.tpl.svgWithPngFallback.call(this, 'img/spid-ico-circle-bb', this.getI18n('entra_con_SPID'))}
                </span>
                <span class="agid-spid-enter-text">${this.getI18n('entra_con_SPID')}</span>
            </button>
            <!-- AGID - SPID BUTTON ${sizeClass.toUpperCase()} * end * -->
        `;
    },

    infoModalContent: function (htmlContent) {
        return `
            <div class="modal-content agid-font">
                <button id="closemodalbutton"
                    class="close agid-navigable"
                    tabindex="0"
                    aria-label="${this.getI18n('aria_chiudi_modale')}">
                    <b aria-hidden="true">&times;</b>
                </button>
                <div id="agid-infomodal-content" role="main" tabindex="0" aria-labelledby="agid-infomodal-title">
                    ${htmlContent}
                </div>
            </div>
        `;
    },

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    nonHaiSpid: () => `
        <h1 id="agid-infomodal-title">Non hai Spid?</h1>
        <ul>
            <li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.
            Sed arcu. Cras consequat.</li>
            <li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
            Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li>
            <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.
            Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li>
            <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li>
        </ul>    
    `,

    // Fake content, Lipsum HTML, rimpiazzare con contenuti/etichette reali
    cosaSpid: () => `
        <h1 id="agid-infomodal-title">Cosa è SPID</h1>
        <p>
            <strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas.
            Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
            Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo.
            Quisque sit amet est et sapien ullamcorper pharetra.
            Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi.
            Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.
            <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.
        </p>
        <h2>Header Level 2</h2>
        <ol>
            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
            <li>Aliquam tincidunt mauris eu risus.</li>
        </ol>
        <blockquote>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida.
            Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p>
        </blockquote>
        <h3>Header Level 3</h3>
        <ul>
            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
            <li>Aliquam tincidunt mauris eu risus.</li>
        </ul>
    `
};
