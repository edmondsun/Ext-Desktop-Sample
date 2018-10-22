Ext.define('DESKTOP.SystemSetup.network.controller.AdvancedController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.advanced',
    requires: [],
    //Button Function
    onStart: function (field) {
        var diagmode = field.up('form').down('combobox').getValue();
        var addr = field.up('form').down('combobox').next('textfield').getValue();
        var ipmode = field.up('form').down('combobox').next('combobox').getValue();
        var textarea = field.up('form').down('textareafield');
        textarea.setValue('');
        if (diagmode == "Ping") {
            var doping = function () {
                Ext.Ajax.request({
                    url: 'app/SystemSetup/backend/network/Advanced.php',
                    method: 'post',
                    params: {
                        op: 'ping_trace',
                        diagmode: diagmode,
                        addr: addr,
                        ipmode: ipmode
                    },
                    success: function (response) {
                        var msg = (Ext.JSON.decode(response.responseText)).msg;
                        if (textarea.getValue() !== '') {
                            textarea.setValue(textarea.getValue() + "\n" + msg);
                            textarea.inputEl.scroll('b', 100000, true); //'b' is  bottom
                        } else
                            textarea.setValue(msg);
                    }
                });
            };
            var task = Ext.TaskManager.start({
                scope: this,
                run: doping,
                interval: 1000
            });
            Ext.TaskManager.start(task);
            //field.disable();
        } else {
            var pid = null;
            var phpid = null;
            Ext.Ajax.request({
                url: 'app/SystemSetup/backend/network/Advanced.php',
                method: 'post',
                params: {
                    op: 'ping_trace',
                    diagmode: diagmode,
                    addr: addr,
                    ipmode: ipmode
                },
                success: function (response) {
                    var str = (Ext.JSON.decode(response.responseText)).msg;
                    phpid = str.phpid;
                    pid = str.pid;
                    var dotraceroute = function () {
                        Ext.Ajax.request({
                            url: 'app/SystemSetup/backend/network/Advanced.php',
                            method: 'post',
                            params: {
                                op: 'ping_trace',
                                diagmode: 'query',
                                phpid: phpid,
                                pid: pid
                            },
                            success: function (response) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg.msg;
                                var done = (Ext.JSON.decode(response.responseText)).msg.done;
                                textarea.setValue(msg);
                                textarea.inputEl.scroll('b', 100000, true);
                                if (done === true) {
                                    Ext.TaskManager.stopAll();
                                }
                            }
                        });
                    };
                    var task = Ext.TaskManager.start({
                        scope: this,
                        run: dotraceroute,
                        interval: 1000
                    });
                    Ext.TaskManager.start(task);
                }
            });
        }
        field.setText("Stop");
        field.handler = 'onStop';
    },
    onStop: function (field) {
        //field.prev('button').enable();
        Ext.TaskManager.stopAll();
        field.setText("Start");
        field.handler = 'onStart';
    },
    on_Apply_All: function (form, me) {
        var lan = Ext.ComponentQuery.query('#conLoopbackchd')[0].down('combobox').getValue();
        console.log('lan', lan);
        var loopback_enable = Ext.ComponentQuery.query('#loopbackchd')[0].getSubmitValue();
        console.log('loopbackchd', loopback_enable);
        var appwindow = me;
        appwindow.showLoadingMask();
        Ext.Ajax.request({
            url: 'app/SystemSetup/backend/network/Advanced.php',
            method: 'post',
            params: {
                op: 'loopback_setting',
                nic_id: lan,
                loopback_enable: loopback_enable
            },
            success: function () {
                var ref = 0;
                appwindow.getresponse(ref, 'Advanced');
                appwindow.hideLoadingMask();
                Ext.ComponentQuery.query('#Advanced')[0].getViewModel().getStore('lobkcombo').reload();
                Ext.ComponentQuery.query('#Advanced')[0].getViewModel().getStore('init').reload();
            },
            failure: function (form, action) {
                var ref = action.result.msg;
                appwindow.getresponse(ref, 'Advanced');
                appwindow.hideLoadingMask();
                Ext.ComponentQuery.query('#Advanced')[0].getViewModel().getStore('lobkcombo').reload();
                Ext.ComponentQuery.query('#Advanced')[0].getViewModel().getStore('init').reload();
            }
        });
    },
    onFlush: function (field) {
        var store = this.getViewModel().getStore('arpGrid');
        var conditionType = field.up('form').down('radiofield').getValue();
        var ip = field.up('form').down('radiofield').next('textfield').getValue();
        var queryStr = null;
        if (ip.match(/\w+/) === null && ip !== "") {
            queryStr = new RegExp("(\\" + ip + ")", "gi");
        } else {
            queryStr = new RegExp("(" + ip + ")", "gi");
        }
        if (conditionType === true) {
            queryStr = new RegExp("", "gi");
        }
        store.clearFilter(true);
        store.reload();
        store.filter({
            filterFn: function (record) {
                var name = record.get('addr');
                var match = name.match(queryStr);
                return match;
            }
        });
    },
    onCancel: function (field) {
        Ext.Ajax.request({
            url: 'app/SystemSetup/backend/network/Advanced.php',
            method: 'post',
            params: {
                op: 'net_arp_stop'
            },
            success: function () {
                var msg = "Stop ARP";
                Ext.MessageBox.alert('Success', msg);
            }
        });
    }
});
