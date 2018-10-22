Ext.define('DESKTOP.SystemSetup.maintenance.controller.UpgradeController', {
    extend: 'Ext.app.ViewController',
    requires: [],
    alias: 'controller.upgrade',
    upgradeFile: function (field) {
        var form = field.up('form').getForm();
        if (form.isValid()) {
            var mainView = Ext.ComponentQuery.query('#Upgrade')[0];
            var fileName = mainView.down('#file_name').getValue();
            var re = /\.(bin)$/;
            if (fileName === '') {
                return;
            }
            if (!re.test(fileName)) {
                Ext.Msg.alert('Warning', 'File format is incorrect!<br/>Please check the image file.');
                return;
            }
            var timerId;
            var upgradeState;
            var uploadMask = new Ext.LoadMask(Ext.ComponentQuery.query('#appwindow')[0], {
                msg: "Uploading Firmware..."
            });
            var upgradeMask = new Ext.LoadMask(Ext.ComponentQuery.query('#appwindow')[0], {
                msg: "Upgrading Firmware..."
            });
            uploadMask.show();
            form.submit({
                url: 'app/SystemSetup/backend/maintenance/Upgrade.php',
                params: {
                    op: 'fw_upload'
                },
                success: function (form, action) {
                    upgradeMask.show();
                    uploadMask.hide();
                    timerId = setInterval(function () {
                        upgradeState();
                    }, 1000);
                    upgradeState = function () {
                        Ext.Ajax.request({
                            url: 'app/SystemSetup/backend/maintenance/Upgrade.php',
                            method: 'post',
                            waitMsg: 'Upgrading Firmware...',
                            waitMsgTarget: true,
                            params: {
                                op: 'fw_upgrade'
                            },
                            success: function (response) {
                                var data = Ext.JSON.decode(response.responseText);
                                if (data.state == "finish") {
                                    Ext.Msg.alert("Success", "Firmware upgrade success<br/>Please restart your device!");
                                    clearTimeout(timerId);
                                    upgradeMask.hide();
                                } else if (data.state == "error") {
                                    Ext.Msg.alert('Failure', 'Firmware "' + data.name + '" has been failed.');
                                    clearTimeout(timerId);
                                    upgradeMask.hide();
                                } else {
                                    upgradeMask.hide();
                                    upgradeMask.msg = "Upgrading firmware... " + data.progress + "%";
                                    upgradeMask.show();
                                }
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failure', 'Firmware upgrade failed.');
                            }
                        });
                    };
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Failure', 'Firmware upload failed.');
                }
            });
        }
    }
});
