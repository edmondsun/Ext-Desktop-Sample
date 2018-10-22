Ext.define('DESKTOP.ux.button.Button', {
    override: 'Ext.button.Button',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false,
        /**
         * qLanguage: Object, key/str for multi-language
         * default: {}
         */
        qLanguage: {},
        /**
         * buttonType: 'default'/'primary'/'cancel'
         * default: 'default'
         */
        buttonType: '',
        /**
         * buttonLocation: 'default'/'common'/toolbar'
         * default: 'default'
         */
        buttonLocation: '',
        /**
         * indentLevel: Integer
         * default: 0
         */
        indentLevel: 0
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_button');
        // Ext.apply(me, {});
        var defaultConfig = {
            buttonType: 'default',
            buttonLocation: 'default'
        };
        var initialConfig = me.getInitialConfig();
        var realConfig = {
            buttonType: (initialConfig.buttonType.length > 0) ? initialConfig.buttonType : defaultConfig.buttonType,
            buttonLocation: (initialConfig.buttonLocation.length > 0) ? initialConfig.buttonLocation : defaultConfig.buttonLocation
        };
        me.setButtonType(realConfig.buttonType);
        me.setButtonLocation(realConfig.buttonLocation);
    },
    applyButtonType: function (value) {
        var me = this;
        switch (value) {
        case 'primary':
            Ext.apply(me, {
                cls: 'q-btn-primary'
            });
            break;
        case 'cancel':
            Ext.apply(me, {
                cls: 'q-btn-cancel'
            });
            break;
        case 'default':
            Ext.apply(me, {
                cls: 'q-btn-default'
            });
            break;
        default:
            break;
        }
    },
    // TODO: apply minWidth by css?
    applyButtonLocation: function (value) {
        var me = this;
        switch (value) {
        case 'default':
            break;
        case 'common':
            me.setMinWidth(80);
            break;
        case 'toolbar':
            me.setWidth(24);
            break;
        default:
            break;
        }
    },
    applyIndentLevel: function (value) {
        if (value === 0) {
            return;
        }
        Ext.apply(this, {
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 25 * value
            }
        });
    },
    updateQLanguage: function (value) {
        var me = this;
        var language = (typeof DESKTOP.config !== 'undefined') ? DESKTOP.config.language.current : 'EN';
        me.convertLanguageString(language);
    },
    qLanguageFn: function (language) {
        var me = this;
        me.convertLanguageString(language);
    },
    convertLanguageString: function (currentLanguage) {
        var me = this;
        var lang = '';
        Ext.Object.each(me.qLanguage, function (key, value) {
            lang = DESKTOP.config.language[currentLanguage][value.key] || value.str;
            switch (key) {
            case 'text':
                me.setText(lang);
                break;
            case '':
                break;
            default:
                break;
            }
        });
    }
});
