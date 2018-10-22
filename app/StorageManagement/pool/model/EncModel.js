Ext.define('DESKTOP.StorageManagement.pool.model.EncModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.enc',
    current_disk: 0,
    selectedSlotArray: [],

    stores: {
        freeDisk: {
            storeId: 'free_disk',
            fields: [''],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    successProperty: 'success'
                },
                extraParams: {
                    op: 'get_pd_for_pool_create'
                }
            },
            listeners: {
                load: {
                    fn: function(store, records, success, operation, eOpts){
                        var _self = store;
                        if (success) {
                            var rec = records[0];
                            var freeDiskData = rec.data.data;
                            console.log(freeDiskData);
                            // For debugging
                            // freeDiskData = [{"pd_id":"e0d4","slot":5,"end_id":0,"size_gb":38,"pool":"","pool_status":"","connect_stat":"Online","status":"良好",
                            //     "health":"Unknown","usage":"FreeDisk","vendor":"Hitachi","serial":"PFDA00S1UEZYGJ","model":"HDS728040PLA320 ","fw_ver":"A60A",
                            //     "rate":"SATA 1.5 Gbit","write_cache":"Disabled","type":"HDD","ident":0,"smartctl_arr":{"status":"未知的","log_exist":"Yes",
                            //     "log_path":"/var/log/e0d4_0_smartctl_test_log","start_time":"未知的"},
                            //     "smart_arr":{"read error rate":{"value":100,"min_threshold":16,"max_threshold":"不適用","status":"不適用"},
                            //     "spin up time":{"value":110,"min_threshold":24,"max_threshold":"不適用","status":"不適用"},
                            //     "reallocated sector count":{"value":100,"min_threshold":5,"max_threshold":"不適用","status":"不適用"},
                            //     "seek error rate":{"value":100,"min_threshold":67,"max_threshold":"不適用","status":"不適用"},
                            //     "spin up retries":{"value":100,"min_threshold":60,"max_threshold":"不適用","status":"不適用"},
                            //     "calibration retries":{"value":"不適用","min_threshold":"不適用","max_threshold":"不適用","status":"不適用"},
                            //     "Temperature":{"value":47,"min_threshold":0,"max_threshold":55,"status":"確定"}}}];
                            if(freeDiskData.length !== 0){
                                // TODO: To be confirmed: It's sorted
                                // Get the first Enc ID
                                var encID = freeDiskData[0].end_id;
                                var enclosureCreate = Ext.data.StoreManager.lookup('enclosure_create');
                                enclosureCreate.loadEnclosure(encID);
                            }else{
                                Ext.Msg.alert("Oops", "No Available PD in all enclosures", function (){
                                    var $win = Ext.ComponentQuery.query('#CreatePool')[0];
                                    if (typeof $win === 'undefined') {
                                        $win = Ext.ComponentQuery.query('#ExpandPool')[0];
                                    }
                                    $win.close();
                                });
                            }
                        }
                    }
                }
            }
        },
        enclosure_create: {
            storeId: 'enclosure_create',
            fields: [''],
            autoLoad: false,
            lastEncID: null,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    successProperty: 'success'
                },
                extraParams: {
                    op: 'get_enclosure'
                }
            },
            loadEnclosure: function(encID){
                var _self = this;
                if(encID){
                    _self.lastEncID = encID;
                }
                this.load({
                    scope: this,
                    params: {
                        op: 'get_enclosure'
                    },
                    callback: function(records, operation, success){
                        console.log("Load enclosure....");
                        var gridStore = Ext.data.StoreManager.lookup('enclosure_grid');
                        var enclosureExpand = Ext.data.StoreManager.lookup('enclosure_expand');

                        if (success) {
                            var rec = records[0];
                            console.info("Get Enc...............");
                            var encData = rec.data.data;
                            console.info("show Enc...............");
                            console.info(encData);

                            var index = 0;
                            var currentEncID = 0,
                                currentEncName = null;

                            if (_self.lastEncID === null) { 
                                index = 0;
                                currentEncID = encData[0].enc_id;
                                currentEncName = encData[0].enc_name;
                            } else {
                                index = _self.find('enc_id', _self.lastEncID);
                                currentEncID = _self.getAt(index).get('enc_id');
                                currentEncName = _self.getAt(index).get('enc_name');
                            }

                            _self.loadData(encData);
                            enclosureExpand.load({
                                scope: this,
                                callback: function(records, operation, success) {
                                    if (success) {
                                        enclosureExpand.loadData(encData);
                                        if (typeof Ext.ComponentQuery.query('#CreatePool')[0] !== 'undefined') {
                                            Ext.ComponentQuery.query('#CreatePool')[0].down('#enclosurecb').setValue(_self.data.items[index].data.enc_name);
                                        }
                                        if (typeof Ext.ComponentQuery.query('#ExpandPool')[0] !== 'undefined') {
                                            Ext.ComponentQuery.query('#ExpandPool')[0].down('#enclosurecb').setValue(_self.data.items[index].data.enc_name);
                                        }
                                    } else {
                                        // TODO: No Enc data
                                    }
                                }
                            });

                            console.log("Going to load Enc: ", currentEncID, currentEncName);
                            gridStore.loadSlotData(currentEncID, currentEncName);
                        } else {
                            // TODO: ajax request fail handling
                        }
                    }
                })
            }

            // listeners: {
            //     load: {
            //         fn: function(store, records, success, operation, eOpts) {
            //             var _self = store;
            //             var gridStore = Ext.data.StoreManager.lookup('enclosure_grid');
            //             var enclosureExpand = Ext.data.StoreManager.lookup('enclosure_expand');

            //             if (success) {
            //                 var rec = records[0];
            //                 console.info("Get Enc...............");
            //                 var encData = rec.data.data;
            //                 console.info("show Enc...............");
            //                 console.info(encData);

            //                 var index = 0;
            //                 var currentEncID = 0,
            //                     currentEncName = null;
            //                 // Get free disks (free PDs)
            //                 gridStore.loadSlotData(encData[i].enc_id, encData[i].enc_name);


            //                 return;

            //                 // No free disks (free PDs)
            //                 if (store.lastEncID === null) { 
            //                     index = 0;
            //                     currentEncID = encData[0].enc_id;
            //                     currentEncName = encData[0].enc_name;
            //                     Ext.Msg.alert("Oops", "No Available PD in all enclosures", function (){
            //                         var confirmButton = Ext.ComponentQuery.query('#createPoolConfirm')[0];
            //                         confirmButton.setDisabled(true);
            //                     });
            //                 } else {
            //                     index = store.find('enc_id', store.lastEncID);
            //                     currentEncID = _self.getAt(index).get('enc_id');
            //                     currentEncName = _self.getAt(index).get('enc_name');
            //                 }

            //                 store.loadData(encData);
            //                 enclosureExpand.load({
            //                     scope: this,
            //                     callback: function(records, operation, success) {
            //                         if (success) {
            //                             enclosureExpand.loadData(encData);
            //                             if (typeof Ext.ComponentQuery.query('#CreatePool')[0] !== 'undefined') {
            //                                 Ext.ComponentQuery.query('#CreatePool')[0].down('#enclosurecb').setValue(_self.data.items[index].data.enc_name);
            //                             }
            //                             if (typeof Ext.ComponentQuery.query('#ExpandPool')[0] !== 'undefined') {
            //                                 Ext.ComponentQuery.query('#ExpandPool')[0].down('#enclosurecb').setValue(_self.data.items[index].data.enc_name);
            //                             }
            //                         } else {
            //                             // TODO: No Enc data
            //                         }
            //                     }
            //                 });

            //                 console.log("Going to load Enc: ", currentEncID, currentEncName);
            //                 gridStore.loadSlotData(currentEncID, currentEncName);
            //             } else {
            //                 // TODO: ajax request fail handling
            //             }
            //         }
            //     }
            // }
        },
        /* enclosure_expand does the same thing with enclosure_create */
        enclosure_expand: {
            storeId: 'enclosure_expand',
            fields: [],
            autoLoad: false,
            autoSync: true,
            proxy: {
                type: 'localstorage'
            }
        },
        enclosure_grid: {
            fields: ['raid_type'],
            storeId: 'enclosure_grid',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                },
                extraParams: {
                    op: '',
                    pool_name: '',
                    enc_id: ''
                }
            },
            loadSlotData: function(encID, encName) {
                var _self = this;
                this.load({
                    scope: this,
                    params: {
                        op: 'get_pd_for_pool_create',
                        enc_id: encID
                    },

                    callback: function(records, operation, success) {
                        // function disableCmp(){
                        //     var confirmButton = Ext.ComponentQuery.query('#createPoolConfirm')[0];
                        //     confirmButton.setDisabled(true);
                        // }
                        if (success) {
                            if (records.length <= 0){
                                console.log("Oops", "No Available PD in enclosure: "+encName, encID);
                            } else {
                                var encGridData = records[0].data;
                                console.info("encGridData......");
                                console.info(encGridData);


                                /* This is for testing Estimated Capacity and spare disk */
                                // var testArr = [];
                                // var testObj = {"pd_id":"e0d4","slot":5,"end_id":0,"size_gb":38,"pool":"","pool_status":"","connect_stat":"Online","status":"良好",
                                // "health":"Unknown","usage":"FreeDisk","vendor":"Hitachi","serial":"PFDA00S1UEZYGJ","model":"HDS728040PLA320 ","fw_ver":"A60A",
                                // "rate":"SATA 1.5 Gbit","write_cache":"Disabled","type":"HDD","ident":0,"smartctl_arr":{"status":"未知的","log_exist":"Yes",
                                // "log_path":"/var/log/e0d4_0_smartctl_test_log","start_time":"未知的"},
                                // "smart_arr":{"read error rate":{"value":100,"min_threshold":16,"max_threshold":"不適用","status":"不適用"},
                                // "spin up time":{"value":110,"min_threshold":24,"max_threshold":"不適用","status":"不適用"},
                                // "reallocated sector count":{"value":100,"min_threshold":5,"max_threshold":"不適用","status":"不適用"},
                                // "seek error rate":{"value":100,"min_threshold":67,"max_threshold":"不適用","status":"不適用"},
                                // "spin up retries":{"value":100,"min_threshold":60,"max_threshold":"不適用","status":"不適用"},
                                // "calibration retries":{"value":"不適用","min_threshold":"不適用","max_threshold":"不適用","status":"不適用"},
                                // "Temperature":{"value":47,"min_threshold":0,"max_threshold":55,"status":"確定"}}};

                                // var cloneObject = function(obj) {
                                //     if (obj === null || typeof obj !== 'object') {
                                //         return obj;
                                //     }

                                //     var temp = obj.constructor(); // give temp the original obj's constructor
                                //     for (var key in obj) {
                                //         temp[key] = cloneObject(obj[key]);
                                //     }

                                //     return temp;
                                // }

                                // for(var i = 6; i < 12; i ++){
                                //     var t = cloneObject(testObj);
                                //     t.slot = i;
                                //     t.pd_id = t.pd_id+"_"+i;
                                //     t.size_gb = Math.floor(Math.random() * 100);
                                //     testArr.push(t);
                                // }

                                // gridStore.loadData(testArr);
                                /* End of testing Estimated Capacity and spare disk */

                                this.loadData(encGridData.pd_arr);
                            }
                        }
                    }
                });
            }
        },
        pool_composition_for_expand: {
            type: 'tree',
            autoLoad: false,
            autoSync: true,
            storeId: 'pool_composition_for_expand',
            proxy: {
                type: 'localstorage'
            },
            rootVisible: false,
            root: {
                expanded: true,
                children: [
                    // { text: 'Set One', leaf: true },
                    // { text: 'Set Two', leaf: true }
                ]
            }
        },
        pie_for_expand: {
            fields: ['item', 'capacity'],
            autoLoad: false,
            autoSync: true,
            storeId: 'pie_for_expand',
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
            loadCapacity: function(poolInfoData, index) {
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
            }
        },
        RAID_type: {
            fields: ['raid_type', 'raid_level'],
            data: []
        },
        spare_disk: {
            fields: ['pd_id', 'slot'],
            data: []
        }
    }
});
