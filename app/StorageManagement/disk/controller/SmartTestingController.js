Ext.define('DESKTOP.StorageManagement.disk.controller.SmartTestingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.smarttest',
    init: function () {
        if (typeof (this.view.slot) == 'undefined' || typeof (this.view.enc_id) == 'undefined') {
            Ext.Msg.alert("Something wrong!", 'Can not find disk');
            this.view.destroy();
        } else {
            var pdStore = this.getViewModel().getStore('pdStore_test');
            pdStore.proxy.extraParams = {
                enc_id: this.view.enc_id
            };
            pdStore.mycontroller = this;
            pdStore.load();
        }
    },
    set_test_val: function () {
        var pdStore = Ext.data.StoreManager.lookup('pdStore_test'),
            slot = this.view.slot,
            index = pdStore.findExact('slot', slot),
            records = pdStore.data.items[index].data,
            select_slot = "Slot No." + slot + " " + records.vendor + " " + records.serial + "(" + records.rate + ")",
            select_status = records.smartctl_arr.status;
        if (select_status.slice(0, 11) === "SelfTesting") {
            this.view.down('#btnHide').setVisible(true);
            this.view.down('#btnStop').setVisible(true);
            this.view.down('#btnCancel').setVisible(false);
            this.view.down('#btnTest').setVisible(false);
            this.view.down('#status').setFieldLabel('SMART testing status: ');
            this.view.down('#status').setValue(select_status);
        }
        if (records.smartctl_arr.log_exist === 'Yes') {
            this.view.down('#btnDl').setVisible(true);
        }
        this.view.down('#sDisk').setValue(select_slot);
        this.view.down('#testingPdid').setValue(records.pd_id);
    },
    on_test_start: function (field) {
        var pd_id = field.up('window').down('#testingPdid').getValue(),
            win = field.up('window'),
            status = win.down('#status');
        status.setVisible(true);
        status.setFieldLabel('SMART testing status: ');
        win.down('#btnHide').setVisible(true);
        win.down('#btnStop').setVisible(true);
        win.down('#btnCancel').setVisible(false);
        win.down('#btnTest').setVisible(false);
        win.down('#btnDl').setVisible(false);
        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/disk/Disk.php',
            method: 'post',
            params: {
                op: 'start_smartctl_test',
                pd_id: pd_id
            },
            success: function (response) {
                if ((Ext.JSON.decode(response.responseText)).success === false) {
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    Ext.Msg.alert("Error", msg);
                }
            },
            failure: function (response) {
                Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
            }
        });
    },
    on_test_stop: function (field) {
        var win = field.up('window'),
            status = win.down('#status'),
            pd_id = win.down('#testingPdid').getValue();
        Ext.Msg.show({
            title: 'Really Stop ?',
            message: 'Do you really want to stop smart testing ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: field.up('window')
                    });
                    mask.show();
                    status.setVisible(false);
                    win.down('#btnHide').setVisible(false);
                    win.down('#btnStop').setVisible(false);
                    win.down('#btnDl').setVisible(true);
                    win.down('#btnTest').setVisible(true);
                    win.down('#btnCancel').setVisible(true);
                    clearInterval(win.down('#timeoutId').getValue());
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'post',
                        params: {
                            op: 'stop_smartctl_test',
                            pd_id: pd_id
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg);
                            }
                        },
                        failure: function (response) {
                            mask.destroy();
                            Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                        }
                    });
                }
            }
        });
    },
    on_download_smartlog: function (field) {
        var pd_id = field.up('window').down('#testingPdid').getValue();
        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true
        });
        form.submit({
            url: 'app/StorageManagement/backend/disk/Disk.php',
            params: {
                op: 'download_smartctl_log',
                pd_id: pd_id
            },
            success: function (form, action) {
                Ext.Msg.alert('Success', action.result.msg);
            },
            failure: function (form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
            }
        });
    }
});
