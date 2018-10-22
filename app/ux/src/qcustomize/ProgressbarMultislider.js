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
