Ext.define('DESKTOP.StorageManagement.overview.model.PoolModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.overviewpool',
    data: {
        foldersUsedGB: '{0}',
        iSCSIUsedGB: '{0}',
        availableGB: '{0}',
        totalGB: '{0}',
        currentPoolName: '{Pool Name}',
        currentPoolKey: 'pool_guid',
        currentPoolValue: null
    },
    initIndex: 0,
    currentSelectionIndex: null,
    lastGridStoreData: null,
    stores: {
        encInfoForPool: {
            storeId: 'encInfoForPool',
            fields: [''],
            autoLoad: true,
            selfVM: null,
            selfRecord: null,
            initIndex: 0,
            currentSelectionIndex: null,
            drwaingIndex: null,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                extraParams: {
                    op: 'get_enclosure',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            }
            // listeners: {
            //     load: {
            //         fn: function (store, records) {
            //             store.selfVM.prepare_data(store, records);
            //             store.selfRecord = records[0].data.data;
            //             store.view.on_create_boxs(records[0].data.data[0], store);
            //         }
            //     }
            // }
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
            loadChildren: function(poolInfoData, autoload, index){
                var _thisStore = this;
                var poolData = null;
                var root  = {
                    expanded: true,
                    children: []
                };
                if( autoload ){
                    console.log(poolInfoData);
                    console.log(index);
                    poolData = poolInfoData[index].raidset_arr;
                }else{
                    poolData = poolInfoData.raidset_arr;
                }

                console.log("Rendering treePanel...");
                console.log(poolData);
                var prefixText = 'Raid type: ';
                var compositionArray = [];

                for (var i = 0; i < Object.keys( poolData ).length; i++){
                    var raidSet = poolData[i];
                    var raidTypeInfo = prefixText + raidSet.raid_level + ' ('+ raidSet.enc_name+ ': '+ raidSet.slot+')';
                    var rsObj = {
                        text: raidTypeInfo,
                        leaf: true,
                        iconCls : 'pool-raid-leaf'
                    };
                    compositionArray.push(rsObj);
                }
                console.log(compositionArray);
                root  = {
                    expanded: true,
                    children: compositionArray
                };
                _thisStore.loadData(root.children);
            }
        },
        pie: {
            fields: ['item', 'capacity' ],
            autoLoad: false, 
            autoSync: true,
            storeId: 'pool_pie',
            proxy: {
                type: 'localstorage'    
            },
            data: [
                { item: 'Folders', capacity: 30 },
                { item: 'iSCSI', capacity: 30 },
                { item: 'Available', capacity: 30 }
            ],
            syncData:[
            ],
            loadCapacity: function(selfVM, poolInfoData, index){
                var _thisStore = this;
                var poolIdx = index;
                console.log(poolInfoData);
                var iSCSIUsedGB = { item: 'iSCSI', capacity: (poolInfoData[poolIdx].used_by_lun_mb / 1024).toFixed(2) };
                var foldersUsedGB = { item: 'Folders', capacity: (poolInfoData[poolIdx].used_by_vol_mb / 1024).toFixed(2) };
                var availableGB = { item: 'Available', capacity: ( ( poolInfoData[poolIdx].total_mb - poolInfoData[poolIdx].used_by_lun_mb - poolInfoData[poolIdx].used_by_vol_mb )/1024 ).toFixed(2) };
                _thisStore.syncData.splice(0, _thisStore.syncData.length);
                _thisStore.syncData.push(iSCSIUsedGB);
                _thisStore.syncData.push(foldersUsedGB);
                _thisStore.syncData.push(availableGB);
                _thisStore.setData( _thisStore.syncData );
                _thisStore.loadData( _thisStore.syncData );
                selfVM.set('foldersUsedGB', foldersUsedGB.capacity );
                selfVM.set('iSCSIUsedGB', iSCSIUsedGB.capacity );
                selfVM.set('availableGB', availableGB.capacity );
                selfVM.set('totalGB', (poolInfoData[poolIdx].total_mb / 1024).toFixed(2) );
            }
        },
        poolInfo: {
            fields: [''],
            autoLoad: true,   
            autoSync: true,
            storeId: 'pool_info',
            selfVM: null,
            initIndex: 0,
            selfRecord: null,
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
                    fn: function (store, records, success, operation, eOpts) {
                        console.info(store.selfVM);
                        var selfPoolStore = store;
                        var selfRecords = records;
                        var poolComposition = Ext.data.StoreManager.lookup('pool_composition');
                        var poolPie = Ext.data.StoreManager.lookup('pool_pie');
                        if(success){
                            var initIndex = 0;
                            var index = 0;
                            var gridData = records[0].data.data;

                            if(Object.keys( gridData ).length === 0){
                                // TODO: Implement no pool UIUX events
                                console.log("No Pool");
                                return false;
                            }

                            store.loadData(gridData);

                            /* To be refactored if selected pool status is Locked of Failed */
                            for (var i = 0; i < Object.keys( gridData ).length; i++){
                                console.info("****************************");
                                console.info(gridData[i]);
                                
                                if(gridData[i].status === 'Locked' || gridData[i].status === 'Failed'){
                                    continue;   
                                }else{
                                    store.initIndex = i;
                                    break;
                                }
                            }
                            console.info("-------------------------------");
                            if(store.selfVM.currentSelectionIndex !== null){
                                // console.info("**Pool Index: "+store.selfVM.currentSelectionIndex+ ", has the highest priority to be diplayed in this round.");
                                index = store.selfVM.currentSelectionIndex;
                                if( index !== store.find( store.selfVM.get('currentPoolKey') , store.selfVM.get('currentPoolValue')) ){
                                    store.selfVM.set('currentPoolValue', gridData[initIndex].pool_guid);
                                    index = store.find( store.selfVM.get('currentPoolKey') , store.selfVM.get('currentPoolValue'));
                                }
                            }else{
                                store.selfVM.set('currentPoolValue', gridData[initIndex].pool_guid);
                                // console.info("Pool Index: "+store.initIndex+ ", has the highest priority to be diplayed in this round.");
                                index = store.initIndex;
                            }

                            if(index == -1){
                                // TODO: Reset to 0
                            }
                            console.info("++++++++++++++++++++++++++++++");
                            console.info("Pool Index: "+index+ ", has the highest priority to be diplayed in this round.");
                            console.info("++++++++++++++++++++++++++++++");

                            var encInfoForPool = Ext.data.StoreManager.lookup('encInfoForPool');
                            encInfoForPool.load({
                                params: {
                                    op: 'get_enclosure',
                                    md5sum: 0
                                },
                                callback: function(records, operation, success) {
                                    if(success){
                                        var record = records[0];
                                        var form = Ext.ComponentQuery.query('#tabPool')[0];
                                        // var params = {
                                        //     md5sum: record.data.md5sum
                                        // };
                                        var encIndex = 0;
                                        encInfoForPool.loadData(record.data.data);
                                        if (encInfoForPool.currentSelectionIndex){
                                            encIndex = encInfoForPool.currentSelectionIndex;
                                        }else{
                                            encIndex = encInfoForPool.initIndex;
                                        }
                                        console.log("Current Enc Index");
                                        console.log("------------------");
                                        console.log(encIndex);
                                        console.log("------------------");
                                        form.down('combobox').setValue(record.data.data[encIndex].enc_id);
                                        // console.warn("Now searching drawing slot index...");
                                        // if(encInfoForPool.drwaingIndex === null){
                                        //     encInfoForPool.drwaingIndex = encInfoForPool.view.searchDrawingIndex(gridData[index], record.data.data[encIndex], false);
                                        // }
                                        // encInfoForPool.view.on_create_boxs(records[0].data.data[encIndex], store, gridData[index], encInfoForPool.drwaingIndex);
                                        store.processData( selfPoolStore.selfVM, selfPoolStore, selfRecords, poolComposition, poolPie, index );
                                    }
                                }
                            });
                            
                        }else{
                            Ext.Msg.alert("Something wrong!", "Login Session Expired.");
                        }
                    }
                }

            },
            processData: function (selfVM, store, records, treeStore, pieStore, index) {
                if( records!==null ){  
                    var rec = records[0];//md5sum here
                    var gridData = rec.data.data;
                    selfVM.lastGridStoreData = gridData;                    
                    for (var i = 0; i < Object.keys(gridData).length; i++){
                        gridData[i].total_gb = (gridData[i].total_mb / 1024).toFixed(2);
                        gridData[i].used_gb = (gridData[i].used_mb / 1024).toFixed(2);
                        gridData[i].free_gb = (gridData[i].avail_mb / 1024).toFixed(2);
                    }

                    treeStore.loadChildren(gridData, true, index);
                    pieStore.loadCapacity(selfVM, gridData, index);

                    var grid = Ext.ComponentQuery.query('#poolInfo')[0];
                    console.log("Yee? ",index);
                    store.selfVM.set('currentPoolName', gridData[index].pool_name);
                    grid.getSelectionModel().select(store.getAt(index));

                    if (typeof(store.polling) !== 'undefined') {
                        clearInterval(store.polling);
                    }
                    
                    store.polling = setInterval(function() {
                        store.load();
                    }, 10000);
                }else{
                    //TODO: Error Handling
                    // Ext.Msg.alert("Something wrong!", "Login Session Expired.");
                }
            }
        }
    }
});
