Ext.define('DESKTOP.StorageManagement.snapshot.model.ManagementModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.snapshotmanagement',
    requires: ['DESKTOP.lib.initDay'],
    data: {
        FreeGB: '0',
        UsedGB: '0',
        SnapshotGB: '0',
        Name: 'No data',
        SnapshotTypeDefault: 'None'
    },
    formulas: {
        SnapshotType: {
            get: function (get) {
                var ret = get('SnapshotTypeDefault');
                if (ret === '') {
                    ret = 'None';
                }
                return ret;
            }
        }
    },
    stores: {
        snapshotInfo: {
            storeId: 'snapshotInfo',
            fields: [
                'name'
            ],
            selfController: null,
            loadedtimes: 0,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/snapshot/Snapshot.php',
                method: 'get',
                extraParams: {
                    query_type: 'all',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            queryType: function (combo, record) {
                var query_type = null;
                if (typeof record !== "undefined") { //the view rendered first time ,combo's val is 'undefined'
                    this.proxy.extraParams.query_type = combo.getValue();
                    query_type = combo.getValue();
                } else {
                    query_type = 'all';
                }
                this.clearFilter(true); //always handle the store filter before store load
                this.load({
                    callback: function (records, operation, success) { //this = store
                        this.loadData(records[0].data.data);
                        this.selfController.onSearch();
                        this.infoPolling(records[0].data.md5sum, query_type, this);
                        /*can't controller store.loadData was finished */
                        this.selfController.getView().down('#snapshotgrid').bindStore(this);
                        if (this.loadedtimes === 0) {
                            var grid = this.selfController.getView().down('#snapshotgrid');
                            if (grid.getStore().data.length !== 0) {
                                grid.getSelectionModel().select(0);
                            }
                        }
                        this.loadedtimes++;
                        // else {
                        //     Ext.data.StoreManager.lookup('pie').reload();
                        //     Ext.data.StoreManager.lookup('snapshotlist').reload();
                        // }
                    }
                });
            },
            infoPolling: function (md5, query_type, store) {
                Ext.TaskManager.destroy();
                store.md5sum = md5;
                var check_status = function () {
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/snapshot/Snapshot.php',
                        method: 'GET',
                        params: {
                            query_type: query_type,
                            md5sum: store.md5sum
                        },
                        success: function (response) {
                            var res_obj = Ext.JSON.decode(response.responseText);
                            if (res_obj.data.length !== 0) {
                                store.md5sum = res_obj.md5sum;
                                var grid = store.selfController.getView().down('#snapshotgrid');
                                var select_item = grid.getSelectionModel().getSelection()[0];
                                store.clearFilter(true);
                                store.selfController.onSearch();
                                store.loadData(res_obj.data);
                                if (typeof (select_item) !== 'undefined') {
                                    var index = store.findExact('name', select_item.data.name);
                                    grid.getSelectionModel().select(index, true);
                                }
                            }
                        }
                    });
                };
                var task = Ext.TaskManager.start({
                    run: check_status,
                    interval: 10000,
                    args: store
                });
            }
        },
        pie: {
            fields: ['name', 'size'],
            storeId: 'pie',
            proxy: {
                type: 'localstorage'
            },
            data: [{
                name: 'Free',
                size: 0
            }, {
                name: 'Used',
                size: 0
            }, {
                name: 'Snapshot',
                size: 0
            }]
        },
        snapshotlist: {
            fields: ['name', 'createtime'],
            storeId: 'snapshotlist',
            proxy: {
                type: 'localstorage'
            }
        },
        hrstore: {
            fields: ['hourvalue'],
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('hourvalue', 0, 23);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        minstore: {
            fields: ['minvalue'],
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('minvalue', 0, 59);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        monthstore: {
            fields: ['monthvalue'],
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('monthvalue', 1, 31);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        reapethrstore: {
            fields: ['hourvalue'],
            data: [{
                hourvalue: '01'
            }, {
                hourvalue: '02'
            }, {
                hourvalue: '03'
            }, {
                hourvalue: '04'
            }, {
                hourvalue: '06'
            }, {
                hourvalue: '08'
            }, {
                hourvalue: '12'
            }]
        }
    }
});
