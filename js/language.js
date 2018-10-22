Ext.define('DESKTOP.config.language', {
    singleton: true,
    base: "ENG",
    detect: "",
    current: "",
    autoDetect: true,
    support: {},
    loadFile: function (languageIndex) {
        var me = this;
        if (typeof me.support[languageIndex] === 'undefined') {
            return;
        }
        var filename = Ext.String.format("js/language/{0}.json", languageIndex);
        me.current = languageIndex;
        me[me.current] = loadJSON(filename);
        me.loadExtLocale(me.support[languageIndex]["ext-locale"]);
    },
    loadExtLocale: function (localeIndex) {
        var filename = Ext.String.format("js/ext/ext-locale/ext-locale-{0}.js", localeIndex);
        Ext.Loader.loadScript({
            url: filename,
            scope: this
        });
    }
});

function qLanguageDisplay(key, str, param) {
    if (typeof key == "undefined") {
        return false;
    }
    key = key || '';
    str = str || '';
    param = param || [];
    var keyStr = '';
    var output = '';
    if (typeof DESKTOP.config.language[DESKTOP.config.language.current][key] !== "undefined") {
        keyStr = DESKTOP.config.language[DESKTOP.config.language.current][key];
        if (param.length === 0) {
            output = keyStr;
        } else {
            output = Ext.String.qFormat(keyStr, param);
        }
    } else {
        output = str;
    }
    // console.log('qLanguageDisplay()', "|language:", DESKTOP.config.language.current, "|key:", key, "|str:", str, "|param:", param, "|keyStr:", keyStr, "|output:", output);
    return output;
}

function qLanguage_getHttpHeader() {
    var httpHeader = loadJSON("http_header.php");
    // console.log("httpHeader", httpHeader);
    return httpHeader;
}

/**
 * How to detect a user's language
 * The best way to detect a user's preferred language is the analyze the Accept-Language header.
 * Parse the 'Accept-Language' header (server-side only)
 * source: https://localizejs.com/questions/integrating/detect-languages
 *
 * var acceptLanguage = 'Accept-Language: en;q=0.8,es;q=0.6,fr;q=0.4';
 * var languages = acceptLanguage.match(/[a-zA-z\-]{2,10}/g) || [];
 * console.log(languages); // ['en', 'es', 'fr']
 */
function qLanguage_getPreferLanguages() {
    var httpHeader = qLanguage_getHttpHeader();
    var acceptLanguage = httpHeader.HTTP_ACCEPT_LANGUAGE;
    var preferLanguages = acceptLanguage.match(/[a-zA-z\-]{2,10}/g) || [];
    return preferLanguages;
}

function displayCookiesInfo() {
    var cookies = docCookies.keys();
    for (var i in cookies) {
        console.log(Ext.String.format("[{0}] = {1}, getItem = {2}", i, cookies[i], docCookies.getItem(cookies[i])));
    }
}
/* load list of supported language */
DESKTOP.config.language.support = loadJSON("js/language/support.json");

/* get prefer languages from HTTP header */
var preferLanguages = qLanguage_getPreferLanguages();

/* determine the current language by list of prefered language */
for (var i in DESKTOP.config.language.support) {
    var supportKey = i;
    var supportValue = DESKTOP.config.language.support[i];
    var preferLanguage = preferLanguages[0].toLowerCase();
    var supportLanguage = supportValue.browserLanguage;
    if (strncmp(preferLanguage, supportLanguage, 2) === 0) {
        DESKTOP.config.language.current = DESKTOP.config.language.detect = supportKey;
        if (strcmp(preferLanguage, supportLanguage) === 0) {
            break;
        }
    }
}

/* set language as default language if no language match */
if (DESKTOP.config.language.current === "") {
    DESKTOP.config.language.current = DESKTOP.config.language.base;
}

/* check whether a cookie "client_language" exists. true: set autoDetect as false, set current language as value of client_language */
if (docCookies.hasItem('client_language')) {
    DESKTOP.config.language.autoDetect = false;
    DESKTOP.config.language.current = docCookies.getItem('client_language');
}

/* load language file by config DESKTOP.config.language.current */
// DESKTOP.config.language.loadFile(DESKTOP.config.language.current);
/* TODO: it will be removed/restored, for beta version only. */
DESKTOP.config.language.loadFile("ENG");
