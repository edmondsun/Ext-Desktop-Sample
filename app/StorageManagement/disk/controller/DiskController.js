Ext.define('DESKTOP.StorageManagement.disk.controller.DiskController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.disk',
    requires: [
        'DESKTOP.StorageManagement.disk.view.ReplaceDisk'
    ],
    afterview: function (me) {
        me.getViewModel().getStore('encInfo').view = me;
        me.getViewModel().getStore('pdStore').view = me;
    },
    on_test: function (field) {
        var test_el = {};
        test_el.enc_id = field.up('form').down('combo').getValue();
        test_el.slot = field.up('form').down('#dSlot').getValue();
        var test = Ext.create('DESKTOP.StorageManagement.disk.view.SmartTesting', test_el);
        test.show();
    },
    on_test_stop: function (field) {
        var form = field.up('window'),
            pd_id = form.down('#testingPdid').getValue();
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
                    form.down('#status').setFieldLabel('');
                    form.down('#status').setValue('');
                    form.down('#btnHide').setVisible(false);
                    form.down('#btnStop').setVisible(false);
                    form.down('#btnDl').setVisible(true);
                    form.down('#btnTest').setVisible(true);
                    form.down('#btnCancel').setVisible(true);
                    clearInterval(form.down('#timeoutId').getValue());
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
    on_global_spare: function (field) {
        var main_grid = field.up('#Disk').down('grid'),
            select_item = main_grid.getSelectionModel().getSelection()[0],
            pd_id = select_item.get('pd_id');
        Ext.Msg.show({
            title: 'Really Set Global Spare ?',
            message: 'Do you really want to set the slot ' + select_item.get('slot') + ' for global spare  ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: field.up('#Disk')
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'post',
                        params: {
                            op: 'set_global_spare',
                            pd_id: pd_id
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg);
                            } else {
                                Ext.Msg.alert("Success", "Set global spare success !");
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
    },
    on_set_freedisk: function (field) {
        var main_grid = field.up('#Disk').down('grid'),
            select_item = main_grid.getSelectionModel().getSelection()[0],
            pd_id = select_item.get('pd_id');
        Ext.Msg.show({
            title: 'Really Set Free ?',
            message: 'Do you really want to free disk for slot ' + select_item.get('slot') + ' ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: field.up('#Disk')
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'post',
                        params: {
                            op: 'set_free',
                            pd_id: pd_id
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Failed", msg);
                            }
                            Ext.Msg.alert("Success", "Free disk success!");
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
    on_replace_disk: function (field) {
        var replace_window = Ext.create('DESKTOP.StorageManagement.disk.view.ReplaceDisk'),
            main_grid = field.up('#Disk').down('grid'),
            select_item = main_grid.getSelectionModel().getSelection()[0],
            size_gb = select_item.get('size_gb'),
            grid_store = main_grid.getStore(),
            data = [];
        grid_store.each(function (record) {
            if ((record.get('usage') === "FreeDisk" || record.get('usage') === "DedicatedSpare") && record.get('size_gb') >= size_gb) {
                data.push(record);
            }
        });
        if (data.length === 0) {
            replace_window.down('#repalceInfo').setVisible(false);
            replace_window.down('#diskLabel').setVisible(false);
            replace_window.down('#noReplace').setVisible(true);
        } else {
            var store = Ext.create('Ext.data.Store', {
                fields: [''],
                data: data
            });
            replace_window.down('#repalceInfo').setStore(store);
        }
        replace_window.down('#slot').setValue(select_item.get('slot'));
        replace_window.down('#pool').setValue(select_item.get('pool'));
        replace_window.down('#pd_id').setValue(select_item.get('pd_id'));
        replace_window.show();
    },
    on_replace_apply: function (field) {
        var main = field.up('window'),
            grid = main.down('grid'),
            select_item = grid.getSelectionModel().getSelection()[0],
            pd_id = main.down('#pd_id').getValue(),
            pool_name = main.down('#pool').getValue();
        if (typeof (select_item) === 'undefined') {
            Ext.Msg.alert('No selection', 'No selected item, please try again !');
        } else {
            var spare_id = select_item.get('pd_id');
            var mask = new Ext.LoadMask({
                msg: 'Please wait processing your request',
                target: field.up('window')
            });
            mask.show();
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'post',
                params: {
                    op: 'replace_pool_pd',
                    pd_id: pd_id,
                    pool_name: pool_name,
                    spare_pd_id: spare_id
                },
                success: function (response) {
                    mask.destroy();
                    if ((Ext.JSON.decode(response.responseText)).success === false) {
                        var msg = (Ext.JSON.decode(response.responseText)).msg;
                        Ext.Msg.alert("Error", msg);
                    }
                    field.up('window').close();
                },
                failure: function (response) {
                    mask.destroy();
                    Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                }
            });
        }
    },
    on_turnon_led: function (field) {
        var form = field.up('#Disk'),
            main_grid = form.down('grid'),
            select_item = main_grid.getSelectionModel().getSelection()[0],
            select_diskbox = '#disk_bay' + (select_item.get('slot') - 1),
            pd_id = select_item.get('pd_id');
        Ext.Msg.show({
            title: 'Really Turn On ?',
            message: 'Are you sure to turn on the indication LED for slot ' + select_item.get('slot') + ' ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: field.up('#Disk')
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'post',
                        params: {
                            op: 'set_ident_led_on',
                            pd_id: pd_id
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg);
                            }
                            main_grid.down('#btnTurnon').setVisible(false);
                            main_grid.down('#btnTurnoff').setVisible(true);
                            form.down(select_diskbox).setStyle({
                                backgroundImage: 'url(app/StorageManagement/images/turn_on.gif)'
                            });
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
    on_turnoff_led: function (field) {
        var form = field.up('#Disk'),
            main_grid = form.down('grid'),
            select_item = main_grid.getSelectionModel().getSelection()[0],
            select_diskbox = '#disk_bay' + (select_item.get('slot') - 1),
            pd_id = select_item.get('pd_id');
        Ext.Msg.show({
            title: 'Really Turn Off ?',
            message: 'Are you sure to turn off the indication LED for slot ' + select_item.get('slot') + ' ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: field.up('#Disk')
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/disk/Disk.php',
                        method: 'post',
                        params: {
                            op: 'set_ident_led_off',
                            pd_id: pd_id
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg);
                            }
                            main_grid.down('#btnTurnon').setVisible(true);
                            main_grid.down('#btnTurnoff').setVisible(false);
                            form.down(select_diskbox).setStyle({
                                backgroundImage: 'none'
                            });
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
    on_grid_select: function (record) {
        var form = Ext.ComponentQuery.query('#Disk')[0],
            select_item = record.getSelection()[0],
            select_diskbox = '#disk_bay' + (select_item.get('slot') - 1);
        form.down(select_diskbox).el.fireEvent('click');
        if (select_item.get('pool_status') !== "Failed") {
            if ((select_item.get('health') === "Reserved" || select_item.get('usage') === "RAIDDisk") && select_item.get('pd_id').length > 0) {
                form.down('#btnFreedisk').setDisabled(false);
            } else {
                form.down('#btnFreedisk').setDisabled(true);
            }
            if ((select_item.get('health') !== "Reserved" && select_item.get('usage') === "RAIDDisk") && select_item.get('pd_id').length > 0 && select_item.get('pool').length > 0) {
                form.down('#btnReplace').setDisabled(false);
            } else {
                form.down('#btnReplace').setDisabled(true);
            }
        }
        // if ((select_item.get('smartctl_arr').status).slice(0, 11) != "SelfTesting") {
        //     form.down('#btnTest').setDisabled(false);
        // } else {
        //     form.down('#btnTest').setDisabled(true);
        // }
        form.down('#btnTest').setDisabled(false);
        if (select_item.get('usage') != 'FreeDisk')
            form.down('#btnGlobal').setDisabled(true);
        else
            form.down('#btnGlobal').setDisabled(false);
        if (select_item.get('ident') === 0) {
            form.down('#btnTurnon').setVisible(true);
            form.down('#btnTurnon').setDisabled(false);
            form.down('#btnTurnoff').setVisible(false);
        } else {
            form.down('#btnTurnoff').setVisible(true);
            form.down('#btnTurnoff').setDisabled(false);
            form.down('#btnTurnon').setVisible(false);
        }
    },
    onComboselect: function (combo, record) {
        var pdStore = Ext.data.StoreManager.lookup('pdStore');
        pdStore.proxy.extraParams = {
            enc_id: record.data.enc_id
        };
        pdStore.reload();
        this.on_create_boxs(record.data, combo.getStore());
        // form.down('#dStatus').reset();
        // form.down('#dSlot').reset();
        // form.down('#dDrive').reset();
        // form.down('#dCapc').reset();
        // form.down('#dTemp').reset();
        // form.down('#dHdd').reset();
        // form.down('#dTestTime').reset();
        // form.down('#dTResult').reset();
    },
    on_create_diskboxs: function (store) {
        var store_items = store.data.items,
            form = store.view;
        Ext.each(store_items, function (obj, index) {
            var slot = "#" + 'disk_bay' + (obj.get('slot') - 1);
            switch (obj.get('connect_stat')) {
            case 'Online':
                form.down(slot).setStyle({
                    border: '1px solid #32c1c7',
                    backgroundColor: '#32c1c7',
                    position: 'absolute'
                });
                if (obj.get('ident') === 1) {
                    form.down(slot).setStyle({
                        backgroundImage: 'url(app/StorageManagement/images/turn_on.gif)'
                    });
                }
                break;
            default:
                form.down(slot).setStyle({
                    background: 'red'
                });
            }
            form.down(slot).el.on({
                click: function () {
                    form.down('grid').getSelectionModel().select(index);
                    form.down('#displayField').setVisible(true);
                    form.down('#noItems').setVisible(false);
                }
            });
        });
        var select_item = form.down('grid').getSelectionModel().getSelection()[0];
        if (typeof (select_item) === 'undefined') {
            form.down('grid').getSelectionModel().select(0, true);
            if (typeof (form.down('grid').getSelectionModel().getSelection()[0]) === 'undefined') {
                form.down('#displayField').setVisible(false);
                form.down('#noItems').setVisible(true);
            }
        }
    },
    on_create_boxs: function (record, encInfo_store) {
        var cls = Ext.ComponentQuery.query('[cls=disk_bay]'),
            form = encInfo_store.view,
            enc_row = record.row,
            enc_seq = record.sequence.split(" "),
            boxs = [],
            c = form.down('#drawing');
        Ext.each(cls, function () {
            this.destroy();
        });

        Ext.Array.each(enc_seq, function (name, index, countriesItSelf) {
            var v = Ext.create('Ext.Component', {
                cls: 'disk_bay',
                itemId: 'disk_bay' + (name - 1),
                border: true,
                x: 20 + parseInt((name - 1) / enc_row, 10) * 79,
                y: 57 + ((name - 1) % enc_row) * 21,
                width: 78,
                height: 20,
                style: "overflow:hidden;border:1px solid #fdfdfd;border-radius:2px;position:absolute"
            });
            boxs.push(v);
        });
        c.add(boxs);
        c.doLayout();
        Ext.each(boxs, function (obj, index) {
            obj.el.on({
                mouseover: function () {
                    this.setStyle({
                        // border: '1px solid #0ff'
                        // backgroundImage: 'url(app/StorageManagement/images/clicked.png)'
                    });
                },
                mouseout: function () {
                    this.setStyle({
                        // border: '1px solid #fdfdfd'
                        // backgroundImage: 'none'
                    });
                },
                click: function () {
                    Ext.each(boxs, function (obj, index) {
                        this.setStyle({
                            border: '1px solid #fdfdfd'
                                // backgroundImage: 'none'
                        });
                    });
                    this.setStyle({
                        border: '2px solid #ff0'
                    });
                    form.down('#displayField').setVisible(false);
                    form.down('#noItems').setVisible(true);
                }
            });
        });
    },
    set_right_left_button: function (store) {
        var form = store.view,
            combo = form.down('#com_enc'),
            c_store = combo.getStore(),
            value = combo.getRawValue(),
            index = c_store.findExact('enc_name', value),
            num = c_store.getCount(index);
        form.down('#btnGlobal').setDisabled(true);
        form.down('#btnTest').setDisabled(true);
        form.down('#btnFreedisk').setDisabled(true);
        form.down('#btnReplace').setDisabled(true);
        form.down('#btnTurnon').setDisabled(true);
        form.down('#btnTurnoff').setDisabled(true);
        if (index > 0) {
            form.down('#btnLeft').setDisabled(false);
        } else {
            form.down('#btnLeft').setDisabled(true);
        }
        if (num - index <= 1) {
            form.down('#btnRight').setDisabled(true);
        } else {
            form.down('#btnRight').setDisabled(false);
        }
    },
    on_leftBtn_click: function (field) {
        var form = field.up('form'),
            combo = form.down('#com_enc'),
            value = combo.getRawValue(),
            store = combo.getStore(),
            index = store.findExact('enc_name', value),
            num = store.getCount();
        if (index >= 1) {
            var prerecord = store.getAt(index - 1);
            combo.select(prerecord);
            combo.fireEvent('select', combo, prerecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);
        if (a_index === 0) {
            field.setDisabled(true);
            field.up('form').down('#btnRight').setDisabled(false);
        } else if (a_index + 1 !== num) {
            field.up('form').down('#btnRight').setDisabled(false);
        } else {
            field.up('form').down('#btnRight').setDisabled(false);
            field.setDisabled(false);
        }
    },
    on_rightBtn_click: function (field) {
        var form = field.up('form'),
            combo = form.down('#com_enc'),
            value = combo.getRawValue(),
            store = combo.getStore(),
            index = store.findExact('enc_name', value),
            num = store.getCount();
        if (num - index > 1) {
            var nextrecord = store.getAt(index + 1);
            combo.select(nextrecord);
            combo.fireEvent('select', combo, nextrecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);
        if (a_index + 1 === num) {
            field.setDisabled(true);
            field.up('form').down('#btnLeft').setDisabled(false);
        } else if (a_index > 0) {
            field.up('form').down('#btnLeft').setDisabled(false);
        } else {
            field.up('form').down('#btnLeft').setDisabled(false);
            field.setDisabled(false);
        }
    }
});
