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
