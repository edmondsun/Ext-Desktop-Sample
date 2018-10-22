Ext.define('DESKTOP.SystemSetup.network.model.InterfacesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.netinterfaces',
    data: {
        dynamic_dns_enable: false
    },
    stores: {
        init: {
            storeId: 'init',
            needOnLoad: true,
            fields: [
                'defaultGateway', 'dns', 'primary',
                'secondary', 'search_path'
            ],
            // autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Interfaces.php',
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
                        var form = Ext.ComponentQuery.query('#Interface')[0];
                        form.getForm().loadRecord(record);
                    }
                }
            }
        },
        netGrid: {
            storeId: 'netGrid',
            needOnLoad: true,
            selVM: null,
            fields: [
                'name', 'mtu', 'vlan_id', 'address',
                'gateway', 'link', 'mac',
                /*{
                    name: 'name',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }, {
                    name: 'mtu',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }, {
                    name: 'vlan_id',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }, {
                    name: 'address',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                },*/
                {
                    name: 'gateway',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }
                /* , {
                    name: 'mac',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }, {
                    name: 'link',
                    convert: function (val) {
                        return (val === '') ? '-' : val;
                    }
                }*/
            ],
            // autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Interfaces.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["grid"]',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        store.selVM.set("dynamic_dns_enable", false);
                        Ext.Array.each(records, function (recArr, index) {
                            if (recArr.data.type !== "static") {
                                store.selVM.set("dynamic_dns_enable", true);
                                return false;
                            }
                        });
                        var initStore = Ext.data.StoreManager.lookup('init');
                        var def_gw_store = Ext.create('Ext.data.Store', {
                            storeId: 'DefaultLan',
                            fields: ['name'],
                            data: records,
                            proxy: {
                                type: 'memory',
                                reader: {
                                    type: 'json'
                                }
                            }
                        });
                        def_gw_store.filterBy(function (rec) {
                            if (rec.get('gateway') !== '-') {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        Ext.ComponentQuery.query('#default_gateway_combo')[0].bindStore(def_gw_store);
                        initStore.load();
                    }
                }
            }
        },
        LinkAgg: {
            fields: [
                'name', 'name', 'name', 'name'
            ],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/LinkAgg.php',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        }
    }
});
