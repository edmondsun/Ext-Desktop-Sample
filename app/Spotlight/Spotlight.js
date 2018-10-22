Ext.define('DESKTOP.Spotlight.Spotlight', {
    extend: 'DESKTOP.Spotlight.Modal',
    alias: 'widget.spotlight',
    requires: [
        'DESKTOP.Spotlight.SpotlightController',
        'DESKTOP.Spotlight.SpotlightModel'
    ],
    controller: 'spotlight',
    viewModel: {
        type: 'spotlight'
    },
    itemId: 'spotlight_modal',
    width: 600,
    height: 400,
    scrollable: true,
    items: [{
        xtype: 'panel',
        width: '100%',
        height: 24,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'label',
            cls: 'spotlight-icon',
            width: 24,
            height: 24,
            margin: '0 0 0 0'
        }, {
            xtype: 'textfield',
            itemId: 'spotlight_input',
            cls: 'spotlight-input',
            enableKeyEvents: true,
            width: '100%',
            hideLabel: true,
            width: 552,
            height: 24,
            listeners: {
                // render: function(self, eOpts) {
                //     var keyAction new Ext.KeyMap(this.el, [{
                //         key: Ext.EventObject.ENTER,
                //         scope: this,
                //         fn: 'onSearchKeyup'
                //     }, {
                //         key: Ext.EventObject.ESC,
                //         scope: this
                //     }]);
                // },
                keyup: 'onSearchKeyup'
            }
        }, {
            xtype: 'label',
            cls: 'spotlight-clear',
            width: 24,
            height: 24,
            margin: '0 0 0 0'
        }]
    }, {
        xtype: 'panel',
        items: [{
            xtype: 'menu',
            title: 'App',
            plain: true,
            floating: false,
            itemId: 'app_search_result'
        }]
    }]
});
