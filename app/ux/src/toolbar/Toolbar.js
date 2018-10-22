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
