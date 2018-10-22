Ext.define('DESKTOP.StorageManagement.snapshot.controller.ManagementSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.snapshotmanagementset',
    init: function () {},
    doConfirm: function () {
        var me = this;
        var actionType = this.getView().config.actionType;
        var view = this.getView();
        var params = {};
        switch (actionType) {
        case 'TakeSnapshot':
            params = {
                op: 'snapshot_create',
                name: view.config.selectedData.data.name
            };
            break;
        case 'SnapshotClone':
            params = {
                op: 'snapshot_clone',
                name: view.config.selectedData.data.name,
                pool_name: view.config.selectedData.data.pool_name,
                clone_name: view.down('textfield').getValue()
            };
            break;
        case 'RollBack':
            params = {
                op: 'snapshot_rollback',
                name: view.config.selectedData.data.name
            };
            break;
        case 'DeleteSnapshot':
            params = {
                op: 'snapshot_delete',
                name: view.config.selectedData.data.name
            };
            break;
        case 'SnapshotSchedule':
            me.setSchedule(view);
            break;
        default:
            break;
        }
        if (actionType !== 'SnapshotSchedule') {
            view.mask('Saving...');
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/snapshot/Snapshot.php',
                method: 'post',
                params: params,
                success: function (response, options) {
                    view.unmask();
                    var respText = Ext.util.JSON.decode(response.responseText);
                    console.log('responseText', respText);
                    if (respText.success) {
                        view.destroy();
                    } else {
                        if (params.op == 'snapshot_rollback') {
                            params.delete_recent = true;
                            me.Confirm_RollBack(params, respText, view);
                        } else {
                            Ext.Msg.alert("Error", respText.msg);
                        }
                    }
                },
                failure: function (response, options) {
                    view.unmask();
                    Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                }
            });
        }
    },
    Confirm_RollBack: function (params, respText, view) {
        Ext.Msg.confirm("Warning", respText.msg, function (btn) {
            if (btn == 'yes') {
                view.mask('Saving...');
                Ext.Ajax.request({
                    url: 'app/StorageManagement/backend/snapshot/Snapshot.php',
                    method: 'post',
                    params: params,
                    success: function (response, options) {
                        view.unmask();
                        var respText = Ext.util.JSON.decode(response.responseText);
                        if (respText.success) {
                            view.destroy();
                        } else {
                            Ext.Msg.alert("Error", respText.msg);
                        }
                    },
                    failure: function (response, options) {
                        view.unmask();
                        Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                    }
                });
            }
        });
    },
    setSchedule: function (view) {
        var form = view.down('form');
        if (form.isValid()) {
            view.mask('Saving...');
            form.submit({
                url: 'app/StorageManagement/backend/snapshot/Snapshot.php',
                method: 'post',
                params: {
                    op: 'snapshot_set_sched'
                },
                success: function (response, option) {
                    view.unmask();
                    view.destroy();
                },
                failure: function (response, action) {
                    view.unmask();
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
            // display error alert if the data is invalid
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
