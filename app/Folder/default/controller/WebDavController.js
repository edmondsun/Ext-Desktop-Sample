Ext.define('DESKTOP.Folder.default.controller.WebDavController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.folderwebdav',
    init: function () {
    	var me             = this;
        var folderListTree = me.getStore('folderListTree');

        folderListTree.setProxy({
            type: 'ajax',
            method: 'GET',
            url: 'app/Folder/backend/default/ShareFolder.php',
            extraParams: {
                op: 'get_folder_list'
            },
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        });

        folderListTree.load({
            scope: me,
            callback: function (records, operation, success) {
                if (!success) {
                	Ext.MessageBox.alert('Fail', 'Get folder fail');
                	return;
                }

                var permAllList  = me.getStore('permAllList');
            	permAllList.load();
            }
        });

    },
    onDomainTypeSelect: function(combo, record) {
    	var me           = this;
        var select       = combo ? combo.getValue() : 'user';
        var permAll      = me.getStore('permAll');

        permAll.loadAccounts(select);
		
    },
    onGridPanelClick: function (tree, record) {
        var fName;
        var folderListTree;
    	var me         = this;
        var vm         = me.getViewModel();
        var webDavList = Ext.data.StoreManager.lookup('webDavList');
        var mainView   = Ext.ComponentQuery.query('#WebDav')[0];
        var group      = mainView.down("#authGroup").value;

        folderListTree = Ext.StoreManager.lookup('folderListTree');

        if (record !== undefined) {
            fName = record.getData().folder_name;   
        } else {
            fName = folderListTree.getAt(0).data.folder_name;
            mainView.down('#n_share_name').setValue(fName);
        }

        webDavList.setProxy({
            type: 'ajax',
            method: 'GET',
            url: 'app/Folder/backend/default/WebDav.php',
            extraParams: {
                folder_name : fName,
                domain : group
            },
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        });

        webDavList.reload();
    },
    gridChange: function(self, record, item, index, e, eOpts) { 
        var me         = this;
        var mainView   = Ext.ComponentQuery.query('#WebDav')[0];
        var gridHandle = Ext.data.StoreManager.lookup('permAll').findRecord('name', record.data.name);
        var gOption    = mainView.down('#authGroup').getRawValue();

        switch (gOption) {
        case 'User':
            me.getViewModel().set('user_handle',  gridHandle);
            break;
        case 'Group':
            me.getViewModel().set('group_handle',  gridHandle);
            break;
        case 'Domain user':
            break;
        case 'Domain group':
            break;                
        }
    },
    onChange: function(combo, record, index, eOpts) {    
        var me          = this;
		var permAll     = Ext.data.StoreManager.lookup('permAll');
        var mainView    = Ext.ComponentQuery.query('#WebDav')[0];
        var gUserHandle = me.getViewModel().get('user_handle');
        var gGrpHandle  = me.getViewModel().get('group_handle');
        var gOption     = mainView.down('#authGroup').getRawValue();

        switch (gOption) {
        case 'User':
            switch(index) {
            case 2:
                gUserHandle.set('linux_perm', 0);
                break;
            case 1:
                gUserHandle.set('linux_perm', 2);
                break;    
            case 0:
                gUserHandle.set('linux_perm', 3);
                break;    
            }
            break;
        case 'Group':
            switch(index) {
            case 2:
                gGrpHandle.set('linux_perm', 0);
                break;
            case 1:
                gGrpHandle.set('linux_perm', 2);
                break;    
            case 0:
                gGrpHandle.set('linux_perm', 3);
                break;    
            }
            break;
        case 'Domain user':
            break;
        case 'Domain group':
            break;                
        }
    },
    onRefresh: function () {

        var me   = this;
        var win  = me.getView();
        var mask = new Ext.LoadMask({
            msg: 'Reloading...',
            target: win
        });

        mask.show();

        var folderListTree = Ext.StoreManager.lookup('folderListTree');

        folderListTree.load({
            scope: me,
            callback: function (records, operation, success) {
                if (!success) {
                	Ext.MessageBox.alert('Fail', 'Get folder fail');
                	return;
                }

                Ext.defer(function() {
                    mask.destroy();
                }, 500);
            }
        });
    },
    onSearchPerm: function (field) {
        var form         = field.up('#WebDav');
        var store_folder = form.getViewModel().getStore('permAll');
        var filter       = field.getValue();

        store_folder.clearFilter();
        
        store_folder.filterBy(function (val) {
            var share_name = val.get('name');
            return (share_name.search(filter) !== -1);
        });
    },
    onSearch: function (field) {
        var form         = field.up('#WebDav');
        var store_folder = form.getViewModel().getStore('folderListTree');
        var filter       = field.getValue();

        store_folder.clearFilter();

        store_folder.filterBy(function (val) {
            var share_name = val.get('folder_name');
            return (share_name.search(filter) !== -1);
        });
    },
    on_Apply_All: function (form, me) {
        var appwindow    = me;
    	var permAll      = Ext.data.StoreManager.lookup('permAll');
        var oriPermsUser = permAll.original_acl.user;
        var oriPermsGrp  = permAll.original_acl.group;
        var modPermsUser = permAll.current_acl.user;
        var modPermsGrp  = permAll.current_acl.group;
        var userFullArr  = [];
        var userReadArr  = [];
        var groupFullArr = [];
        var groupReadArr = [];
        var mainView     = Ext.ComponentQuery.query('#WebDav')[0];
        var selFold      = mainView.down('#folderGrid').getSelectionModel().getSelection()[0] ? mainView.down('#folderGrid').getSelectionModel().getSelection()[0].getData() : Ext.StoreManager.lookup('folderListTree').getAt(0).getData();
        var gOption      = mainView.down('#authGroup').getRawValue();

        for (var i in modPermsUser) {
            switch(modPermsUser[i].linux_perm) {
            case 0:    
            default:
                break;
            case 2:    
                userReadArr.push(modPermsUser[i].name);
                break;
            case 3:    
                userFullArr.push(modPermsUser[i].name);
                break;        
            }
        }

        for (var i in modPermsGrp) {
            switch(modPermsGrp[i].linux_perm) {
            case 0:    
            default:
                break;
            case 2:    
                groupReadArr.push(modPermsGrp[i].name);
                break;
            case 3:    
                groupFullArr.push(modPermsGrp[i].name);
                break;        
            }
        }

        if  ((userReadArr.length==0 && userFullArr.length==0) || (groupReadArr.length==0 && groupFullArr.length==0)){
            return;
        }

        appwindow.showLoadingMask();

        userFullArr  = Ext.JSON.encode(userFullArr);
        userReadArr  = Ext.JSON.encode(userReadArr);
        groupFullArr = Ext.JSON.encode(groupFullArr);
        groupReadArr = Ext.JSON.encode(groupReadArr);

        switch (gOption) {
        case 'User':
            paramInfo = {
                op          : 'webdav_edit_share',
                pool        : selFold.pool,
                volume      : selFold.volume,
                folder      : selFold.folder,
                folder_name : selFold.folder_name,
                user_rw_arr : userFullArr,
                user_ro_arr : userReadArr
            };
            break;
        case 'Group':
            paramInfo = {
                op          : 'webdav_edit_share',
                pool        : selFold.pool,
                volume      : selFold.volume,
                folder      : selFold.folder,
                folder_name : selFold.folder_name,
                domain_user_rw_arr : groupFullArr,
                domain_user_ro_arr : groupReadArr
            };
            break;
        case 'Domain user':
            break;
        case 'Domain group':
            break;                
        }


        console.log(paramInfo);
        Ext.Ajax.request({
            url: 'app/Folder/backend/default/WebDav.php',
            method: 'POST',
            params: paramInfo,
            success: function (response) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'WebDav');
                }
            },
            failure: function (response) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'WebDav');
                Ext.Msg.alert('Failed', msg);
            }
        });
    },
    showMask: function (el, str) {
        el.mask(str);
    },
    hideMask: function (el) {
        el.unmask();
    },
    closeWindow: function (el) {
        el.destroy();
    }
});
