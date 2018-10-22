Ext.define('DESKTOP.StorageManagement.disk.model.SmartTestingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.smarttest',
    requires: ['DESKTOP.StorageManagement.disk.controller.SmartTestingController'],
    data: {
        test_status: '{}'
    },
    stores: {
        pdStore_test: {
            storeId: 'pdStore_test',
            fields: [''],
            // autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                extraParams: {
                    enc_id: 0
                },
                reader: {
                    type: 'json',
                    // rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records) {
                        store.prepare_smart_data(store, records);
                        store.mycontroller.set_test_val();
                    }
                }
            },
            prepare_smart_data: function (store, records) {
                var record = records[0];
                var params = {
                    md5sum: record.data.md5sum
                };
                if (typeof (records[0].data.data[0]) !== 'undefined') {
                    store.loadData(records[0].data.data[0].pd_arr);
                } else {
                    store.removeAll();
                }
                params.enc_id = store.proxy.extraParams.enc_id;
                var index = store.findExact('slot', store.mycontroller.view.slot);
                var pd_record = store.data.items[index].data;
                store.mycontroller.getViewModel().set('test_status', pd_record.status);
                if (typeof (store.enc_status) !== 'undefined') {
                    clearInterval(store.enc_status);
                }
                store.enc_status = setInterval(function () {
                    get_smart_data(store, params);
                }, 3000);
                get_smart_data = function (store, params) {
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'GET',
                        async: false,
                        params: params,
                        success: function (response) {
                            var res = Ext.JSON.decode(response.responseText);
                            if (res.data.length !== 0) {
                                clearInterval(store.enc_status);
                                store.reload();
                            }
                        }
                    });
                };
            }
        }
    }
});
