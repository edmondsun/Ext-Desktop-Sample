Ext.define('DESKTOP.SystemSetup.network.controller.IPv6Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.netipv6',
    requires: [
        'DESKTOP.SystemSetup.network.view.IPv6Setting'
    ],
    listen: {
        store: {
            '#netipv6': {
                enableIPv6: 'onEnableIPv6'
            }
        }
    },
    onEnableIPv6: function(args) {
        console.log("onEnableIPv6");
        if (args) {
            this.lookupReference('enableBox').setValue(true);
            this.lookupReference('enableBox').resetOriginalValue(true);
            this.lookupReference('infopanel').show();
            this.lookupReference('infotools').show();
        }
    },
    //Button Function
    onEdit: function () {
        var gridModel = this.lookupReference('nic6').getSelectionModel();
        if (gridModel.hasSelection()) {
            var record = gridModel.getSelection()[0],
                type = record.get('ipv6_type'),
                IPv6Setting = Ext.create('DESKTOP.SystemSetup.network.view.IPv6Setting', {
                    title: record.get('name')
                });

            switch (type) {
                case "DHCP":
                    IPv6Setting.down('radiogroup').setValue({
                        'ipv6_type': 'dhcp'
                    });
                    break;
                case "Static":
                    IPv6Setting.down('radiogroup').setValue({
                        'ipv6_type': 'static'
                    });
                    IPv6Setting.down('#ipv6_global_addr').setValue(record.get('ipv6_global_addr'));
                    IPv6Setting.down('#ipv6_prefix').setValue(record.get('ipv6_prefix'));
                    IPv6Setting.down('#ipv6_gateway').setValue(record.get('ipv6_gateway'));
                    break;
                default:
                    IPv6Setting.down('radiogroup').setValue({
                        'ipv6_type': 'automatic'
                    });
            }
            IPv6Setting.show();
            gridModel.deselect(record);
        } else {
            Ext.Msg.alert('Error', 'No port is selected.');
        }
    },
    Setting_Apply: function (field) {
        var win = field.up('window'),
            form = win.down('form').getForm();
        // make sure the form contains valid data before submitting
        if (form.isValid()) {
            form.submit({
                url: 'app/SystemSetup/backend/network/IPv6.php',
                waitMsg: 'Saving...',
                params: {
                    op: 'ipv6_set',
                    nic_name: win.title
                },
                success: function (form, action) {
                    Ext.Msg.alert('Success', action.result.msg, function () {
                        Ext.ComponentQuery.query('#Ipv6')[0].getViewModel().getStore('netipv6').reload();
                        win.close();
                    });
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    on_Apply_All: function (form, appWindow) {
        var netipv6Store = this.getStore('netipv6'),
            enableBox = this.lookupReference('enableBox');
        
        appWindow.showLoadingMask();
        Ext.Ajax.request({
            type   : 'ajax',
            method : 'post',
            url    : 'app/SystemSetup/backend/network/IPv6.php',
            timeout: 500000, // 5 minutes
            params : {
                op: enableBox.getValue() ? 'enable_ipv6' : 'disable_ipv6'
            },
            success: function (response, opts) {
                appWindow.getresponse(0, 'IPv6');
                appWindow.hideLoadingMask();
                netipv6Store.reload();
            },
            failure: function (response, opts) {
                var errMsg = Ext.JSON.decode(response.responseText).msg;

                if (typeof errMsg === 'undefined')
                    errMsg = 'Fail to apply your configuration.';

                appWindow.getresponse(errMsg, 'IPv6');
                appWindow.hideLoadingMask();
                netipv6Store.reload();
            }
        });
    }
});
