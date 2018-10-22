Ext.define('DESKTOP.SystemSetup.network.controller.RoutingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.routing',
    requires: [
        'DESKTOP.SystemSetup.network.view.RoutingSettingCreate4',
        'DESKTOP.SystemSetup.network.view.RoutingSettingCreate6'
    ],
    init: function () {
        this.getViewModel().getStore("get_ipv6_enable").selVM = this.getViewModel();
        // this.getView().up("#appwindow").down("#tabs").on('tabchange',this.OK,this);
    },
    // OK:function(tabPanel, newCard, oldCard, eOpts){
    //     if(newCard.itemId =="tabRouting"){
    //         alert("routing")
    //     }
    //     else
    //         alert("else")
    // },
    //Button Function
    onEdit: function (btn) {
        var store;
        var idx;
        var ifacevalue;
        switch (btn.itemId) {
        case "EditIPv4":
            var selectipv4 = Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().getSelection()[0];
            if (typeof (selectipv4) !== "undefined") {
                var IPv4Setting = Ext.create('DESKTOP.SystemSetup.network.view.RoutingSettingCreate4');
                store = this.getStore('get_cur_iface');
                idx = store.find('name', selectipv4.get('iface'));
                if (idx < 0) {
                    Ext.Msg.alert('Warning', 'No ' + selectipv4.data.iface + ' in routing table');
                } else {
                    IPv4Setting.show();
                    IPv4Setting.setTitle('IPv4 static route setting');
                    IPv4Setting.down('#subnetmask').setValue(selectipv4.get('mask'));
                    IPv4Setting.down('#Destination').setValue(selectipv4.get('dst_addr'));
                    IPv4Setting.down('#Gateway').setValue(selectipv4.get('gateway'));
                    IPv4Setting.down('#Metric').setValue(selectipv4.get('metric'));
                    ifacevalue = store.getAt(idx).data.value;
                    Ext.Ajax.request({
                        url: 'app/SystemSetup/backend/network/Interfaces.php',
                        method: 'get',
                        params: {
                            op: 'get_iface_addr',
                            iface: ifacevalue
                        },
                        success: function (response) {
                            var ipv4ip = (Ext.JSON.decode(response.responseText)).data.ipv4_Addr;
                            IPv4Setting.down('#IP_addr').setValue(ipv4ip);
                        },
                        failure: function () {
                            Ext.Msg.alert("Failed", "Something wrong!");
                        }
                    });
                }
            } else {
                Ext.Msg.alert("Error", 'No selected');
            }
            break;
        case "EditIPv6":
            var selectipv6 = Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().getSelection()[0];
            if (typeof (selectipv6) !== "undefined") {
                var IPv6Setting = Ext.create('DESKTOP.SystemSetup.network.view.RoutingSettingCreate6');
                store = this.getStore('get_cur_iface_ipv6');
                idx = store.find('name', selectipv6.get('iface'));
                if (idx < 0) {
                    Ext.Msg.alert('Warning', 'No ' + selectipv6.data.iface + ' in routing table,or you did not enable IPv6');
                } else {
                    IPv6Setting.show();
                    IPv6Setting.setTitle('IPv6 static route setting');
                    IPv6Setting.down('#Prefix').setValue(selectipv6.get('prefix'));
                    IPv6Setting.down('#Destination').setValue(selectipv6.get('dst_addr'));
                    IPv6Setting.down('#Gateway').setValue(selectipv6.get('gateway'));
                    IPv6Setting.down('#Metric').setValue(selectipv6.get('metric'));
                    ifacevalue = store.getAt(idx).data.value;
                    Ext.Ajax.request({
                        url: 'app/SystemSetup/backend/network/Interfaces.php',
                        method: 'get',
                        params: {
                            op: 'get_iface_addr',
                            iface: ifacevalue
                        },
                        success: function (response) {
                            var ipv6ip = (Ext.JSON.decode(response.responseText)).data.ipv6_Addr;
                            IPv6Setting.down('#IP_addr').setValue(ipv6ip);
                        },
                        failure: function () {
                            Ext.Msg.alert("Failed", "Something wrong!");
                        }
                    });
                }
            } else {
                Ext.Msg.alert("Error", 'No selected');
            }
            break;
        default:
            break;
        }
    },
    CreateIPv4: function () {
        Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().deselectAll();
        Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().deselectAll();
        var IPv4Setting = Ext.create('DESKTOP.SystemSetup.network.view.RoutingSettingCreate4');
        IPv4Setting.show();
        IPv4Setting.setTitle('IPv4 static route create');
    },
    CreateIPv6: function () {
        Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().deselectAll();
        Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().deselectAll();
        var IPv6Setting = Ext.create('DESKTOP.SystemSetup.network.view.RoutingSettingCreate6');
        IPv6Setting.show();
        IPv6Setting.setTitle('IPv6 static route create');
    },
    Setting_Apply_ipv4: function (field) {
        var win = field.up('window');
        var form = win.down('form').getForm();
        var lan = win.down('#Interfaces').getRawValue();
        var id = null;
        var obj = {};
        var routingipv4_obj = Ext.ComponentQuery.query('#routingipv4')[0];
        var select = Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().getSelection()[0];
        if (select) {
            id = routingipv4_obj.getSelectionModel().getSelection()[0].get('id');
            if (lan == routingipv4_obj.getSelectionModel().getSelection()[0].get('iface')) {
                id = routingipv4_obj.getSelectionModel().getSelection()[0].get('id');
                var store = this.getStore('get_cur_iface');
                var idx = store.find('name', lan);
                console.log(lan);
                var ifacevalue = store.getAt(idx).data.value;
                obj = {
                    op: 'nic_static_route_edit',
                    id: id
                };
            } else {
                obj = {
                    op: 'nic_static_route_edit',
                    id: id
                };
            }
        }
        if (id !== null) {
            if (form.isValid()) { // make sure the form contains valid data before submitting
                win.mask('Saving...');
                form.submit({
                    url: 'app/SystemSetup/backend/network/Routing.php',
                    params: obj,
                    success: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Success', action.result.msg, function () {
                            Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv4_static_route').reload();
                            win.close();
                        });
                    },
                    failure: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            } else { // display error alert if the data is invalid
                Ext.Msg.alert('Warning', 'Please correct form errors.');
            }
        } else {
            if (form.isValid()) { // make sure the form contains valid data before submitting
                win.mask('Saving...');
                form.submit({
                    url: 'app/SystemSetup/backend/network/Routing.php',
                    params: {
                        op: 'nic_static_route_add'
                    },
                    success: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Success', action.result.msg, function () {
                            Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv4_static_route').reload();
                            win.close();
                        });
                    },
                    failure: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            } else { // display error alert if the data is invalid
                Ext.Msg.alert('Warning', 'Please correct form errors.');
            }
        }
    },
    Setting_Apply_ipv6: function (field) {
        var win = field.up('window');
        var form = win.down('form').getForm();
        var lan = win.down('#Interfaces').getRawValue();
        var id = null;
        var obj = {};
        var routingipv6_obj = Ext.ComponentQuery.query('#routingipv6')[0];
        var select = routingipv6_obj.getSelectionModel().getSelection()[0];
        if (select) {
            id = routingipv6_obj.getSelectionModel().getSelection()[0].get('id');
            if (lan == routingipv6_obj.getSelectionModel().getSelection()[0].get('iface')) {
                id = routingipv6_obj.getSelectionModel().getSelection()[0].get('id');
                var store = this.getStore('get_cur_iface');
                var idx = store.find('name', lan);
                console.log(lan);
                var ifacevalue = store.getAt(idx).data.value;
                obj = {
                    op: 'nic_static_route_edit',
                    id: id,
                    ipv6: 'ipv6'
                };
            } else {
                obj = {
                    op: 'nic_static_route_edit',
                    id: id,
                    ipv6: 'ipv6'
                };
            }
        }
        if (id !== null) {
            if (form.isValid()) { // make sure the form contains valid data before submitting
                win.mask('Saving...');
                form.submit({
                    url: 'app/SystemSetup/backend/network/Routing.php',
                    params: obj,
                    success: function (form, action) {
                        win.unmask();
                        Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv6_static_route').reload();
                        win.close();
                    },
                    failure: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            } else { // display error alert if the data is invalid
                Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            }
        } else {
            if (form.isValid()) { // make sure the form contains valid data before submitting
                win.mask('Saving...');
                form.submit({
                    url: 'app/SystemSetup/backend/network/Routing.php',
                    params: {
                        op: 'nic_static_route_add',
                        ipv6: 'ipv6'
                    },
                    success: function (form, action) {
                        win.unmask();
                        Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv6_static_route').reload();
                        win.close();
                    },
                    failure: function (form, action) {
                        win.unmask();
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            } else { // display error alert if the data is invalid
                Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            }
        }
    },
    ipv4gridselect: function () {
        if (Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().getSelection()[0] !== null) {
            Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().deselectAll();
        }
    },
    ipv6gridselect: function () {
        if (Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().getSelection()[0] !== null) {
            Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().deselectAll();
        }
    },
    onDelete: function (btn) {
        var id;
        switch (btn.itemId) {
        case "DeleteIPv4":
            var selectipv4 = Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().getSelection()[0];
            if (typeof (selectipv4) !== "undefined") {
                Ext.Msg.confirm("Warning", "Are you sure that you want to delete the record?", function (btn) {
                    if (btn == 'yes') {
                        id = selectipv4.get('id');
                        Ext.Ajax.request({
                            url: 'app/SystemSetup/backend/network/Routing.php',
                            method: 'post',
                            params: {
                                op: 'nic_static_route_del',
                                id: id
                            },
                            success: function (form, action) {
                                Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv4_static_route').reload();
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    }
                });
            } else {
                Ext.Msg.alert("Error", 'No selected');
            }
            break;
        case "DeleteIPv6":
            var selectipv6 = Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().getSelection()[0];
            if (typeof (selectipv6) !== "undefined") {
                Ext.Msg.confirm("Warning", "Are you sure that you want to delete the record?", function (btn) {
                    if (btn == 'yes') {
                        id = selectipv6.get('id');
                        Ext.Ajax.request({
                            url: 'app/SystemSetup/backend/network/Routing.php',
                            method: 'post',
                            params: {
                                op: 'nic_static_route_del',
                                id: id,
                                ipv6: 'ipv6'
                            },
                            success: function (form, action) {
                                Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('ipv6_static_route').reload();
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result.msg);
                            }
                        });
                    }
                });
            } else {
                Ext.Msg.alert("Error", 'No selected');
            }
            break;
        default:
            break;
        }
    }
});
