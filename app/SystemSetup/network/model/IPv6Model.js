Ext.define('DESKTOP.SystemSetup.network.model.IPv6Model', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.netipv6',
    stores: {
        netipv6: {
            storeId: 'netipv6',
            autoLoad: true,
            fields: [
                'name',
                'mtu',
                'vlan_id',
                'mac',
                'link',
                'ipv6_type',
                'ipv6_global_addr',
                'ipv6_default_gateway',
                'ipv6_gateway',
                'ipv6_prefix'
            ],
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/IPv6.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data.ipv6_setting'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        store.fireEvent('enableIPv6', store.proxy.reader.rawData.data.ipv6_is_enabled);
                    }
                }
            }
        }
    }
});
