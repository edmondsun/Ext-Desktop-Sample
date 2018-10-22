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
