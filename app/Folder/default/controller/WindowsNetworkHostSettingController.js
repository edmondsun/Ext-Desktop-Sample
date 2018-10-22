Ext.define('DESKTOP.Folder.default.controller.WindowsNetworkHostSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.windowsnetworkhostset',
    init: function () {},
    doConfirm: function () {
        var me = this.getView();
        var config = me.config;
        var actionType = config.actionType;
        var share_name = config.share_name;
        var rpath = config.rpath;
        var caller = config.caller;
        var store = config.store;

        var mask = new Ext.LoadMask({
            msg: 'Please wait processing your request',
            target: me
        });

        switch (actionType) {
        case 'AddWindowsNetworkHost':
            var text_ip = this.getView().down('#text_ip');
            var domain_arr = [];
            domain_arr.push(text_ip.getValue());
            domain_arr = Ext.JSON.encode(domain_arr);
            if (text_ip.isValid()) {
                mask.show();
                Ext.Ajax.request({
                    url: 'app/Folder/backend/default/WindowsHost.php',
                    method: 'POST',
                    params: {
                        op: 'add_network_host',
                        share_name: share_name,
                        rpath: rpath,
                        domain_arr: domain_arr
                    },
                    success: function (response) {
                        mask.destroy();
                        if ((Ext.JSON.decode(response.responseText)).success === false) {
                            var msg = (Ext.JSON.decode(response.responseText)).msg;
                            Ext.Msg.alert("Error", msg);
                        } else {
                            Ext.Msg.alert('Success', 'Add windows network host success.', function () {
                                var call = Ext.ComponentQuery.query('#' + caller)[0];
                                call.getViewModel().getStore(store).reload();
                                me.close();
                            });
                        }
                    },
                    failure: function () {
                        mask.destroy();
                        Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                    }
                });

            }
            break;
        case 'DeleteWindowsNetworkHost':
            var delete_host = config.selectedData;
            var remove_arr = [];
            mask.show();
            remove_arr.push(delete_host);
            remove_arr = Ext.JSON.encode(remove_arr);
            Ext.Ajax.request({
                url: 'app/Folder/backend/default/WindowsHost.php',
                method: 'POST',
                params: {
                    op: 'remove_network_host',
                    share_name: share_name,
                    rpath: rpath,
                    remove_arr: remove_arr
                },
                success: function (response) {
                    mask.destroy();
                    if ((Ext.JSON.decode(response.responseText)).success === false) {
                        var msg = (Ext.JSON.decode(response.responseText)).msg;
                        Ext.Msg.alert("Error", msg);
                    } else {
                        Ext.Msg.alert('Success', 'Delete windows network host success.', function () {
                            var call = Ext.ComponentQuery.query('#' + caller)[0];
                            call.getViewModel().getStore(store).reload();
                            me.close();
                        });

                    }
                },
                failure: function () {
                    mask.destroy();
                    Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                }
            });

            break;
        default:
            console.log('default');
            break;
        }
    }
});
