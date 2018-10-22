Ext.define('DESKTOP.SystemSetup.network.view.LinkAgg', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.SystemSetup.network.controller.LinkAggController'
    ],
    alias: 'widget.LinkAgg',
    controller: 'linkagg',
    bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Link aggregation',
    modal: true,
    items: [{
        xtype: 'form',
        waitMsgTarget: true
    }, {
        reference: 'LinkAggRef'
    }],
    buttons: ['->', {
        text: 'Cancel',
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Apply',
        handler: 'onApply'
    }]
});
