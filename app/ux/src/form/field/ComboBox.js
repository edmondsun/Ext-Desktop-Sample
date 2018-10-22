Ext.define('DESKTOP.ux.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
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
         * qLanguageStore: Boolean
         * default: false
         */
        qLanguageStore: false,
        /**
         * comboboxType: 'default'/'primary'
         * default: 'default'
         */
        comboboxType: '',
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
         * labelTextStyle: ''
         * default: ''
         * [description] Apply text styles using labelFontWeight and labelFontColor.
         */
        labelTextStyle: '',
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
        me.addCls('qsan_combobox');
        Ext.apply(me, {
            labelWidth: 'auto',
            labelSeparator: '',
            listConfig: {
                style: {
                    borderTop: '1px solid transparent',
                    backgroundClip: 'padding-box'
                }
            }
        });
        var defaultConfig = {
            comboboxType: 'default',
            labelFontWeight: 'default',
            labelFontColor: 'default'
        };
        var initialConfig = me.getInitialConfig();
        var realConfig = {
            comboboxType: (initialConfig.comboboxType.length > 0) ? initialConfig.comboboxType : defaultConfig.comboboxType,
            labelFontWeight: (initialConfig.labelFontWeight.length > 0) ? initialConfig.labelFontWeight : defaultConfig.labelFontWeight,
            labelFontColor: (initialConfig.labelFontColor.length > 0) ? initialConfig.labelFontColor : defaultConfig.labelFontColor
        };
        me.setComboboxType(realConfig.comboboxType);
        me.setLabelFontWeight(realConfig.labelFontWeight);
        me.setLabelFontColor(realConfig.labelFontColor);
    },
    applyComboboxType: function (value) {
        var me = this;
        switch (value) {
        case 'primary':
            me.addCls('q-combobox-primary');
            break;
        case 'default':
            me.addCls('q-combobox-default');
            break;
        default:
            break;
        }
    },
    applyLabelTextStyle: function (value) {
        var me = this;
        var labelFontWeight = me.getLabelFontWeight();
        var labelFontColor = me.getLabelFontColor();
        var cls_arr = [];
        switch (labelFontWeight) {
        case 'bold':
            cls_arr.push('q-label-fontweight-bold');
            break;
        case 'default':
            cls_arr.push('q-label-fontweight-default');
            break;
        default:
            break;
        }
        switch (labelFontColor) {
        case 'title':
            cls_arr.push('q-label-color-title');
            break;
        case 'default':
            cls_arr.push('q-label-color-default');
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
            case 'emptyText':
                me.emptyText = lang;
                me.applyEmptyText();
                break;
            default:
                break;
            }
        });
        if (me.getQLanguageStore() === true && typeof me.qLanguageStoreFn === 'function') {
            me.qLanguageStoreFn(currentLanguage);
        }
    }
});
