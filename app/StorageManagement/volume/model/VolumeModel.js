Ext.define('DESKTOP.StorageManagement.volume.model.VolumeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.volume',
    data: {
        PoolSize        : '0',
        PoolUsed        : '0',
        PoolAvailable   : '0',
        VolumeName      : 'Please Chose...',
        TotalSize       : '0',
        FreeGB          : '0',
        UsedGB          : '0',
        FreePer         : '0',
        UsedPer         : '0',
        Info            : '0',
        Warn            : '0',
        Notify          : false,
        NotifyThreshold : [0, 100]
    },
    stores: {
        poolInfo: {
            storeId: 'pool',
            selfVM: null,
            fields: ['pool_name', 'total_gb', 'used_gb', 'avail_gb'],
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
                load: {
                    fn: function(store, records, success) {

                        if (!success) {
                            Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                            return;
                        }

                        if (store.count() > 0) {

                            if (Ext.ComponentQuery.query('#volumeCreate').length == 0) {
                                return;
                            }

                            var form = Ext.ComponentQuery.query('#volumeCreate')[0];

                            form.down('#create_pool_name').setValue(records[0].get('pool_name'));
                            form.down('#create_pool_total_size').setValue(records[0].get('total_gb'));
                            form.down('#create_pool_used_size').setValue(records[0].get('used_gb'));
                            form.down('#create_pool_available_size').setValue(records[0].get('avail_gb'));

                            form.down('#create_pool_total_size').hiddenValue     = records[0].get('total_gb');
                            form.down('#create_pool_used_size').hiddenValue      = records[0].get('used_gb');
                            form.down('#create_pool_available_size').hiddenValue = records[0].get('avail_gb');  

                            form.down('#create_volume_size').setValue(0);
                            form.down('#create_pool_slider').setMaxValue(records[0].get('total_gb').toFixed(2));
                            form.down('#create_pool_slider').setValue(records[0].get('used_gb').toFixed(2));

                            store.selfVM.set('PoolSize',      records[0].get('total_gb').toFixed(2) + 'GB');
                            store.selfVM.set('PoolUsed',      records[0].get('used_gb').toFixed(2)  + 'GB');
                            store.selfVM.set('PoolAvailable', records[0].get('avail_gb').toFixed(2) + 'GB');
                        }
                    }
                }
            }
        },
        volumeInfo: {
            fields: [''],
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/volume/Volume.php',
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
                        var pool_treeData         = [];
                        var folderVolume_treeData = [];

                        Ext.each(records, function (obj, index) {
                            var tmp      = {};
                            tmp.text     = obj.get('pool_name');
                            tmp.leaf     = false;
                            tmp.vol_list = obj.get('vol_list');
                            pool_treeData.push(tmp);

                            var tmp_folderVolume = obj.get('vol_list');

                            Ext.each(tmp_folderVolume, function (rec, id) {
                                rec.leaf      = true;
                                rec.text      = rec.vol_name;
                                rec.pool_name = obj.get('pool_name');
                                folderVolume_treeData.push(rec);
                            });

                        });

                        var pool_tree = Ext.create('Ext.data.TreeStore', {
                            type: 'tree',
                            fields: [{
                                text: 'text',
                                mapping: 'text'
                            }],
                            root: {
                                expanded: true,
                                children: pool_treeData
                            },
                            proxy: {
                                type: 'localstorage'
                            }
                        });

                        var folderVolume_tree = Ext.create('Ext.data.TreeStore', {
                            type: 'tree',
                            fields: [{
                                text: 'text',
                                mapping: 'text'
                            }],
                            root: {
                                expanded: true,
                                children: folderVolume_treeData
                            },
                            proxy: {
                                type: 'localstorage'
                            }
                        });

                        Ext.ComponentQuery.query('#tree_pool')[0].setStore(pool_tree);
                        Ext.ComponentQuery.query('#tree_pool')[0].getSelectionModel().select(0);
                        Ext.ComponentQuery.query('#tree_volume')[0].setStore(folderVolume_tree);

                    } else {
                        Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                    }
                }
            }
        },
        pie: {
            fields: ['name', 'capacity'],
            storeId: 'pie',
            proxy: {
                type: 'localstorage'
            },
            data: [{
                name: 'Free',
                capacity: 100
            },{
                name: 'Used',
                capacity: 0
            }]
        }
    }
});
