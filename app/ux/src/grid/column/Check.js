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
