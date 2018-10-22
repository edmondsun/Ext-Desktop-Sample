Ext.define('DESKTOP.SystemSetup.network.model.AdvancedModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.advanced',
    stores: {
        init: {
            needOnLoad:true,
            fields: [
                'loopback_enable', 'loopbacknic', 'loopbackaddr', 'loopback_nic_id'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Advanced.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["init"]',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var record = records[0];
                        var form = Ext.ComponentQuery.query('#Advanced')[0];
                        form.getForm().loadRecord(record);
                    }
                }
            }
        },
        lobkcombo: {
            needOnLoad:true,
            fields: ['name', 'addr', 'id'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Advanced.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["lan"]',
                    successProperty: 'success'
                }
            }
        },
        arpGrid: {
            needOnLoad:true,
            fields: [
                'addr', 'iface', 'mac'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Advanced.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["grid"]',
                    successProperty: 'success'
                }
            }
        }
    }
});
