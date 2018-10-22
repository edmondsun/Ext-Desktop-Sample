Ext.define('DESKTOP.Folder.default.controller.NfsHostSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nfshostset',
    init: function () {},
    doConfirm: function () {
        var me = this;
        var actionType = this.getView().config.actionType;
        var view = this.getView();
        var params = {};
        switch (actionType) {
        case 'AddNFSHost':
            var accessStore = view.config.accessStore;
            var find = null;
            var queryStr = null;
            var searchtext = view.down('textfield').getValue();
            params = {
                op: 'nfs_add_share_host',
                folder_name: view.config.folderlistSelected.folder_name,
                pool: view.config.folderlistSelected.pool,
                volume: view.config.folderlistSelected.volume,
                folder: view.config.folderlistSelected.folder,
                host: view.down('textfield').getValue().toLowerCase(),
                perm: view.down('combobox').getValue()
            };
            if (view.down('#root_squash').getValue()) {
                params.root_squash = 'root_squash';
            } else {
                params.root_squash = 'no_root_squash';
            }
            if (view.down('#async').getValue()) {
                params.async = 'async';
            } else {
                params.async = 'sync';
            }
            if (searchtext.match(/\w+/) === null && searchtext !== "") {
                queryStr = new RegExp("(^\\" + searchtext + "$)", "i");
            } else {
                queryStr = new RegExp("(^" + searchtext + "$)", "i");
            }
            accessStore.each(function (record) {
                if (record.get('host').match(queryStr)) {
                    find = true;
                    return false;
                }
            });
            if (find) {
                Ext.Msg.alert('Error', view.down('textfield').getValue() + ' had exsited!');
                return false;
            }
            break;
        case 'EditNFSHost':
            params = {
                op: 'nfs_modify_share_host',
                folder_name: view.config.folderlistSelected.folder_name,
                pool: view.config.folderlistSelected.pool,
                volume: view.config.folderlistSelected.volume,
                folder: view.config.folderlistSelected.folder,
                old_host: view.config.selectedData.host,
                host: view.down('textfield').getValue(),
                perm: view.down('combobox').getValue()
            };
            if (view.down('#root_squash').getValue()) {
                params.root_squash = 'root_squash';
            } else {
                params.root_squash = 'no_root_squash';
            }
            if (view.down('#async').getValue()) {
                params.async = 'async';
            } else {
                params.async = 'sync';
            }
            break;
        case 'DeleteNFSHost':
            params = {
                op: 'nfs_delete_share_host',
                folder_name: view.config.folderlistSelected.folder_name,
                pool: view.config.folderlistSelected.pool,
                volume: view.config.folderlistSelected.volume,
                folder: view.config.folderlistSelected.folder,
                host: view.config.selectedData.host
            };
            break;
        default:
            break;
        }
        if (view.down('form').isValid()) {
            view.mask('Saving...');
            Ext.Ajax.request({
                url: 'app/Folder/backend/default/Nfs.php',
                method: 'post',
                params: params,
                success: function (response, options) {
                    view.unmask();
                    var respText = Ext.util.JSON.decode(response.responseText);
                    Ext.ComponentQuery.query('#NfsHost')[0].getViewModel().getStore('accessright').reload();
                    view.destroy();
                },
                failure: function (response, options) {
                    view.unmask();
                    Ext.Msg.alert("Error", "Something wrong happened,</br>please try again !");
                }
            });
        }
    }
});
