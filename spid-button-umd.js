(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['SPID'] = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['SPID'] = factory();
  }
}(this, function () {

var SPID = function() {
    "use strict";
    var loadStylesheet = function(url) {
        var linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.type = "text/css";
        linkElement.href = url;
        document.head.appendChild(linkElement);
    };
    var imageTag = function(imagePath, altText) {
        return [ '<img aria-hidden="true"', 'src="', SPID.assetsBaseUrl, imagePath, '.svg"', 'alt="', altText, '" style="float:left" />' ].join("");
    };
    var hiddenField = function(name, value) {
        return [ '<input type="hidden" name="', name, '" value="', value, '" />' ].join("");
    };
    var spidObj = function(config, providers) {
        this.config = config;
        this._providers = providers;
    };
    spidObj.prototype.changeLanguage = function(lang) {
        var _spid = this;
        _spid.config.lang = lang;
        _spid._render();
    };
    spidObj.prototype._showElement = function(dom) {
        dom.removeAttribute("hidden");
    };
    spidObj.prototype._hideElement = function(dom) {
        var hiddenAttribute = document.createAttribute("hidden");
        dom.setAttributeNode(hiddenAttribute);
    };
    spidObj.prototype._giveFocusTo = function(element) {
        var spid = this;
        var focusElement = setInterval(function() {
            element.focus();
        }, 100);
        element.addEventListener("focus", function() {
            clearInterval(focusElement);
        });
    };
    spidObj.prototype._handleEscKeyEvent = function(event) {
        var spid = this;
        if (event.keyCode === 27) {
            spid._hideProvidersPanel();
        }
    };
    var EscKeyHandler;
    spidObj.prototype._showProvidersPanel = function() {
        var spid = this;
        spid._btn.classList.add("spid-button-transition");
        spid._showElement(spid._wrapper);
        spid._giveFocusTo(spid._wrapper.querySelector(".spid-button-panel-select"));
        spid._wrapper.querySelector(".spid-button-logo").classList.add("spid-button-fade-in-left");
        spid._wrapper.querySelector(".spid-button-close-button").classList.add("spid-button-fade-in-left");
        spid._wrapper.querySelector(".spid-button-panel-select").classList.add("spid-button-panel-anim");
        spid._btn.querySelector(".spid-button-icon").classList.add("spid-button-icon-animation");
        spid._btn.querySelector(".spid-button-icon").classList.add("in");
        var providerButtons = spid._wrapper.querySelectorAll(".spid-button-idp");
        var delaySeconds = 1.1;
        providerButtons.forEach(function(btn) {
            btn.classList.add("spid-button-idp-fade-in");
            btn.setAttribute("style", "animation-delay: " + delaySeconds + "s");
            delaySeconds = delaySeconds + .1;
        });
        setTimeout(function() {
            spid._btn.classList.remove("spid-button-transition");
            spid._wrapper.querySelector(".spid-button-logo").classList.remove("spid-button-fade-in-left");
            spid._wrapper.querySelector(".spid-button-close-button").classList.remove("spid-button-fade-in-left");
            spid._wrapper.querySelector(".spid-button-panel-select").classList.remove("spid-button-panel-anim");
            providerButtons.forEach(function(btn) {
                btn.classList.remove("spid-button-idp-fade-in");
                btn.removeAttribute("style");
            });
        }, 2e3);
        EscKeyHandler = function(event) {
            spid._handleEscKeyEvent(event);
        };
        document.addEventListener("keyup", EscKeyHandler);
    };
    spidObj.prototype._hideProvidersPanel = function() {
        var spid = this;
        spid._hideElement(spid._wrapper);
        spid._btn.querySelector(".spid-button-icon").classList.remove("in");
        spid._wrapper.querySelector(".spid-button-little-man-icon").classList.add("spid-button-logo-animation-out");
        spid._wrapper.querySelector(".spid-button-panel-select").classList.add("spid-button-panel-anim");
        spid._btn.classList.remove("spid-button-transition");
        spid._btn.classList.add("spid-button-reverse-enter-transition");
        setTimeout(function() {
            spid._btn.classList.remove("spid-button-reverse-enter-transition");
            spid._wrapper.querySelector(".spid-button-little-man-icon").classList.remove("spid-button-logo-animation-out");
        }, 2e3);
        document.removeEventListener("keyup", EscKeyHandler);
        EscKeyHandler = null;
    };
    spidObj.prototype._render = function() {
        var spid = this;
        var placeholder = document.querySelector(spid.config.selector);
        if (!placeholder) {
            console.warn("Nessun placeholder HTML trovato nella pagina per i pulsanti SPID.");
            return;
        }
        placeholder.setAttribute("aria-live", "polite");
        placeholder.innerHTML = spid._renderButton();
        spid._btn = placeholder.querySelector(".spid-button");
        spid._btn.addEventListener("click", function(e) {
            spid._showProvidersPanel();
        });
        if (!spid._btn.querySelector(".spid-enter-container")) {
            loadStylesheet(SPID.stylesheetUrl);
            spid._wrapper = document.createElement("section");
            spid._wrapper.classList.add("spid-enter-container");
            spid._hideElement(spid._wrapper);
            placeholder.insertBefore(spid._wrapper, placeholder.firstChild);
            spid._wrapper.innerHTML = '<div class="spid-enter"></div>';
        }
        spid._wrapper.querySelector(".spid-enter").innerHTML = spid._renderProvidersChoiceModal();
        spid._wrapper.querySelector(".spid-button-panel-close-button").addEventListener("click", function(e) {
            spid._hideProvidersPanel();
        });
        spid._wrapper.querySelector(".spid-cancel-access-button").addEventListener("click", function(e) {
            spid._hideProvidersPanel();
        });
    };
    spidObj.prototype._getI18n = function(labelKey, placeholderValue) {
        var spid = this;
        var lang = spid.config.lang, copy = SPID.i18n[lang] && SPID.i18n[lang][labelKey], placeholderRegex = /\{\d}/;
        if (placeholderValue !== undefined) {
            copy = copy.replace(placeholderRegex, placeholderValue);
        }
        if (!copy) {
            console.error("La chiave richiesta non è disponibile nella lingua selezionata:", locale, labelKey);
        }
        return copy || labelKey;
    };
    spidObj.prototype._renderProvidersChoiceModal = function() {
        var spid = this;
        var imgPath = "img/spid-logo-animation-black.svg";
        var providerButtons = "";
        spid._providers.forEach(function(idp) {
            providerButtons += spid._renderProviderButton(idp);
        });
        return [ '<section class="spid-button-panel spid-button-panel-select" aria-label="', spid._getI18n("scegli_provider_SPID"), '" tabindex="0">', '<header class="spid-button-header">', '<div class="spid-button-panel-back">', '<div class="spid-button-logo spid-button-fade-out-left">', imageTag("img/spid-logo", spid._getI18n("alt_logo_SPID")), "</div>", '<div class="spid-button-close-button spid-button-fade-out-right">', '<button tabindex="0" class="spid-button-panel-close-button spid-button-navigable" aria-label="', spid._getI18n("naviga_indietro"), '">', imageTag("img/close", spid._getI18n("naviga_indietro")), "</button>", "</div>", "</div>", "</header>", '<div class="spid-button-panel-content">', '<img class="spid-button-little-man-icon" src="', SPID.assetsBaseUrl, imgPath, '" alt="', spid._getI18n("entra_con_SPID"), '"></img>', '<div class="spid-button-panel-content-center">', '<h1 class="spid-enter-title-page spid-button-fade-in-bottom spid-button-fade-out-bottom">', spid._getI18n("scegli_provider_SPID"), "</h1>", '<div class="spid-idp-list">', providerButtons, "</div>", '<div class="spid-non-hai-spid">', spid._getI18n("non_hai_SPID"), ' <a href="https://www.spid.gov.it/richiedi-spid" target="_blank">', spid._getI18n("scopri_di_piu"), "</a>", "</div>", "</div>", '<div class="spid-foot-btn">', '<button class="spid-cancel-access-button">', spid._getI18n("annulla_accesso"), "</button>", "</div>", "</div>", "</section>" ].join("");
    };
    spidObj.prototype._renderProviderButton = function(idp) {
        var spid = this;
        var isExtraProvider = false;
        spid.config.extraProviders.forEach(function(idp2) {
            if (idp.entityID == idp2.entityID) isExtraProvider = true;
        });
        var isActive = spid.config.supported.indexOf(idp.entityID) > -1 && idp.protocols.indexOf(spid.config.protocol) > -1 && (spid.config.extraProviders.length == 0 || isExtraProvider) && idp.active !== false;
        var linkTitle = isActive ? spid._getI18n("accedi_con_idp", idp.entityName) : spid._getI18n("idp_disabled");
        var entityID = idp.entityID in spid.config.mapping ? spid.config.mapping[idp.entityID] : idp.entityID;
        var actionURL = spid.config.url.replace("{{idp}}", encodeURIComponent(entityID));
        var buttonContent = idp.logo ? [ '<img src="', SPID.assetsBaseUrl, "img/idp-logos/", idp.logo, '" alt="', idp.entityName, '">' ].join("") : [ "<span>", idp.entityName, "</span>" ].join("");
        if (spid.config.method === "POST") {
            var inputs = hiddenField(spid.config.fieldName, entityID);
            for (var inputName in spid.config.extraFields) {
                inputs += hiddenField(inputName, spid.config.extraFields[inputName]);
            }
            return [ '<span class="spid-button-idp">', '<form action="', actionURL, '" method="POST">', '<button type="submit"', 'class="spid-button-idp-button"', 'title="', linkTitle, '"', isActive ? "" : "disabled", ">", buttonContent, "</button>", inputs, "</form>", "</span>" ].join("");
        } else if (spid.config.method === "GET") {
            return [ '<span class="spid-button-idp">', '<a title="', linkTitle, '" href="', actionURL, '"', isActive ? "" : "disabled", ">", buttonContent, "</a>", "</span>" ].join("");
        }
    };
    spidObj.prototype._renderButton = function() {
        var spid = this;
        var fluid = spid.config.fluid ? " spid-button-fluid " : "";
        var imgPath = spid.config.colorScheme == "negative" ? "img/spid-ico-circle-lb.svg" : "img/spid-ico-circle-bb.svg";
        return [ '<button class="spid-button spid-button-', spid.config.colorScheme, " spid-button-", spid.config.cornerStyle, " spid-button-size-", spid.config.size, fluid, '" hidden>', '<span aria-hidden="true" class="spid-button-icon">', '<img src="', SPID.assetsBaseUrl, imgPath, '" alt="', spid._getI18n("entra_con_SPID"), '" />', "</span>", '<span class="spid-button-text">', spid._getI18n("entra_con_SPID"), "</span>", "</button>" ].join("");
    };
    var defaults = {
        lang: "it",
        method: "GET",
        fieldName: "idp",
        extraFields: {},
        selector: "#spid-button",
        mapping: {},
        extraProviders: [],
        protocol: "SAML",
        size: "medium",
        colorScheme: "positive",
        fluid: false,
        cornerStyle: "rounded"
    };
    var supportedSizes = [ "small", "medium", "large" ], supportedColorScheme = [ "positive", "negative" ], supportedCornerStyle = [ "rounded", "sharp" ], supportedFluid = [ true, false ];
    return {
        init: function(config) {
            var error;
            if (typeof config !== "object" || config === null) {
                error = "Non è stata fornita la configurazione";
            } else {
                config = JSON.parse(JSON.stringify(config));
                for (var key in defaults) if (!(key in config)) config[key] = defaults[key];
                if (!config.url) {
                    error = "Non è stato fornito l'url obbligatorio in configurazione";
                } else if (config.method == "GET" && config.url.indexOf("{{idp}}") === -1) {
                    error = "L'url non contiene il placeholder {{idp}}";
                } else if (supportedSizes.indexOf(config.size) === -1) {
                    error = "Le dimensioni supportate sono " + supportedSizes + "; valore non valido:" + config.size;
                } else if (supportedColorScheme.indexOf(config.colorScheme) === -1) {
                    error = "I colori supportati sono " + supportedColorScheme + "; valore non valido:" + config.colorScheme;
                } else if (supportedCornerStyle.indexOf(config.cornerStyle) === -1) {
                    error = "Il valori supportati per il parametro cornerStyle sono " + supportedCornerStyle + "; valore non valido:" + config.cornerStyle;
                } else if (supportedFluid.indexOf(config.fluid) === -1) {
                    error = "I valori supportati per il parametro fluid sono " + supportedFluid + "; valore non valido:" + config.fluid;
                }
            }
            if (error) {
                console.error(error);
                return;
            }
            var providers = JSON.parse(JSON.stringify(SPID.providers));
            config.extraProviders.forEach(function(idp) {
                if (!("protocols" in idp)) idp.protocols = [ "SAML" ];
                providers.push(idp);
                config.supported.push(idp.entityID);
            });
            var spid = new spidObj(config, providers);
            spid._render();
            return spid;
        }
    };
}();

SPID.i18n = {
    it: {
        naviga_indietro: "Torna indietro",
        alt_logo_SPID: "Logo SPID",
        scegli_provider_SPID: "Scegli il tuo provider SPID",
        annulla_accesso: "Annulla",
        non_hai_SPID: "Non hai SPID?",
        cosa_SPID: "Cos'è SPID?",
        entra_con_SPID: "Entra con SPID",
        scopri_di_piu: "Scopri di più.",
        accedi_con_idp: "Accedi a SPID con {0}",
        idp_disabled: "Provider non attivo"
    },
    en: {
        naviga_indietro: "Go back",
        alt_logo_SPID: "SPID logo",
        scegli_provider_SPID: "Choose your SPID provider",
        annulla_accesso: "Cancel",
        non_hai_SPID: "Don't have SPID?",
        cosa_SPID: "What is SPID?",
        entra_con_SPID: "Sign in with SPID",
        scopri_di_piu: "Learn more.",
        accedi_con_idp: "Access to SPID with {0}",
        idp_disabled: "Provider not enabled"
    },
    de: {
        naviga_indietro: "Gehen Sie zurück",
        alt_logo_SPID: "SPID Logo",
        scegli_provider_SPID: "Wähle Ihren SPIDProvider",
        annulla_accesso: "Zurücknehmen",
        non_hai_SPID: "Haben Sie nicht SPID?",
        cosa_SPID: "Was ist SPID?",
        entra_con_SPID: "Loggen Sie mit SPID",
        scopri_di_piu: "Finde mehr heraus.",
        accedi_con_idp: "Zugriff auf SPID mit {0}",
        idp_disabled: "Provider nicht aktiviert"
    }
};

SPID.providers = [ {
    protocols: [ "SAML" ],
    entityName: "Aruba ID",
    logo: "spid-idp-arubaid.svg",
    entityID: "https://loginspid.aruba.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Infocert ",
    logo: "spid-idp-infocertid.svg",
    entityID: "https://identity.infocert.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Poste ID",
    logo: "spid-idp-posteid.svg",
    entityID: "https://posteid.poste.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Sielte",
    logo: "spid-idp-sielteid.svg",
    entityID: "https://identity.sieltecloud.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Tim ID",
    logo: "spid-idp-timid.svg",
    entityID: "https://login.id.tim.it/affwebservices/public/saml2sso",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Namirial ID",
    logo: "spid-idp-namirialid.svg",
    entityID: "https://idp.namirialtsp.com/idp",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "SPIDItalia Register.it",
    logo: "spid-idp-spiditalia.svg",
    entityID: "https://spid.register.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Intesa ID",
    logo: "spid-idp-intesaid.svg",
    entityID: "https://spid.intesa.it",
    active: true
}, {
    protocols: [ "SAML" ],
    entityName: "Lepida ID",
    logo: "spid-idp-lepidaid.svg",
    entityID: "https://id.lepida.it/idp/shibboleth",
    active: true
} ];

SPID.assetsBaseUrl = "https://italia.github.io/spid-smart-button/";

SPID.stylesheetUrl = "https://italia.github.io/spid-smart-button/spid-button.min.css";
return SPID;

}));
