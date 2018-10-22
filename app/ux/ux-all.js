Ext.define('DESKTOP.ux.ProgressBar', {
    override: 'Ext.ProgressBar',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false,
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
        me.addCls('qsan_progressbar');
        // Ext.apply(me, {});
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
    }
});

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

Ext.define('DESKTOP.ux.container.Container', {
    override: 'Ext.container.Container',
    config: {
        defaultComponentHeight: 36, //36
        defaultSplitterHeight: 18, //18
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false,
        /**
         * customLayout: 'vlayout'/'hlayout'/'splitter'
         * default: false
         */
        customLayout: ''
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_container');
        Ext.apply(me, {
            width: '100%',
            /* obejct: elements */
            defaults: {
                margin: '0 8 0 0'
                    // style: 'border:1px #00f solid;'
            }
        });
    },
    applyCustomLayout: function (value) {
        var me = this;
        switch (value) {
        case 'vlayout':
            Ext.apply(me, {
                layout: {
                    type: 'vbox',
                    align: 'left'
                }
            });
            break;
        case 'hlayout':
            Ext.apply(me, {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                minHeight: me.getInitialConfig().defaultComponentHeight
            });
            break;
        case 'splitter':
            Ext.apply(me, {
                height: me.getInitialConfig().defaultSplitterHeight
            });
            break;
        default:
            break;
        }
    }
});

Ext.define('DESKTOP.ux.data.Store', {
    override: 'Ext.data.Store',
    /**
     * needOnLoad: Boolean
     * default: false
     * [description] determine if a store must be fully loaded done
     */
    needOnLoad: false
});

Ext.define('DESKTOP.ux.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_checkboxgroup');
        // Ext.apply(me, {});
    }
});

Ext.define('DESKTOP.ux.form.FieldContainer', {
    override: 'Ext.form.FieldContainer',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_fieldcontainer');
        // Ext.apply(me, {});
    }
});

Ext.define('DESKTOP.ux.form.Label', {
    override: 'Ext.form.Label',
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
         * qAlign: Boolean, for aligned form labels
         * default: false
         */
        qAlign: false,
        /**
         * qAlignWidth: Integer
         * default: 0
         */
        qAlignWidth: 0,
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
        me.addCls('qsan_label');
        Ext.apply(me, {
            width: 'auto'
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
    // TODO: qAlign, qAlignWidth > design/test
    applyQAlign: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        // Ext.apply(me, {});
    },
    applyTextStyle: function (value) {
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
    // TODO: test Ext.String.qFormat for string/array
    convertLanguageString: function (currentLanguage) {
        var me = this;
        var lang = '';
        Ext.Object.each(me.qLanguage, function (key, value) {
            lang = DESKTOP.config.language[currentLanguage][value.key] || value.str;
            // if (Object.keys(value).length > 2 && typeof value.param !== "undefined") {
            // var tmp = value.param;
            // console.log( "ux label - key, value", key, value);
            // console.log("before Ext.String.qFormat: " , lang, " ", "param: ", tmp);
            // console.log("after  Ext.String.qFormat: " , Ext.String.qFormat(lang, tmp));
            // }
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

Ext.define('DESKTOP.ux.form.Panel', {
    override: 'Ext.form.Panel',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_form');
        // Ext.apply(me, {});
    }
});

Ext.define('DESKTOP.ux.form.RadioGroup', {
    override: 'Ext.form.RadioGroup',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_radiogroup');
        // Ext.apply(me, {});
    }
});

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

Ext.define('DESKTOP.ux.form.field.Date', {
    override: 'Ext.form.field.Date',
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
        me.addCls('qsan_datefield');
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
    applyTextStyle: function (value) {
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

Ext.define('DESKTOP.ux.form.field.Display', {
    override: 'Ext.form.field.Display',
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
        me.addCls('qsan_displayfield');
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

Ext.define('DESKTOP.ux.form.field.Number', {
    override: 'Ext.form.field.Number',
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
        me.addCls('qsan_numberfield');
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
    applyTextStyle: function (value) {
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
            case '':
                break;
            default:
                break;
            }
        });
    }
});

Ext.define('DESKTOP.ux.form.field.Radio', {
    override: 'Ext.form.field.Radio',
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
        me.addCls('qsan_radio');
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
        me.addCls(cls_arr.join(' '));
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

Ext.define('DESKTOP.ux.form.field.Text', {
    override: 'Ext.form.field.Text',
    /* patch for native component */
    initEvents: function () {
        var me = this,
            el = me.inputEl;
        me.callParent();
        if (me.selectOnFocus || me.emptyText) {
            me.mon(el, 'mousedown', me.onMouseDown, me);
        }
        if (me.maskRe || (me.vtype && me.disableKeyFilter !== true && (me.maskRe = Ext.form.field.VTypes[me.vtype + 'Mask']))) {
            me.mon(el, 'keypress', me.filterKeys, me);
        }
        if (me.enableKeyEvents) {
            me.mon(el, {
                scope: me,
                keyup: me.onKeyUp,
                keydown: me.onKeyDown,
                keypress: me.onKeyPress,
                /* patch */
                input: me.onInput
            });
        }
    },
    /* patch */
    onInput: function (e) {
        this.fireEvent('input', this, e);
    },
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
        me.addCls('qsan_textfield');
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
    applyTextStyle: function (value) {
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
                Ext.apply(me, {
                    emptyText: lang
                });
                break;
            case 'regexText':
                Ext.apply(me, {
                    regexText: lang
                });
                break;
            default:
                break;
            }
        });
    }
});

Ext.define('DESKTOP.ux.form.field.TextArea', {
    override: 'Ext.form.field.TextArea',
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
        me.addCls('qsan_textareafield');
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
    applyTextStyle: function (value) {
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

Ext.define('DESKTOP.ux.grid.Panel', {
    override: 'Ext.grid.Panel',
    /* [start] default config */
    // columns: {
    // defaults: {
    // menuDisabled: true
    // }
    // },
    // menuDisabled: true,
    // enableColumnHide: true,
    /* [end] default config */
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false,
        /**
         * indentLevel: Integer
         * default: 0
         */
        indentLevel: 0
    },
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_gridpanel');
        // Ext.apply(me, {});
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
    }
});

Ext.define('DESKTOP.ux.grid.column.Check', {
    override: 'Ext.grid.column.Check',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_checkcolumn');
        // Ext.apply(me, {});
    }
});

Ext.define('DESKTOP.ux.menu.Item', {
    override: 'Ext.menu.Item',
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
        qLanguage: {}
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_menuitem');
        // Ext.apply(me, {});
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

/**
 * [extend description]
 * Progressbar + Multislider
 */
Ext.define('DESKTOP.ux.qcustomize.ProgressbarMultislider', {
    extend: 'Ext.container.Container',
    alias: 'widget.progressbarmultislider',
    cls: 'qsan_progressbarmultislider',
    /* [start] default config */
    padding: '5 0 5 0',
    layout: 'fit',
    width: 200,
    /* [end] default config */
    config: {
        progressbarConfig: {},
        multisliderConfig: {}
    },
    applyProgressbarConfig: function (value) {
        var me = this;
        me.appendConfig(value, 'progressbar');
    },
    applyMultisliderConfig: function (value) {
        var me = this;
        me.appendConfig(value, 'multislider');
    },
    appendConfig: function (value, xtype) {
        var me = this;
        Ext.Object.each(me.items, function (key, item) {
            if (item.xtype == xtype) {
                Ext.apply(item, value);
                return false;
            }
        });
    },
    items: [{
        xtype: 'progressbar',
        x: 0,
        y: 0,
        width: '100%',
        textEl: ''
    }, {
        xtype: 'multislider',
        x: 0,
        y: 0,
        width: '100%',
        values: [0, 100],
        minValue: 0,
        maxValue: 100,
        margin: '-20 0 0 0'
    }]
});

/**
 * Ext.String.qFormat
 * [1] for String: Ext.String.qFormat(str, param1, param2, ...);
 * usage: Ext.String.qFormat("Hello. My name is {0} {1}.", "FirstName", "LastName");
 * output: Hello. My name is FirstName LastName.
 * [2] for Array: Ext.String.qFormat(str, [param1, param2, ...]);
 * usage: Ext.String.qFormat("Hello. My name is {0} {1}.", ["FirstName", "LastName"]);
 * output: Hello. My name is FirstName LastName.
 */
Ext.String.qFormat = function () {
    var theString = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
            var param = arguments[i];
            for (var j = 0; j < param.length; j++) {
                theString = convertString(theString, j, param[j]);
            }
            break;
        } else {
            theString = convertString(theString, i - 1, arguments[i]);
        }
    }
    return theString;

    function convertString(formatString, order, string) {
        var regEx = new RegExp('({)?\\{' + order + '\\}(?!})', 'gm');
        return formatString.replace(regEx, string);
    }
};

/**
 * [extend description]
 * qConstrainHeader: support component dragging overflow container
 */
Ext.define('DESKTOP.ux.util.ComponentDragger', {
    extend: 'Ext.util.ComponentDragger',
    /* copy from Ext.dd.DragTracker */
    constrainModes: {
        point: function (me, xy) {
            var dr = me.dragRegion,
                constrainTo = me.getConstrainRegion();
            if (!constrainTo) {
                return xy;
            }
            dr.x = dr.left = dr[0] = dr.right = xy[0];
            dr.y = dr.top = dr[1] = dr.bottom = xy[1];
            dr.constrainTo(constrainTo);
            return [dr.left, dr.top];
        },
        dragTarget: function (me, xy) {
            var s = me.startXY,
                dr = me.startRegion.copy(),
                constrainTo = me.getConstrainRegion(),
                adjust;
            /* qConstrainHeader: mininum visible width */
            var qAdjust = 40;
            if (!constrainTo) {
                return xy;
            }
            dr.translateBy(xy[0] - s[0], xy[1] - s[1]);
            /* qConstrainHeader: patch for dragging to right-hand-side of container */
            if (constrainTo.right - dr.left < qAdjust) {
                adjust = qAdjust - (constrainTo.right - dr.left);
                xy[0] += -adjust;
                dr.left += -adjust;
            }
            /* qConstrainHeader: patch for dragging to left-hand-side of container */
            if (constrainTo.left - dr.right > -qAdjust) {
                adjust = qAdjust + (constrainTo.left - dr.right);
                xy[0] += adjust;
            }
            if (dr.bottom > constrainTo.bottom) {
                xy[1] += adjust = (constrainTo.bottom - dr.bottom);
                dr.top += adjust;
            }
            if (dr.top < constrainTo.top) {
                xy[1] += (constrainTo.top - dr.top);
            }
            return xy;
        }
    }
});

/**
 * [extend description]
 */
Ext.define('DESKTOP.ux.qcustomize.window.MainWindow', {
    extend: 'Ext.window.Window',
    renderTo: 'windowContainer',
    focusOnToFront: false,
    constrainHeader: true,
    monitorOnWinMgr: true,
    config: {
        /**
         * qConstrainHeader: Boolean
         * default: false
         * description: support component dragging overflow container
         */
        qConstrainHeader: true,
        /**
         * qIsMasked: Boolean
         * default: false
         * description: [true] open the child window and mask the parent window
         */
        qIsMasked: false
    },
    /* copy from Ext.Component */
    beforeSetPosition: function (x, y, animate) {
        var me = this,
            pos = null,
            x0, hasX, hasY, adj;
        if (x) {
            if (Ext.isNumber(x0 = x[0])) {
                animate = y;
                y = x[1];
                x = x0;
            } else if ((x0 = x.x) !== undefined) {
                animate = y;
                y = x.y;
                x = x0;
            }
        }
        if (me.constrain || me.constrainHeader) {
            pos = me.calculateConstrainedPosition(null, [
                x,
                y
            ], true);
            if (pos) {
                if (me.qConstrainHeader !== true) {
                    x = pos[0];
                }
                y = pos[1];
            }
        }
        hasX = (x !== undefined);
        hasY = (y !== undefined);
        if (hasX || hasY) {
            me.x = x;
            me.y = y;
            adj = me.adjustPosition(x, y);
            pos = {
                x: adj.x,
                y: adj.y,
                anim: animate,
                hasX: hasX,
                hasY: hasY
            };
        }
        return pos;
    },
    privates: {
        initDraggable: function () {
            this.initSimpleDraggable();
        },
        initSimpleDraggable: function () {
            var me = this,
                ddConfig, dd;
            if (!me.header) {
                me.updateHeader(true);
            }
            if (me.header) {
                ddConfig = Ext.applyIf({
                    el: me.el,
                    delegate: '#' + me.header.id
                }, me.draggable);
                if (me.constrain || me.constrainHeader) {
                    ddConfig.constrain = me.constrain;
                    ddConfig.constrainDelegate = me.constrainHeader;
                    ddConfig.constrainTo = me.constrainTo || me.container;
                }
                /* qConstrainHeader */
                if (me.qConstrainHeader === true) {
                    dd = me.dd = new DESKTOP.ux.util.ComponentDragger(me, ddConfig);
                } else {
                    dd = me.dd = new Ext.util.ComponentDragger(me, ddConfig);
                }
                me.relayEvents(dd, ['dragstart', 'drag', 'dragend']);
                if (me.maximized) {
                    dd.disable();
                }
            }
        },
        onHeaderClick: function (header, e) {
            var delegate;
            if (header.el.contains(e.getTarget())) {
                delegate = this.getDefaultFocus();
                if (delegate) {
                    delegate.focus();
                }
            }
        },
        initResizable: function () {
            this.callParent(arguments);
            if (this.maximized) {
                this.resizer.disable();
            }
        }
    }
});

/**
 * [extend description]
 */
Ext.define('DESKTOP.ux.qcustomize.window.SubWindow', {
    extend: 'DESKTOP.ux.qcustomize.window.MainWindow',
    alias: 'widget.subwindow',
    cls: 'qsan_subwindow',
    /* [start] default config */
    bodyPadding: 20,
    closable: false,
    resizable: false,
    header: {
        titleAlign: "center"
    },
    /* [end] default config */
    config: {
        /**
         * parentMask: Boolean
         * default: false
         * description: [true] support parent/child window mask mechiasm
         */
        parentMask: false
    },
    listeners: {
        beforerender: function (me) {
            me.handleParentWindowMask(true);
        },
        destroy: function (me) {
            me.handleParentWindowMask(false);
        }
    },
    handleParentWindowMask: function (isMask) {
        var me = this,
            parentWindow = Ext.getCmp(me.parentWindowId);
        if (me.getParentMask() === false) {
            return false;
        }
        Ext.apply(parentWindow, {
            qIsMasked: isMask
        });
        if (isMask) {
            parentWindow.getController().showLoadingMask(false);
        } else {
            parentWindow.getController().hideLoadingMask();
        }
    }
});

Ext.define('DESKTOP.ux.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
    config: {
        /**
         * qDefault: Boolean
         * default: false
         */
        qDefault: false
    },
    /* default config */
    applyQDefault: function (value) {
        if (!value) {
            return false;
        }
        var me = this;
        me.addCls('qsan_toolbar');
        // Ext.apply(me, {});
    }
});
