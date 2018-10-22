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
