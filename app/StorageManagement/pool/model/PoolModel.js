Ext.define('DESKTOP.StorageManagement.pool.model.PoolModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.pool',
    data: {
        vm_pool_name: '{Pool Name}',
        vm_pool_size: '{Pool Size}',
        vm_pool_used_percent: '{0}',
        vm_pool_avl_percent: '{0}',
        vm_pool_used_bar: 0,
        vm_pool_threshold: [0, 100],
        vm_pool_usage_alert: false,
        total_cap: 0,
        disk_count: 0,
        user_raid_type: null,
        user_raid_level: null,
        currentPoolKey: 'pool_guid',
        currentPoolValue: null,
        foldersUsedGB: '{0}',
        iSCSIUsedGB: '{0}',
        availableGB: '{0}',
        totalGB: '{0}'
    },
    initIndex: 0,
    currentSelectionIndex: null,
    isDirty: null,
    stores: {
        RAID_type: {
            fields: ['raid_type', 'raid_level'],
            data: []
        },
        pool_composition: {
            type: 'tree',
            autoLoad: false,
            autoSync: true,
            storeId: 'pool_composition',
            proxy: {
                type: 'localstorage'
            },
            rootVisible: false,
            root: {
                expanded: true,
                children: [
                    // { text: 'detention', leaf: true },
                    // { text: 'buy lottery tickets', leaf: true }
                ]
            },
            loadChildren: function(poolInfoData, autoload, index) {
                var _thisStore = this;
                var poolData = null;
                var root = {
                    expanded: true,
                    children: []
                };
                if (autoload) {
                    console.log(poolInfoData);
                    console.log(index);

                    poolData = poolInfoData[index].raidset_arr;
                    // poolIdx = null;

                } else {
                    poolData = poolInfoData.raidset_arr;
                }

                console.log("Rendering treePanel...");
                console.log(poolData);

                if (typeof(poolData) === 'undefined') {
                    _thisStore.loadData(root.children);
                    return false;
                }

                var prefixText = 'Raid type: ';
                var compositionArray = [];

                for (var i = 0; i < Object.keys(poolData).length; i++) {
                    var raidSet = poolData[i];
                    var raidTypeInfo = prefixText + raidSet.raid_level + ' (' + raidSet.enc_name + ': ' + raidSet.slot + ')';
                    var rsObj = {
                        text: raidTypeInfo,
                        leaf: true,
                        iconCls: 'pool-raid-leaf'
                    };
                    compositionArray.push(rsObj);
                }
                console.log(compositionArray);
                root = {
                    expanded: true,
                    children: compositionArray
                };
                //_thisStore.setData(root.children);
                _thisStore.loadData(root.children);
            }
        },
        pie: {
            fields: ['item', 'capacity'],
            autoLoad: false,
            autoSync: true,
            storeId: 'pool_pie',
            proxy: {
                type: 'localstorage'
            },
            data: [{
                item: 'iSCSI',
                capacity: 0
            }, {
                item: 'Folders',
                capacity: 0
            }, {
                item: 'Available',
                capacity: 100
            }],
            syncData: [],
            loadCapacity: function(selfVM, poolInfoData, index) {
                var _thisStore = this;
                var poolIdx = index;
                console.log(poolInfoData);
                var iSCSIUsedGB = {
                    item: 'iSCSI',
                    capacity: (poolInfoData[poolIdx].used_by_lun_mb / 1024).toFixed(2)
                };
                var foldersUsedGB = {
                    item: 'Folders',
                    capacity: (poolInfoData[poolIdx].used_by_vol_mb / 1024).toFixed(2)
                };
                var availableGB = {
                    item: 'Available',
                    capacity: ((poolInfoData[poolIdx].total_mb - poolInfoData[poolIdx].used_by_lun_mb - poolInfoData[poolIdx].used_by_vol_mb) / 1024).toFixed(2)
                };
                _thisStore.syncData.splice(0, _thisStore.syncData.length);
                _thisStore.syncData.push(iSCSIUsedGB);
                _thisStore.syncData.push(foldersUsedGB);
                _thisStore.syncData.push(availableGB);
                _thisStore.loadData(_thisStore.syncData);
                selfVM.set('foldersUsedGB', foldersUsedGB.capacity);
                selfVM.set('iSCSIUsedGB', iSCSIUsedGB.capacity);
                selfVM.set('availableGB', availableGB.capacity);
            }
        },
        poolInfo: {
            fields: [''],
            autoLoad: true,
            autoSync: true,
            storeId: 'pool_info',
            initIndex: 0,
            selfVM: null,
            lastMD5: 0,
            lastGridStoreData: null,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/pool/Pool.php',
                //url: 'app/StorageManagement/backend/pool/404NotFound.php',
                method: 'GET',
                params: {
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function(store, records, success, operation, eOpts) {
                        console.info(store.selfVM);
                        var poolComposition = Ext.data.StoreManager.lookup('pool_composition');
                        var poolPie = Ext.data.StoreManager.lookup('pool_pie');
                        // var enclosureCreate = Ext.data.StoreManager.lookup('enclosure_create');
                        if (success) {
                            var rec = records[0]; //md5sum here
                            var md5sum = rec.data.md5sum;
                            var initIndex = 0;
                            var remoteChange = true;
                            var index = 0;
                            var gridData = rec.data.data;

                            // No Pool Data
                            if (Object.keys(gridData).length === 0) {
                                // TODO: Implement NO Pools Rendering
                                console.log("No Pool");
                                return false;
                            }
                            store.lastMD5 = md5sum;
                            store.loadData(gridData);

                            for (var i = 0; i < Object.keys(gridData).length; i++) {
                                console.info(gridData[i]);
                                if (gridData[i].status.toLowerCase() === 'locked' || gridData[i].status.toLowerCase() === 'failed') {
                                    continue;
                                } else {
                                    store.initIndex = i;
                                    break;
                                }
                            }

                            if (store.selfVM.currentSelectionIndex !== null) {
                                index = store.selfVM.currentSelectionIndex;
                                if (index !== store.find(store.selfVM.get('currentPoolKey'), store.selfVM.get('currentPoolValue'))) {
                                    store.selfVM.set('currentPoolValue', gridData[initIndex].pool_guid);
                                    index = store.find(store.selfVM.get('currentPoolKey'), store.selfVM.get('currentPoolValue'));
                                }
                            } else {
                                store.selfVM.set('currentPoolValue', gridData[initIndex].pool_guid);
                                index = store.find(store.selfVM.get('currentPoolKey'), store.selfVM.get('currentPoolValue'));
                            }

                            if (index == -1) {
                                // Cannot find. Reset to 0
                                index = 0;
                            }
                            console.info("++++++++++++++++++++++++++++++");
                            console.info("Pool Index: " + index + ", has the highest priority to be diplayed in this round.");
                            console.info("++++++++++++++++++++++++++++++");

                            // Render other Info
                            store.processData(store.selfVM, store, records, poolComposition, poolPie, index);
                        } else {
                            // Ext.Msg.alert("Something wrong!", "Login Session Expired.");
                        }
                    }
                }
            },
            processData: function(selfVM, store, records, treeStore, pieStore, index) {
                //if( (records!==null || (typeof(records[0])!== 'undefined') )){//to be refactored
                if (records !== null) {
                    var rec = records[0]; //md5sum here
                    var gridData = rec.data.data;
                    //console.log(Object.keys(data).length);

                    for (var i = 0; i < Object.keys(gridData).length; i++) {
                        if (gridData[i].status === null) {
                            continue;
                        }
                        if (gridData[i].status.toLowerCase() === 'locked') {
                            var poolName = gridData[i].pool_name;
                            // gridData[i] = {};
                            gridData[i].pool_name = poolName;
                            gridData[i].encrypt_type = 'Locked';
                            gridData[i].dedup = '';
                            gridData[i].has_spare = '';
                            gridData[i].has_write_cache = '';
                            continue;
                        }
                        gridData[i].total_gb = (gridData[i].total_mb / 1024).toFixed(2);
                        gridData[i].used_gb = (gridData[i].used_mb / 1024).toFixed(2);
                        gridData[i].free_gb = (gridData[i].avail_mb / 1024).toFixed(2);
                    }
                    store.loadData(gridData);

                    console.log(store.isLoaded());
                    store.lastGridStoreData = gridData;
                    // Render other Info
                    selfVM.set('vm_pool_name', gridData[index].pool_name);
                    selfVM.set('vm_pool_size', (gridData[index].total_mb / 1024).toFixed(2));

                    selfVM.set('vm_pool_used_percent', gridData[index].used_percent);
                    selfVM.set('vm_pool_used_bar', (gridData[index].used_percent / 100).toFixed(2));
                    selfVM.set('vm_pool_avl_percent', parseInt(100 - gridData[index].used_percent));

                    var grid = Ext.ComponentQuery.query('#poolInfo')[0];
                    var gridRow = grid.getView().getRow(index);
                    if (gridRow) {
                        // TODO: Use Highlight Cls instead
                        grid.getSelectionModel().select(index);
                    }
                    if (selfVM.currentSelectionIndex) {
                        treeStore.loadChildren(gridData, true, selfVM.currentSelectionIndex);
                        pieStore.loadCapacity(selfVM, gridData, selfVM.currentSelectionIndex);

                    } else {
                        treeStore.loadChildren(gridData, true, index);
                        pieStore.loadCapacity(selfVM, gridData, index);
                    }

                    // Check Dirty
                    console.log("When polling, isDirty? ", selfVM.isDirty);

                    if (selfVM.isDirty !== true) {
                        selfVM.set('vm_pool_usage_alert', gridData[index].usage_alert);
                        // TODO: Ext JS Bug?? CANNOT bind config "values"
                        // selfVM.set('vm_pool_threshold', [gridData[index].usage_info_level, gridData[index].usage_warn_level] );
                        // var $win = Ext.ComponentQuery.query('#Pool')[0];
                        var capacityNotification = Ext.ComponentQuery.query('#capacity_notification_thumb')[0];
                        capacityNotification.setValue(0, parseInt( gridData[index].usage_info_level));
                        capacityNotification.setValue(1, parseInt( gridData[index].usage_warn_level));
                        // capacityNotification.setValue([gridData[index].usage_info_level, gridData[index].usage_warn_level], true);
                        // capacityNotification.setValue(1, parseInt( gridData[index].usage_warn_level) );
                    }

                    var polling = function() {
                        Ext.Ajax.request({
                            url: 'app/StorageManagement/backend/pool/Pool.php',
                            method: 'GET',
                            params: {
                                md5sum: store.lastMD5
                                    // md5sum: 0
                            },
                            success: function(response) {
                                var result = Ext.JSON.decode(response.responseText);
                                console.log(result);
                                if(store.lastMD5 === result.md5sum){
                                    console.log("Same md5", "Don't need to update anything.");
                                    return false;
                                }
                                if (result.data.length !== 0) {
                                    var gridData = result.data;
                                    var grid = Ext.ComponentQuery.query('#poolInfo')[0];
                                    console.log("Yeeeeeeeeeeeeeeeeeeeeeee");
                                    console.log("When polling, isDirty? ", selfVM.isDirty);
                                    console.log(gridData);
                                    store.lastMD5 = result.md5sum;

                                    for (var i = 0; i < Object.keys(gridData).length; i++) {
                                        if (gridData[i].status === null) {
                                            continue;
                                        }
                                        if (gridData[i].status.toLowerCase() === 'locked') {
                                            var poolName = gridData[i].pool_name;
                                            // gridData[i] = {};
                                            gridData[i].pool_name = poolName;
                                            gridData[i].encrypt_type = 'Locked';
                                            gridData[i].dedup = '';
                                            gridData[i].has_spare = '';
                                            gridData[i].has_write_cache = '';
                                            continue;
                                        }
                                        gridData[i].total_gb = (gridData[i].total_mb / 1024).toFixed(2);
                                        gridData[i].used_gb = (gridData[i].used_mb / 1024).toFixed(2);
                                        gridData[i].free_gb = (gridData[i].avail_mb / 1024).toFixed(2);
                                    }
                                    console.log("Yee-1");
                                    store.loadData(gridData);
                                    console.log("Yee-2");

                                    var index = store.find(selfVM.get('currentPoolKey'), selfVM.get('currentPoolValue'));
                                    console.log("Current selected index: ", index);
                                    if (index == -1 || gridData[index].status === null) {
                                        console.log("Reset to Pool 0. Cannot find selected pool.");
                                        // Cannot find. Reset to 0
                                        index = 0;
                                    }
                                    grid.getSelectionModel().select(index);
                                    console.log("Yee-3");
                                } else {
                                    // TODO: Handle No Pool
                                }
                            },
                            failure: function(response) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                console.log('Failed: ', msg);
                            }

                        });
                    };

                    var pollingTask = Ext.TaskManager.start({
                        run: polling,
                        interval: 10000,
                        args: store
                    });
                } else {
                    //TODO: Error Handling
                    Ext.Msg.alert("Something wrong!", "Login Session Expired.");
                }
            }
        }
    }
});
