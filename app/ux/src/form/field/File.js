Ext.define('DESKTOP.ux.form.field.File', {
    override: 'Ext.form.field.File',
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
         * customType: ''/file'
         * default: ''
         */
        customType: '',
        /**
         * labelFontWeight: 'default'/'bold'
         * default: 'default'
         */
        labelFontWeight: '',
        /**
         * labelFontColor: 'default'/'title'
         * default: 'default'
         */
        labelFontColor: '',
        /**
         * textStyle: ''
         * default: ''
         * [description] Apply text styles using labelFontWeight and labelFontColor.
         */
        textStyle: '',
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
        me.addCls('qsan_filefield');
        Ext.apply(me, {
            labelWidth: 'auto',
            labelSeparator: ''
        });
        var defaultConfig = {
            labelFontWeight: 'default',
            labelFontColor: 'default'
        };
        var initialConfig = me.getInitialConfig();
        var realConfig = {
            labelFontWeight: (initialConfig.labelFontWeight.length > 0) ? initialConfig.labelFontWeight : defaultConfig.labelFontWeight,
            labelFontColor: (initialConfig.labelFontColor.length > 0) ? initialConfig.labelFontColor : defaultConfig.labelFontColor
        };
        me.setLabelFontWeight(realConfig.labelFontWeight);
        me.setLabelFontColor(realConfig.labelFontColor);
    },
    applyCustomType: function (value) {
        switch (value) {
        case 'file':
            Ext.apply(this, {
                buttonConfig: {
                    text: '',
                    cls: 'q-filefield-icon'
                }
            });
            break;
        case '':
            break;
        default:
            break;
        }
    },
    applyTextStyle: function (value) {
        var me = this;
        var labelFontWeight = me.getLabelFontWeight();
        var labelFontColor = me.getLabelFontColor();
        var cls_arr = [];
        switch (labelFontWeight) {
        case 'bold':
            cls_arr.push('q-displayfield-fontweight-bold');
            break;
        case 'default':
            cls_arr.push('q-displayfield-fontweight-default');
            break;
        default:
            break;
        }
        switch (labelFontColor) {
        case 'title':
            cls_arr.push('q-displayfield-color-title');
            break;
        case 'default':
            cls_arr.push('q-displayfield-color-default');
            break;
        default:
            break;
        }
        if (me.getFieldLabel().length !== 0) {
            Ext.apply(me, {
                labelCls: cls_arr.join(' ')
            });
        }
    },
    applyIndentLevel: function (value) {
        var me = this;
        if (value === 0) {
            return;
        }
        Ext.apply(me, {
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
            case 'fieldLabel':
                me.setFieldLabel(lang);
                break;
            case '':
                break;
            default:
                break;
            }
        });
    }
});