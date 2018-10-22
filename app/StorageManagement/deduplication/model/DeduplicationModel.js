Ext.define('DESKTOP.StorageManagement.deduplication.model.DeduplicationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.deduplication',
    data: {
        mask: '',
        render_time: 0
    },
    requires: ['DESKTOP.StorageManagement.deduplication.controller.DeduplicationController'],
    stores: {
        folder_info: {
            fields: [],
            storeId: 'store_folder',
            autoDestroy: true,
            needOnLoad: true,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/deduplication/Deduplication.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {
                        var form = Ext.ComponentQuery.query('#Deduplication')[0];
                        if (store.count() !== 0) {
                            var tree_folder = form.down('#tree_folderAndLun'),
                                folderAndLun_treeData = [];
                            Ext.each(records, function (obj, index) {
                                var tmp_folderAndLun = obj.get('pd_arr');
                                Ext.each(tmp_folderAndLun, function (rec, id) {
                                    rec.leaf = true;
                                    rec.text = rec.name;
                                    rec.checked = rec.dedup === 'on' ? true : false;
                                    rec.is_dedup = rec.dedup === 'on' ? true : false;
                                    rec.pool_name = obj.get('pool_name');
                                    folderAndLun_treeData.push(rec);
                                });
                            });
                            var folderAndLun_tree = Ext.create('Ext.data.TreeStore', {
                                type: 'tree',
                                fields: [{
                                    text: 'text',
                                    mapping: 'text'
                                }],
                                root: {
                                    expanded: true,
                                    children: folderAndLun_treeData
                                },
                                proxy: {
                                    type: 'localstorage'
                                }
                            });
                            tree_folder.setStore(folderAndLun_tree);
                            if (typeof (form.down('#tree_pool').getSelectionModel().getSelection()[0]) !== 'undefined') {
                                form.getController().apply_filter();
                            }
                        }
                    } else {
                        Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                    }
                }
            }
        },
        pool_info: {
            fields: [],
            autoDestroy: true,
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {
                        var form = Ext.ComponentQuery.query('#Deduplication')[0];
                        if (store.count() !== 0) {
                            var tree_data = [],
                                selection = form.down('#tree_pool').getSelectionModel().getSelection()[0];
                            Ext.each(records, function (obj, index) {
                                obj.data.text = obj.data.pool_name;
                                obj.data.read_cache = (obj.data.has_read_cache) ? true : false;
                                tree_data.push(obj.data);
                            });
                            var pool_tree = Ext.create('Ext.data.TreeStore', {
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

                            if (typeof (selection) !== 'undefined') {
                                form.down('#tree_pool').getStore().destroy();
                                var index = pool_tree.findExact('pool_name', selection.data.pool_name);
                                form.down('#tree_pool').setStore(pool_tree);
                                if (index !== -1) {
                                    form.down('#tree_pool').getSelectionModel().select(index);
                                } else {
                                    form.down('#tree_pool').getSelectionModel().select(0);
                                }
                            } else {
                                form.down('#tree_pool').setStore(pool_tree);
                                form.down('#tree_pool').getSelectionModel().select(0);
                            }
                        }
                    } else {
                        Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                    }
                }
            }
        }
    }
});
