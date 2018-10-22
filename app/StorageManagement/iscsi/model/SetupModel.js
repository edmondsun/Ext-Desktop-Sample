Ext.define('DESKTOP.StorageManagement.iscsi.model.SetupModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.iscsisetup',
    requires: [],
    data: {
        lun_name      : '',
        lun_type      : 'none',
        lun_capacity  : 'none',
        lun_used      : 'none',
        lun_available : 'none',
        tar_iqn       : ''
    },
    stores: {
        maskLun: {
            cnt: 0,
            fields: [
                      'name', 
                      'host', 
                      'perm',
                       {
                            name: 'access',
                            calculate: function(data, val) {
                                var dataPermValue = {
                                    'rw'   : 0,
                                    'ro'   : 1,
                                    'deny' : 2
                                };
                                return dataPermValue[data.perm];
                            }
                        },
                        {
                            name: 'indx',
                            calculate: function(data, val) {
                                var maskLun = Ext.data.StoreManager.lookup('maskLun');
                                var cnt     = maskLun.config.cnt;

                                maskLun.setConfig({'cnt' : ++cnt})
                                return cnt;
                            }
                        },
                        {
                            name: 'rw_status',
                            calculate: function(data, val) {
                                var dataPermValue = {
                                    'rw'   : 1,
                                    'ro'   : 0,
                                    'deny' : 0
                                };
                                return dataPermValue[data.perm];
                            }
                        },
                        {
                            name: 'ro_status',
                            calculate: function(data, val) {
                                var dataPermValue = {
                                    'rw'   : 0,
                                    'ro'   : 1,
                                    'deny' : 0
                                };
                                return dataPermValue[data.perm];
                            }
                        },
                        {
                            name: 'deny_status',
                            calculate: function(data, val) {
                                var dataPermValue = {
                                    'rw'   : 0,
                                    'ro'   : 0,
                                    'deny' : 1
                                };
                                return dataPermValue[data.perm];
                            }
                        }
                    ],
            storeId: 'maskLun',
            proxy: {
                type: 'localstorage'
            },
            listeners: {
                load: function(store, records, successful) {
                }
            }
        },
        unmappedLun: {
            storeId: 'unmappedLun',
            sorters: {
                property: 'lun_name',
                direction: 'ASC'
            },
            fields: [],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                method: 'GET',
                extraParams: {
                    op: 'get_lun',
                    query_unmap_lun: 1
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function () {
                    var form = Ext.ComponentQuery.query('#Setup')[0];
                    var select_item = form.down('#grid_unmappedLun').getSelectionModel().getSelection()[0];
                }
            }
        },
        pool: {
            storeId: 'pool',
            fields: ['pool_name', 'used_gb', 'avail_gb', 'total_gb'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/pool/Pool.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                }
            }
        },
        targetSetting: {
            storeId: 'targetSetting',
            fields: ['iscsi_port', 'iscsi_enable','iqn','max_tgt_node','max_lun','isns_enable','isns_server'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                method: 'GET',
                extraParams: {
                    op: 'get_general_setting'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                }
            }
        },
        iscsiService: {
            storeId: 'iscsiService',
            fields: ['iscsi_port', 'iscsi_enable','entity_name','max_tgt_node','max_lun','isns_enable','isns_server'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                method: 'GET',
                extraParams: {
                    op: 'get_general_setting',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records) {
                }
            }
        },
        targetTree: {
            storeId: 'targetTree',
            fields: ['id', 'auth', 'name', 'iqn', 'portal_arr'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    var tree_data = [];

                    Ext.each(records, function (obj_1, index_1) {
                        var tmp = {};
                        var target_name;
                        var tarListHandle = obj_1.data; 

                        if (tarListHandle.iqn !== undefined) {
                            var sTarget   = tarListHandle;

                            target_name   = sTarget.name;
                            tmp.indx      = sTarget.id;
                            tmp.iqn       = sTarget.iqn;
                            tmp.text      = sTarget.name;
                            tmp.node_name = sTarget.name;
                            tmp.is_enabled = sTarget.is_enabled;
                            tmp.auth      = sTarget.auth;
                            tmp.user_arr  = sTarget.user_arr;
                            tmp.domain_user_arr = sTarget.domain_user_arr;
                            tmp.mchap_enabled   = sTarget.mchap_enabled;
                            tmp.mchap_user      = sTarget.mchap_user;
                            tmp.mchap_passwd    = sTarget.mchap_passwd;

                            if (typeof (sTarget.lun_objs) !== 'undefined') {
                                var childe_node = sTarget.lun_objs;
                                Ext.each(childe_node, function (obj, index) {
                                    obj.text = obj.lun_name;
                                    obj.tar_name = target_name;
                                    obj.leaf = true;
                                });
                                tmp.children = childe_node;
                            }

                            tree_data.push(tmp);
                        } else {
                            for (var i in tarListHandle) {
                                if (tarListHandle.hasOwnProperty(i)) {

                                    var sTarget   = tarListHandle[i];

                                    if (sTarget.name === undefined) {
                                        continue;
                                    }

                                    target_name   = sTarget.name;
                                    tmp.indx      = sTarget.id;
                                    tmp.iqn       = sTarget.iqn;
                                    tmp.text      = sTarget.name;
                                    tmp.node_name = sTarget.name;
                                    tmp.auth      = sTarget.auth;
                                    tmp.user_arr  = sTarget.user_arr;
                                    tmp.domain_user_arr = sTarget.domain_user_arr;
		                            tmp.mchap_enabled   = sTarget.mchap_enabled;
		                            tmp.mchap_user      = sTarget.mchap_user;
		                            tmp.mchap_passwd    = sTarget.mchap_passwd;
		                            
                                    if (typeof (sTarget.lun_objs) !== 'undefined') {
                                        var childe_node = sTarget.lun_objs;
                                        Ext.each(childe_node, function (obj, index) {
                                            obj.text = obj.lun_name;
                                            obj.tar_name = target_name;
                                            obj.leaf = true;
                                        });
                                        tmp.children = childe_node;
                                    }

                                    tree_data.push(tmp);
                                }
                            }
                        }

                        var tree = Ext.create('Ext.data.TreeStore', {
                            type: 'tree',
                            fields: [{
                                text: 'text',
                                mapping: 'text'
                            }],
                            root: {
                                expanded: true,
                                children: tree_data
                            },
                            proxy: {
                                type: 'localstorage'
                            }
                        });

                        var form = Ext.ComponentQuery.query('#Setup')[0];
                        form.down('treepanel').setStore(tree);
                        form.down('#target_name').getSelectionModel().select(0);
                        form.down('#info_lun').hide();        
                        form.down('#info_target').show();
                        form.down('#target_num_name').setConfig({value: tree_data[0].text});

                    });
                }
            }
        }
    }
});
