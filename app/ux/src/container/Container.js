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
