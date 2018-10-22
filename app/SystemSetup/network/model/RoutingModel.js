Ext.define('DESKTOP.SystemSetup.network.model.RoutingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.routing',
    data: {
        ipv6_is_enabled: null
    },
    stores: {
        total_route: {
            storeId: 'total_route',
            autoLoad: true,
            needOnLoad: true,
            fields: [],
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Routing.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records) {
                    var record = records[0],
                        ipv4_static_route = Ext.data.StoreManager.lookup("ipv4_static_route"),
                        ipv4_routing_table = Ext.data.StoreManager.lookup("ipv4_routing_table"),
                        ipv6_static_route = Ext.data.StoreManager.lookup("ipv6_static_route"),
                        ipv6_routing_table = Ext.data.StoreManager.lookup("ipv6_routing_table");
                    if (typeof record.data.ipv4_static_route !== "undefined") {
                        ipv4_static_route.loadData(record.data.ipv4_static_route);
                    }
                    if (typeof record.data.ipv4_routing_table !== "undefined") {
                        ipv4_routing_table.loadData(record.data.ipv4_routing_table);
                    }
                    if (typeof record.data.ipv6_static_route !== "undefined") {
                        ipv6_static_route.loadData(record.data.ipv6_static_route);
                    }
                    if (typeof record.data.ipv6_routing_table !== "undefined") {
                        ipv6_routing_table.loadData(record.data.ipv6_routing_table);
                    }
                }
            }
        },
        ipv4_static_route: {
            storeId: 'ipv4_static_route',
            fields: [
                'dst_addr', 'mask', 'gateway', 'iface', 'metric', 'id', {
                    name: 'id_UI',
                    calculate: function (data) {
                        if (typeof data.id !== "undefined") {
                            return data.id + 1;
                        }
                    }
                }
            ],
            proxy: {
                type: 'localstorage'
            }
        },
        ipv4_routing_table: {
            storeId: 'ipv4_routing_table',
            fields: [
                'dst_addr', 'mask', 'gateway', 'iface', 'metric', 'id', {
                    name: 'id_UI',
                    calculate: function (data) {
                        if (typeof data.id !== "undefined") {
                            return data.id + 1;
                        }
                    }
                }
            ],
            autoLoad: false,
            proxy: {
                type: 'localstorage'
            }
        },
        ipv6_static_route: {
            storeId: 'ipv6_static_route',
            fields: [
                'dst_addr', 'prefix', 'gateway', 'iface', 'metric', 'id', {
                    name: 'id_UI',
                    calculate: function (data) {
                        if (typeof data.id !== "undefined") {
                            return data.id + 1;
                        }
                    }
                }
            ],
            autoLoad: false,
            proxy: {
                type: 'localstorage'
            }
        },
        ipv6_routing_table: {
            storeId: 'ipv6_routing_table',
            fields: [
                'dst_addr', 'prefix', 'gateway', 'iface', 'metric', 'id', {
                    name: 'id_UI',
                    calculate: function (data) {
                        if (typeof data.id !== "undefined") {
                            return data.id + 1;
                        }
                    }
                }
            ],
            autoLoad: false,
            proxy: {
                type: 'localstorage'
            }
        },
        get_cur_iface: {
            fields: [
                'name', 'value'
            ],
            autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Interfaces.php',
                method: 'get',
                extraParams: {
                    op: 'get_cur_iface'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        },
        get_cur_iface_ipv6: {
            fields: [
                'name', 'value'
            ],
            autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/Interfaces.php',
                method: 'get',
                extraParams: {
                    op: 'get_cur_iface',
                    ipv6: 'ipv6'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        },
        get_ipv6_enable: {
            storeId: 'get_ipv6_enable',
            fields: [],
            selVM: null,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/network/IPv6.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records) {
                    if (records[0].data.ipv6_is_enabled) {
                        store.selVM.set("ipv6_is_enabled", true);
                    } else {
                        store.selVM.set("ipv6_is_enabled", false);
                    }
                }
            }
        }
    }
});
