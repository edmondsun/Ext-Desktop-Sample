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
