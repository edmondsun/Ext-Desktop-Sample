Ext.define('DESKTOP.SystemSetup.notification.controller.MailController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'DESKTOP.SystemSetup.notification.view.Mailadd'
    ],
    alias: 'controller.mail',
    init: function () {
        if (typeof Ext.data.StoreManager.lookup('mailtoaddr') == "undefined")
            this.getViewModel().getStore('mailtoaddr').load();
    },
    Send_test_mail: function (field) { // send test mail function
        var form = field.up('form'); // get the basic form
        var mailtype = form.down('combobox').getValue(); //get the combo value
        var mailaddr = form.down('#email').getValue(); //get the data of itemId email
        var gridstore = Ext.ComponentQuery.query('#Mail')[0].getViewModel('mail').getStore('mailtoaddr');
        var account = mailaddr.split('@', 1); //get the accout by split
        var mail_to_arr = [];
        for (var i = 0; i < gridstore.getCount(); i++) {
            mail_to_arr[i] = gridstore.getAt(i).getData().mail_to;
        }
        if (mail_to_arr[0] === "") {
            Ext.Msg.alert("Error", 'To send a test e-mail, you must specify at least one e-mail address.');
            return false;
        }
        var obj = { //set params object for submit if mailtype is custom
            op: 'test_mail',
            account: account,
            smtp_server: smtp_server + ":" + port,
            mail_to_arr: Ext.JSON.encode(mail_to_arr)
        };
        if (mailtype != 'custom') { //set params object for submit if mailtype is not custom
            var store = this.getViewModel('mail').getStore('emailinfo');
            var index = store.findExact('provider', mailtype);
            var smtp_server = store.getAt(index).getData().default_smtp_server;
            var auth_method = store.getAt(index).getData().default_auth_method;
            var port = store.getAt(index).getData().default_port;
            if (auth_method == 'ssl')
                auth_method = 2;
            else
                auth_method = 3;
            obj = {
                op: 'test_mail',
                smtp_server: smtp_server + ":" + port,
                auth_method: auth_method,
                port: port,
                account: account,
                mail_to_arr: Ext.JSON.encode(mail_to_arr)
            };
        }
        if (form.isValid()) { // make sure the form contains valid data
            var appwinController = form.up("#appwindow").getController();
            appwinController.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/notification/Mail.php',
                params: obj,
                success: function (form, action) {
                    appwinController.hideLoadingMask();
                    Ext.Msg.alert('Success', action.result.msg);
                },
                failure: function (form, action) {
                    appwinController.hideLoadingMask();
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    onCreate: function () { //show the Mailadd window
        var addmail = Ext.create('DESKTOP.SystemSetup.notification.view.Mailadd');
        addmail.show();
    },
    mail_ok: function (button) { //the add mailaddress function
        var win = button.up('window');
        var data = win.down('form').getValues(); //get the data in the form
        var store = Ext.ComponentQuery.query('#Mail')[0].getViewModel('mail').getStore('mailtoaddr');
        var index = store.findExact('mail_to', ''); //find the index of mail_to in store mailtoaddr if value is ''
        var filtercount = data.filter.length;
        var mailtoaddr = data.mail_to;
        var record = store.getAt(index);
        var recordcount = store.getCount();
        var count = 0;
        var filter = 0;
        var params = {};
        store.each(function (record, idx) {
            val = record.get('mail_to');
            if (val !== '') {
                count++;
            }
        });
        for (var i = 0; i < filtercount; i++) {
            filter += data.filter[i];
        }
        switch (index) {
        case 0:
            params = {
                op: 'add_mail',
                mail_to_1: mailtoaddr,
                filter_1: filter
            };
            break;
        case 1:
            params = {
                op: 'add_mail',
                mail_to_2: mailtoaddr,
                filter_2: filter
            };
            break;
        case 2:
            params = {
                op: 'add_mail',
                mail_to_3: mailtoaddr,
                filter_3: filter
            };
            break;
        }
        this.addMail(params, win);
        if (count == recordcount) //set eddit and delete button disable or enable
            Ext.ComponentQuery.query('#Mail')[0].down('#addmail').disable();
        else
            Ext.ComponentQuery.query('#Mail')[0].down('#addmail').enable();
        Ext.ComponentQuery.query('#mailgrid')[0].getSelectionModel().deselectAll(); //deselect the grid which was selected
    },
    onDelete: function () { //delete function
        var mail_obj = Ext.ComponentQuery.query('#Mail')[0];
        var selectedRecords = Ext.ComponentQuery.query('#mailgrid')[0].getSelectionModel().getSelection()[0]; //get selection record
        var store = mail_obj.getViewModel('mail').getStore('mailtoaddr');
        var count = 0;
        var index = store.findExact('mail_to', selectedRecords.data.mail_to);
        var recordcount = store.getCount();
        var gridstore = mail_obj.getViewModel('mail').getStore('mailtoaddr');
        var mailto = [];
        var info = [];
        var warning = [];
        var error = [];
        var backup_event = [];
        var filter = [];
        var i;
        for (i = 0; i < gridstore.getCount(); i++) { //get the grid data
            mailto[i] = gridstore.getAt(i).getData().mail_to;
            info[i] = gridstore.getAt(i).getData().info;
            warning[i] = gridstore.getAt(i).getData().warning;
            error[i] = gridstore.getAt(i).getData().error;
            backup_event[i] = gridstore.getAt(i).getData().backup_event;
        }
        var params = {};
        for (i = 0; i < gridstore.getCount(); i++) { //set the filter value
            if (info[i] !== 0)
                info[i] = info[i] << 2;
            if (warning[i] !== 0)
                warning[i] = warning[i] << 1;
            if (backup_event[i] !== 0)
                backup_event[i] = backup_event[i] << 3;
            filter[i] = info[i] + warning[i] + error[i] + backup_event[i];
        }
        store.each(function (record, idx) {
            val = record.get('mail_to');
            if (val !== '') {
                count++;
            }
        });
        switch (index) {
        case 0:
            params = {
                op: 'del_mail',
                mail_to_1: mailto[1],
                mail_to_2: mailto[2],
                mail_to_3: '',
                filter_1: filter[1],
                filter_2: filter[2],
                filter_3: 0
            };
            break;
        case 1:
            params = {
                op: 'del_mail',
                mail_to_1: mailto[0],
                mail_to_2: mailto[2],
                mail_to_3: '',
                filter_1: filter[0],
                filter_2: filter[2],
                filter_3: 0
            };
            break;
        case 2:
            params = {
                op: 'del_mail',
                mail_to_1: mailto[0],
                mail_to_2: mailto[1],
                mail_to_3: '',
                filter_1: filter[0],
                filter_2: filter[1],
                filter_3: 0
            };
            break;
        }
        this.deleteMail(params);
        mail_obj.down('#addmail').enable();
        mail_obj.down('#deletemail').disable();
    },
    deleteMail: function (params) {
        Ext.Ajax.request({
            url: 'app/SystemSetup/backend/notification/Mail.php',
            method: 'post',
            params: params,
            success: function (form, action) {
                Ext.ComponentQuery.query('#Mail')[0].getViewModel('mail').getStore('mailtoaddr').reload();
            },
            failure: function (response, options) {
                var respText = Ext.util.JSON.decode(response.responseText);
                var msg = respText.msg;
                Ext.MessageBox.alert('Failed', msg);
            }
        });
    },
    addMail: function (params, win) {
        var windowEl = win;
        var form = win.down('form');
        if (form.isValid()) {
            windowEl.mask('Saving...');
            Ext.Ajax.request({
                url: 'app/SystemSetup/backend/notification/Mail.php',
                method: 'post',
                params: params,
                success: function (form, action) {
                    windowEl.unmask();
                    Ext.ComponentQuery.query('#Mail')[0].getViewModel('mail').getStore('mailtoaddr').reload();
                    windowEl.close();
                },
                failure: function (response, options) {
                    windowEl.unmask();
                    var respText = Ext.util.JSON.decode(response.responseText);
                    var msg = respText.msg;
                    Ext.MessageBox.alert('Failed', msg);
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    on_Apply_All: function (myform, me) {
        var appwindow = me;
        var mail_obj = Ext.ComponentQuery.query('#Mail')[0];
        var gridstore = mail_obj.getViewModel('mail').getStore('mailtoaddr');
        var mailto = [];
        var info = [];
        var warning = [];
        var error = [];
        var backup_event = [];
        var filter = [];
        var i;
        for (i = 0; i < gridstore.getCount(); i++) { //get the grid data
            mailto[i] = gridstore.getAt(i).getData().mail_to;
            info[i] = gridstore.getAt(i).getData().info;
            warning[i] = gridstore.getAt(i).getData().warning;
            error[i] = gridstore.getAt(i).getData().error;
            backup_event[i] = gridstore.getAt(i).getData().backup_event;
        }
        for (i = 0; i < gridstore.getCount(); i++) { //set the filter value
            if (info[i] !== 0)
                info[i] = info[i] << 2;
            if (warning[i] !== 0)
                warning[i] = warning[i] << 1;
            if (backup_event[i] !== 0)
                backup_event[i] = backup_event[i] << 3;
            filter[i] = info[i] + warning[i] + error[i] + backup_event[i];
        }
        if (mail_obj.isValid()) { // make sure the form contains valid data
            var mailtype = mail_obj.down('combobox').getValue();
            if (mailtype != 'custom') { // check the mailtype
                var store = this.getViewModel('mail').getStore('emailinfo');
                var index = store.findExact('provider', mailtype);
                var smtp_server = store.getAt(index).getData().default_smtp_server;
                var auth_method = store.getAt(index).getData().default_auth_method;
                var port = store.getAt(index).getData().default_port;
                var mailaddr = mail_obj.down('#email').getValue();
                var account = mailaddr.split('@', 1);
                if (auth_method == 'ssl')
                    auth_method = 2;
                else {
                    auth_method = 3;
                }
                appwindow.showLoadingMask();
                mail_obj.submit({
                    url: 'app/SystemSetup/backend/notification/Mail.php',
                    params: {
                        op: 'set_mail',
                        smtp_server: smtp_server,
                        auth_method: auth_method,
                        mail_to_1: mailto[0],
                        mail_to_2: mailto[1],
                        mail_to_3: mailto[2],
                        filter_1: filter[0],
                        filter_2: filter[1],
                        filter_3: filter[2],
                        account: account
                    },
                    success: function (form, action) {
                        gridstore.reload();
                        mail_obj.getViewModel('mail').getStore('mailtoaddr').reload();
                        mail_obj.getViewModel('mail').getStore('getmail').reload();
                        var ref = 0;
                        appwindow.getresponse(ref, 'Mail');
                        appwindow.hideLoadingMask();
                    },
                    failure: function (form, action) {
                        gridstore.reload();
                        mail_obj.getViewModel('mail').getStore('mailtoaddr').reload();
                        mail_obj.getViewModel('mail').getStore('getmail').reload();
                        var ref = action.result.msg;
                        appwindow.getresponse(ref, 'Mail');
                        appwindow.hideLoadingMask();
                    }
                });
            }
            if (mailtype == 'custom') {
                appwindow.showLoadingMask();
                mail_obj.submit({
                    url: 'app/SystemSetup/backend/notification/Mail.php',
                    params: {
                        op: 'set_mail',
                        mail_to_1: mailto[0],
                        mail_to_2: mailto[1],
                        mail_to_3: mailto[2],
                        filter_1: filter[0],
                        filter_2: filter[1],
                        filter_3: filter[2]
                    },
                    success: function (form, action) {
                        gridstore.reload();
                        mail_obj.getViewModel('mail').getStore('mailtoaddr').reload();
                        mail_obj.getViewModel('mail').getStore('getmail').reload();
                        var ref = 0;
                        appwindow.getresponse(ref, 'Mail');
                        appwindow.hideLoadingMask();
                    },
                    failure: function (form, action) {
                        gridstore.reload();
                        mail_obj.getViewModel('mail').getStore('mailtoaddr').reload();
                        mail_obj.getViewModel('mail').getStore('getmail').reload();
                        var ref = action.result.msg;
                        appwindow.getresponse(ref, 'Mail');
                        appwindow.hideLoadingMask();
                    }
                });
            }
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    dirtycheck: function () {
        var oringinalstore = Ext.data.StoreManager.lookup('initMailRecord');
        var gridstore = Ext.data.StoreManager.lookup('mailtoaddr');
        var oringinal_value = {};
        var oringinal_sum = 0;
        var dirty_value = {};
        var dirty_sum = 0;
        oringinalstore.each(function (record, index) {
            oringinal_sum = 0;
            if (record.data.mail_to !== "") {
                if (record.data.info == 1) {
                    oringinal_sum += (record.data.info << 2);
                }
                if (record.data.warning == 1) {
                    oringinal_sum += (record.data.warning << 1);
                }
                if (record.data.backup_event == 1) {
                    oringinal_sum += (record.data.backup_event << 3);
                }
                if (record.data.error == 1) {
                    oringinal_sum += record.data.error;
                }
                oringinal_value[index] = oringinal_sum;
            }
        });
        gridstore.each(function (record, index) {
            dirty_sum = 0;
            if (record.data.mail_to !== "") {
                if (record.data.info == 1) {
                    dirty_sum += (record.data.info << 2);
                }
                if (record.data.warning == 1) {
                    dirty_sum += (record.data.warning << 1);
                }
                if (record.data.backup_event == 1) {
                    dirty_sum += (record.data.backup_event << 3);
                }
                if (record.data.error == 1) {
                    dirty_sum += record.data.error;
                }
                dirty_value[index] = dirty_sum;
            }
        });
        if (this.getView().isDirty() || Ext.JSON.encode(dirty_value) != Ext.JSON.encode(oringinal_value)) {
            return true;
        } else
            return false;
    }
});
