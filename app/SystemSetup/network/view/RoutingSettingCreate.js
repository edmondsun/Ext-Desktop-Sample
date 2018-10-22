Ext.define('DESKTOP.SystemSetup.network.view.RoutingSettingCreate', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.SystemSetup.network.model.RoutingModel'
    ],
    controller: 'routing',
    viewModel: {
        type: 'routing'
    },
    //bodyPadding: 20,
    closeAction: 'destroy',
    width: 600,
    modal: true,
    items: [{
        xtype: 'form',
        //padding: '10 10 10 10',
        layout: 'vbox',
        url: 'app/SystemSetup/backend/network/Interfaces.php',
        items: [{
            fieldLabel: 'Destination',
            name: 'Destination',
            itemId: 'Destination',
            xtype: 'textfield'
        }, {
            itemId: 'route',
            xtype: 'container'
        }, {
            fieldLabel: 'Gateway',
            name: 'Gateway',
            itemId: 'Gateway',
            xtype: 'textfield'
        }, {
            fieldLabel: 'Metric',
            name: 'Metric',
            itemId: 'Metric',
            xtype: 'textfield'
        }, {
            xtype: 'combobox',
            fieldLabel: 'Interfaces',
            editable: false,
            bind: {
                store: '{routing}'
            },
            valueField: 'ipv6_type',
            displayField: 'ipv6_type',
            queryMode: 'local'
        }, {
            fieldLabel: 'IP Address',
            name: 'IP Address',
            itemId: 'IPAddress',
            xtype: 'textfield'
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        listeners: {
            click: 'Setting_Apply'
        }
    }]
});
