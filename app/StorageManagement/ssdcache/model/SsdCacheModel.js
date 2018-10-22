Ext.define('DESKTOP.StorageManagement.ssdcache.model.SsdCacheModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ssdcache',
    data: {
        poolname: '--'
    },
    stores: {
        encInfo: {
            storeId: 'encInfo',
            fields: [''],
            autoLoad: true,
            needOnLoad: true,
            view: null,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                method: 'GET',
                extraParams: {
                    op: 'get_enclosure_info'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records) {
                        store.view.getController().on_create_boxs(records[0].data.data[0], store);
                        Ext.data.StoreManager.lookup('cacheInfo').load();
                    }
                }
            }
        },
        cacheInfo: {
            storeId: 'cacheInfo',
            fields: [''],
            autoLoad: false,
            needOnLoad: true,
            view: null,
            md5sum: 0,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                method: 'GET',
                extraParams: {
                    op: 'get_cache'
                },
                reader: {
                    type: 'json',
                    // rootProperty: 'data.pool_arr',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {
                        var mask = new Ext.LoadMask({
                            msg: 'loading',
                            target: store.view
                        });
                        mask.show();
                        store.loadData(records[0].data.data);
                        store.md5sum = records[0].data.md5sum;
                        var grid = store.view.down('#poollist');
                        grid.bindStore(store);
                        var check_status = function () {
                            Ext.Ajax.request({
                                url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                                method: 'GET',
                                params: {
                                    op: 'get_cache',
                                    md5sum: store.md5sum
                                },
                                success: function (response) {
                                    var res_obj = Ext.JSON.decode(response.responseText);
                                    var grid = store.view.down('#poollist');
                                    /* Clear disk slot if no data*/
                                    if (res_obj.data.length === 0 && store.md5sum !== res_obj.md5sum) {
                                        store.view.down('#btn_edit').setDisabled(true);
                                        store.view.getController().mapArr.map(function (arr) {
                                            var slot = "#" + 'disk_bay' + (arr - 1);
                                            store.view.down(slot).setStyle({
                                                border: '1px solid #fdfdfd',
                                                backgroundColor: 'initial',
                                                position: 'absolute'
                                            });
                                        });
                                    }
                                    /* Loading new data if there is changing*/
                                    if (res_obj.data.length !== 0 || store.md5sum !== res_obj.md5sum) {
                                        store.md5sum = res_obj.md5sum;
                                        var select_item = grid.getSelectionModel().getSelection()[0];
                                        store.loadData(res_obj.data);
                                        if (typeof (select_item) !== 'undefined') {
                                            var index = store.findExact('name', select_item.data.name);
                                            grid.getSelectionModel().select(index);
                                        } else {
                                            grid.getSelectionModel().select(0);
                                        }
                                    }
                                }
                            });
                        };
                        var task = Ext.TaskManager.start({
                            run: check_status,
                            interval: 5000,
                            args: store
                        });
                        if (store.count() > 0) {
                            grid.getSelectionModel().select(0);
                        }
                        mask.destroy();
                    }
                }
            }
        }
    }
});
