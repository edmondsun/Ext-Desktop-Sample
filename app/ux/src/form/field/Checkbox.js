Ext.define('DESKTOP.ux.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
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
        me.addCls('qsan_checkboxfield');
        Ext.apply(me, {
            labelWidth: 'auto'
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
    applyTextStyle: function (value) {
        var me = this;
        var labelFontWeight = me.getLabelFontWeight();
        var labelFontColor = me.getLabelFontColor();
        var cls_arr = [];
        switch (labelFontWeight) {
        case 'bold':
            cls_arr.push('q-checkbox-fontweight-bold');
            break;
        case 'default':
            cls_arr.push('q-checkbox-fontweight-default');
            break;
        default:
            break;
        }
        switch (labelFontColor) {
        case 'title':
            cls_arr.push('q-checkbox-color-title');
            break;
        case 'default':
            cls_arr.push('q-checkbox-color-default');
            break;
        default:
            break;
        }
        me.addCls(cls_arr.join(' '));
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
            case 'boxLabel':
                me.setBoxLabel(lang);
                break;
            case '':
                break;
            default:
                break;
            }
        });
    }
});
