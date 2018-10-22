Ext.define('DESKTOP.Folder.default.model.WebDavModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.folderwebdav',
    requires: ['DESKTOP.Folder.default.controller.WebDavController'],
    user_handle: null,
    group_handle: null,
    stores: {
        permAll: {
            storeId: 'permAll',
            linux_perms: null,
            current_acl: null,
            original_acl: null,
            cnt: 0,
            fields: [
                'name',
                'linux_perm',
                {
                    name: 'access',
                    calculate: function(data, val) {
                        var dataPermValue = {
                            0 : 'Deny access',
                            1 : 'Deny access',
                            2 : 'Read only',
                            3 : 'Full access' 
                        };

                        return dataPermValue[data.linux_perm];
                    }
                },
                {
                    name: 'indx',
                    calculate: function(data, val) {
                        var permAll = Ext.data.StoreManager.lookup('permAll');
                        var cnt     = permAll.config.cnt;

                        permAll.setConfig({'cnt' : ++cnt})
                        return cnt;
                    }
                }
            ],
            proxy: {
                type: 'localstorage'
            },
            listeners: {
                load: function(store, records, successful) {
                }
            },
            isDirty: function() {
                var me            = this;
                var originalPerms = me.original_acl;
                    
                for(var domainType in me.current_acl) {
                    for(var index in me.current_acl[domainType]) {
                        if(me.current_acl[domainType][index].perm !== originalPerms[domainType][index].perm){
                            return true;
                        }
                    }
                }

                return false;
            },
            loadAccounts: function(domainType) {
                var me       = this;
                var trasUser = {
                    'user'        : 'user',
                    'local_user'  : 'user',
                    'domain_user' : 'group'
                };
                var type = trasUser[domainType];
                me.loadData(me.current_acl[type]); 
                Ext.ComponentQuery.query('#WebDav')[0].getController().onGridPanelClick();
            }
        },
        accountPerms : {
            storeId: 'accountPerms',
            fields: [''],
            listeners: {
                load: function(store, records, successful) {
                    var permAll = Ext.data.StoreManager.lookup('permAll');

                    permAll.current_acl  = records[0].data.acl;
                    permAll.original_acl = Ext.clone(records[0].data.acl);
                }
            }
        },
        folderListTree: {
            storeId: 'folderListTree',
            fields: [''],
            listeners: {
                load: function(store, records, successful) {
                    var me = this;

                    if (successful) {
                        
                        var accountPerms = Ext.data.StoreManager.lookup('accountPerms');

                        accountPerms.setProxy({
                            type: 'ajax',
                            method: 'GET',
                            url: 'app/Folder/backend/default/ShareFolder.php',
                            extraParams: {
                                op: 'get_folder_acl'
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'data',
                                successProperty: 'success'
                            }
                        });
                    }
                }
            }
        },
        permAllList: {
            storeId: 'permAllList',
            fields: [''],
            proxy: {
                type: 'ajax',
                url: 'app/Folder/backend/default/ShareFolder.php',
                method: 'GET',
                extraParams: {
                    op: 'get_folder_acl'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records) {
                        var me = this;
                        var accountPerms = Ext.data.StoreManager.lookup('accountPerms');

                        accountPerms.load({
                            scope: me,
                            callback: function (records, operation, success) {
                                Ext.ComponentQuery.query('#WebDav')[0].getController().onDomainTypeSelect();
                            }
                        });
                    }
                }
            }
        },
        webDavList: {
            storeId: 'webDavList',
            fields: [],
            listeners: {
                load: {
                    fn: function (store, records) {
                        var me       = this;
                        var info     = records[0].getData();
                        var permAll  = Ext.data.StoreManager.lookup('permAll');
                        var mainView = Ext.ComponentQuery.query('#WebDav')[0];

                        if (info.webdav_ro_arr !== null) {
                            if (info.webdav_ro_arr.length != 0) {
                                for (var i in info.webdav_ro_arr) {
                                    var setPerm = permAll.findRecord('name', info.webdav_ro_arr[i]);

                                    if (setPerm === null) {
                                        continue;
                                    }

                                    setPerm.set('linux_perm', 2);    
                                }
                            }                            
                        }

                        if (info.webdav_ro_arr !== null) {
                            if (info.webdav_rw_arr.length != 0) {
                                for (var i in info.webdav_rw_arr) {
                                    var setPerm = permAll.findRecord('name', info.webdav_rw_arr[i]);

                                    if (setPerm === null) {
                                        continue;
                                    }

                                    setPerm.set('linux_perm', 3);    
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
