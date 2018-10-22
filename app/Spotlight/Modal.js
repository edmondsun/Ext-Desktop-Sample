Ext.define('DESKTOP.Spotlight.Modal', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.modal',
    closeAction: 'hide',
    floating: true,
    modal: true,
    initComponent: function() {
        var me = this;
        me.mon(Ext.getBody(), 'click', function(el, e) {
            me.close(me.closeAction);
        }, me, {
            delegate: '.x-mask'
        });
        me.callParent(arguments);
    }
});
