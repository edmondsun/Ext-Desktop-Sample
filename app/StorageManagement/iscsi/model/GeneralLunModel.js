Ext.define('DESKTOP.StorageManagement.iscsi.model.GeneralLunModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.lunsetting',
    data: {
        vm_pool_name: '{Pool Name}',
        vm_pool_size: '{Pool Size}',
        vm_pool_used_percent: '{0}',
        vm_pool_avl_percent: '{0}',
        vm_pool_used_bar: '{0}',
        pool_threshold: [0, 100]
    },
    stores: {
        poolInfo: {
            storeId: 'pool',
            fields: [
                'pool_name',
                'used_gb',
                'avail_gb',
                'total_gb'
            ],
            selfVM: null,
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
                load: {
                    fn: function (store, records, success) {
                        var form = Ext.ComponentQuery.query('#generateLunView')[0];
                        var combo = form.down('#lun_location');
                        var items = [];
                        var it = {};
                        var poolStores = form.getViewModel('lunsetting').getStore('poolInfo');
                        var poolInfo = {};
                        var i;
                        //
                        //  LUN location
                        //
                        for (i = 0; i < records.length; i++) {
                            it = {
                                'pool_name': records[i].getData().pool_name
                            };
                            items.push(it);
                        }
                        var poolStore = Ext.create('Ext.data.Store', {
                            fields: ['pool_name'],
                            data: items
                        });
                        combo.bindStore(poolStore);
                        // Create
                        if (form.action == "Create") {
                            poolInfo = {
                                pool: poolStores.getAt(0).getData().pool_name,
                                avail_gb: poolStores.getAt(0).getData().avail_gb.toFixed(0),
                                avail_mb: poolStores.getAt(0).getData().avail_mb.toFixed(0),
                                used_gb: poolStores.getAt(0).getData().used_gb.toFixed(0),
                                used_mb: poolStores.getAt(0).getData().used_mb.toFixed(0),
                                pool_gb: poolStores.getAt(0).getData().total_gb.toFixed(0),
                                pool_tb: (poolStores.getAt(0).getData().total_gb / 1024).toFixed(0)
                            };
                            form.down('#lun_location').select(poolInfo.pool);
                            form.down('#lun_capacity').setValue(poolInfo.avail_gb);
                            form.down('#lun_capacity').pValue = poolInfo.avail_gb;
                            form.down('#lun_pool_size').setValue(poolInfo.pool_gb + "GB");
                            form.down('#lun_pool_used').setValue(poolInfo.used_gb + "GB");
                            form.down('#lun_pool_available').setValue(poolInfo.avail_gb + "GB");
                            form.down("#pool_capacity").maxValue = poolInfo.pool_gb;
                            form.down("#pool_capacity").setValue(poolInfo.used_gb);
                            // Edit
                        } else if (form.action == "Edit") {
                            var launchView = Ext.ComponentQuery.query('#Setup')[0];
                            var gridUnMapLun = launchView.down('#grid_unmappedLun');
                            var selectedLun = gridUnMapLun.getSelectionModel().getSelection()[0] ? gridUnMapLun.getSelectionModel().getSelection()[0] : records[0];
                            var nameSelected = selectedLun.getData().name.split("/")[0];
                            for (i = 0; i < poolStores.getCount(); i++) {
                                if (nameSelected == poolStores.getAt(i).getData().pool_name) {
                                    poolInfo = {
                                        name: selectedLun.getData().lun_name,
                                        pool: poolStores.getAt(i).getData().pool_name,
                                        avail_gb: poolStores.getAt(i).getData().avail_gb.toFixed(0),
                                        avail_mb: poolStores.getAt(i).getData().avail_mb.toFixed(0),
                                        used_gb: poolStores.getAt(i).getData().used_gb.toFixed(0),
                                        used_mb: poolStores.getAt(i).getData().used_mb.toFixed(0),
                                        pool_gb: poolStores.getAt(i).getData().total_gb.toFixed(0),
                                        pool_tb: (poolStores.getAt(i).getData().total_gb / 1024).toFixed(0),
                                        thin: selectedLun.getData().thin,
                                        compression: selectedLun.getData().compression,
                                        volsize_gb: selectedLun.getData().volsize_gb,
                                        volsize_mb: selectedLun.getData().volsize_mb
                                    };
                                    break;
                                }
                            }
                            var thin_prov, compress;
                            var comOptions = {
                                "enable": "Enable",
                                "gen_zero": "Zero Reclaim",
                                "zero_reclaim": "Generic zero Reclaim"
                            };
                            form.down('#lun_location').select(poolInfo.pool);
                            //mainView.down("#pool_capacity").maxValue = poolInfo.pool_gb;
                            form.down('#lun_name').oriValue = poolInfo.name;
                            form.down('#lun_name').setValue(poolInfo.name);
                            form.down('#lun_capacity').setValue(poolInfo.volsize_gb);
                            form.down('#lun_capacity').pValue = poolInfo.volsize_gb;
                            thin_prov = (poolInfo.thin == "enable") ? true : false;
                            form.down('#lun_thin_provsioning').setValue(thin_prov);
                            compress = (poolInfo.compression == "disable") ? false : true;
                            form.down('#lun_enable_compression').setValue(compress);
                            form.down('#lun_pool_size').setValue(poolInfo.pool_gb + "GB");
                            form.down('#lun_pool_used').setValue(poolInfo.used_gb + "GB");
                            form.down('#lun_pool_size').hValue = poolInfo.pool_gb;
                            form.down('#lun_pool_used').hValue = poolInfo.used_gb;
                            form.down('#lun_pool_available').hValue = poolInfo.avail_gb;
                            if (compress) {
                                form.down('#lun_compression_type').select(comOptions[poolInfo.compression]);
                            } else {
                                form.down('#lun_enable_compression').pValue = "disable";
                            }
                            form.getForm().loadRecord(store.getAt(0));
                            form.down('#lun_pool_size').setValue(poolInfo.pool_gb + "GB");
                            form.down('#lun_pool_used').setValue(poolInfo.used_gb + "GB");
                            form.down('#lun_pool_available').setValue(poolInfo.avail_gb + "GB");
                            form.down("#pool_capacity").maxValue = poolInfo.pool_gb;
                            form.down("#pool_capacity").setValue(poolInfo.used_gb);
                        }
                    }
                }
            }
        }
    }
});
