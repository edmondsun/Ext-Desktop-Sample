Ext.define('DESKTOP.Folder.default.controller.FolderlistController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.folderlist',
    init: function () {
        this.viewType = this.getView().config.viewType;
        var folderTree = this.getStore('folderTree');
        var folderList = this.getStore('folderList');
        folderTree.view = this.getView();
        folderList.view = this.getView();
        switch (this.viewType) {
        case 'ShareFolder':
            folderTree.load();
            break;
        default:
            if (this.viewType === 'WindowsNetworkHost') {
                folderList.proxy.extraParams = {
                    op: 'get_folder_list',
                    service_type: 'samba'
                };
            }
            folderList.load({
                callback: function (records, operation, success) {
                    this.view.down('#folderGrid').bindStore(this);
                    if (folderList.loadCount === 1) {
                        if (records.length > 0) {
                            this.view.down('#folderGrid').getSelectionModel().select(0);
                        }
                    }
                }
            });
            break;
        }
    },
    onFolderListSelect: function (grid, records) {
        this.getView().ownerCt.ownerCt.getController().onFolderListSelect(records);
    },
    onRefresh: function () {
        var me = this;
        var folderTree = me.getStore('folderTree');
        var folderList = me.getStore('folderList');
        var folderEl = me.view.down('#folderGrid');
        var select_item = folderEl.getSelectionModel().getSelection()[0];
        switch (me.viewType) {
        case 'ShareFolder':
            folderTree.reload();
            break;
        default:
            // if (this.viewType === 'WindowsNetworkHost') {
            //     folderList.proxy.extraParams = {
            //         op: 'get_folder_list',
            //         service_type: 'samba'
            //     };
            // }
            folderList.reload();
            if (typeof select_item !== "undefined") {
                folderList.on({
                    load: {
                        fn: function (store, records, options) {
                            if (typeof (select_item) !== 'undefined') {
                                var index = folderList.findExact('abs_path', select_item.data.abs_path);
                                folderEl.getSelectionModel().select(index);
                            }
                        },
                        scope: folderList,
                        single: true
                    }
                });
            }
            break;
        }
    },
    onSearch: function () {
        var me = this;
        var searchtext = this.getView().down('#searchtext').getValue();
        var store = me.getStore('folderList');
        var queryStr = null;
        if (searchtext.match(/\w+/) === null && searchtext !== "") {
            queryStr = new RegExp("(\\" + searchtext + ")", "gi");
        } else {
            queryStr = new RegExp("(" + searchtext + ")", "gi");
        }
        store.clearFilter(true);
        store.filter({
            filterFn: function (record) {
                var name = record.get('folder_name').toString();
                var match = name.match(queryStr);
                return match;
            }
        });
    }
});
