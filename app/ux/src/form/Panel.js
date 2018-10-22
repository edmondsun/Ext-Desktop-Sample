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
