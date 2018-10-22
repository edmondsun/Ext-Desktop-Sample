Ext.define('DESKTOP.Folder.default.model.FolderTreeModel', {
    extend: 'Ext.data.TreeModel',
    fields: [{
        name: 'text',
        mapping: 'folder_name'
    }]
});

Ext.define('DESKTOP.Folder.default.model.ShareFolderModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.foldersharefolder',
    formulas: {
        folderInfo: {
            bind: {
                bindTo: '{folderGrid.selection}',
                deep  : true
            },
            get: function(record) {
                //console.log("KKKKKKKKKKKKKKKKK");
                //console.log(record);
                return record;
            }
        }
    },
    stores: {
        userAll: {
            storeId: 'userAll',
            autoLoad: false,
            fields:[''],
            proxy: {
                type  : 'ajax',
                method: 'get',
                url   : 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_users'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        },
        groupAll: {
            storeId: 'groupAll',
            autoLoad: false,
            fields:['name'],
            proxy: {
                type  : 'ajax',
                method: 'get',
                url   : 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_groups'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        },
        permAll: {
            storeId: 'permAll',
            autoLoad: false,
            hasWindowsACL: false,
            current_acl: null,
            original_acl: null,
            fields:[
                'name',
                'linux_perm',
                'windows_perm',
            {
                name: 'preview',
                calculate: function(data) {
                    var previewPerm = data.linux_perm;
                /*
                    // temporarily disabled, DO NOT REMOVE!!
                    if (data.windows_perm)
                    {
                        if (!previewPerm || previewPerm == 1) {
                            previewPerm = 1;
                        } else {
                            var denyAll  = 0,
                                allowAll = 0,
                                windowsAll = 0,
                                windowsFinalPerm = 1,
                                set = 1;

                            for (var index in data.windows_perm) {
                                if (data.windows_perm[index].list_type)
                                    denyAll  |= data.windows_perm[index].mask;
                                else
                                    allowAll |= data.windows_perm[index].mask;
                            }

                            for (var pos = 0; pos < 13; pos++) {
                                if (!(set & denyAll) && (set & allowAll))
                                    windowsAll |= set;
                                set <<= 1;
                            }
                            // deny -> custom -> read -> write
                            if (windowsAll)         windowsFinalPerm = 0;    // custom
                            if (windowsAll == 124)  windowsFinalPerm = 2;
                            if (windowsAll == 8188 || windowsAll == 8191) windowsFinalPerm = 3;

                            if (!windowsFinalPerm)
                                previewPerm = 4;
                            else if (previewPerm > windowsFinalPerm)
                                previewPerm = windowsFinalPerm;
                        }
                    }
                */
                    switch (previewPerm) {
                        case 0:   // return '';
                        case 1:   return 'Deny access';
                        case 2:   return 'Read only';
                        case 3:   return 'Read/write';
                        default:  return 'Custom';
                    }
                }
            }, {
                name: 'deny',
                type: 'bool',
                calculate: function(data) {
                    return (data.linux_perm === 1) ? true : false;
                }
            },{
                name: 'ro',
                type: 'bool',
                calculate: function(data) {
                    return (data.linux_perm === 2) ? true : false;
                }
            },{
                name: 'rw',
                type: 'bool',
                calculate: function(data) {
                    return (data.linux_perm === 3) ? true : false;
                }
            },{
                name: 'custom',
                type: 'bool',
                calculate: function(data) {
                    return (data.windows_perm !== 0) ? true : false;
                }
            }],

            proxy: {
                //type: 'pagingmemory'
                type: 'localstorage'
            },
            //pageSize: 5,
            loadAccounts: function(domainType) {
                //this.proxy.data = this.current_acl[domainType];
                this.loadData(this.current_acl[domainType]);
                //this.load();
            },

            isDirty: function() {
                var originalACL = this.original_acl,
                    currentACL  = this.current_acl;

                // check if linux perm is dirty
                for (var domainType in currentACL) {
                for (var index      in currentACL[domainType]) {
                    if (currentACL[domainType][index].linux_perm !==
                        originalACL[domainType][index].linux_perm)
                        return true;
                }}

                // check if windows perm is dirty
                if (this.hasWindowsACL) {
                    console.log("COMPARE WINDOWS ACL");
                    console.log(currentACL);
                    console.log(originalACL);
                    for (var domainType in currentACL) {
                    for (var index      in currentACL[domainType]) {
                        var isDifferent  = false,
                            currentPerm  = currentACL[domainType][index].windows_perm,
                            originalPerm = originalACL[domainType][index].windows_perm,
                            currentType  = typeof currentPerm,
                            originalType = typeof originalPerm;

                        console.log("compare windows ACL");
                        console.log(currentPerm);
                        console.log(originalPerm);

                        // both of them are 0
                        if (currentType === originalType && currentType === 0)
                            continue;

                        if (currentType !== originalType)
                            return true;

                        // temp solution, need to be improved..
                        // what if there are two schema that have same contents?
                        // -> custom controller should handle this problem and sort the order
                        // condition: if both of them are object
                        if (currentPerm.length !== originalPerm.length)
                            return true;

                        for (var schemaIndex in currentPerm) {
                            var currentSchema = currentPerm[schemaIndex],
                                originalSchema = originalPerm[schemaIndex];
                            // temp solution, need to be improved..
                            // what if the order is different but contents are same?
                            // -> custom controller should handle this
                            for (var itemName in currentSchema) {
                                if (currentSchema[itemName] !== originalSchema[itemName]) {
                                    console.log('item is different');
                                    console.log(itemName);
                                    console.log(currentSchema[itemName]);
                                    console.log(originalSchema[itemName]);
                                    return true;
                                }
                            }
                        }
                    }}
                }

                return false;
            },

            getChangedData: function() {
                var originalACL = this.original_acl,
                    currentACL  = this.current_acl,
                    linuxPerm   = {};

                for (var domainType in currentACL) {
                    linuxPerm[domainType] = [];

                    for (var index in currentACL[domainType]) {
                        var flag = -1;
                        // changed permission
                        if (currentACL[domainType][index].linux_perm !==
                            originalACL[domainType][index].linux_perm) {
                            // remove -x
                            flag = 1;
                            // modify -m
                            if (currentACL[domainType][index].linux_perm)
                                flag = 2;
                        // existing permssion
                        // for SAMBA
                        } else if (currentACL[domainType][index].linux_perm) {
                            flag = 0;
                        }

                        if (flag >= 0) {
                            linuxPerm[domainType].push({
                                'name': currentACL[domainType][index].name,
                                'perm': currentACL[domainType][index].linux_perm,
                                'flag': flag
                            });
                        }
                    }
                }

                if (this.hasWindowsACL)
                {
                    var windowsPerm = {};
                    for (var domainType in currentACL) {
                        windowsPerm[domainType] = [];
                        for (var index in currentACL[domainType]) {
                            var perm = currentACL[domainType][index].windows_perm;
                            if (perm) {
                                windowsPerm[domainType].push({
                                    'name': currentACL[domainType][index].name,
                                    'permissions': perm
                                });
                            }
                        }
                    }
                    console.log(windowsPerm);
                }

                return {'linux_perms': linuxPerm, 'windows_perms': windowsPerm};
            }
        },
        domainOptions: {
            storeId: 'domainOptions',
            autoLoad: false,
            hasDomain: false,
            fields: [
                'value',
                'text'
            ],
            proxy: {
                type: 'localstorage'
            },
            listeners: {
                load: function(store, records, successful) {
                    var options = [
                    {
                        value: 'user',
                        text: 'User'
                    },{
                        value: 'group',
                        text: 'Group'
                    }];

                    if (this.hasDomain) {
                        options.push({
                            value: 'domain_user',
                            text: 'Domain User'
                        });
                        options.push({
                            value: 'domain_group',
                            text: 'Domain Group'
                        });
                    }

                    this.loadData(options);
                    console.log("options has been loaded");
                }
            }
        },
        accountPerms : {
            storeId: 'accountPerms',
            fields:[''],
            original: null,
            proxy: {
                type  : 'ajax',
                method: 'get',
                url   : 'app/Folder/backend/default/ShareFolder.php',
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
                load: function(store, records, successful) {
                    var permAll       = Ext.data.StoreManager.lookup('permAll'),
                        domainOptions = Ext.data.StoreManager.lookup('domainOptions');

                    // if you want to get original raw data, use:
                    //      store.proxy.reader.rawData
                    // console.log(records[0]);
                    // console.log(records[0].data.linux_perms);
                    console.log('rawdata is');
                    console.log(store.proxy.reader.rawData);

                    store.original = Ext.clone(records[0].data);
                    permAll.current_acl  = records[0].data.acl;
                    permAll.original_acl = store.original.acl;
                    //permAll.original_acl = Ext.clone(records[0].data.acl);

                    console.log(records[0].data.acl.user[0].windows_perm);
                    if (typeof records[0].data.acl.user[0].windows_perm === 'undefined'
                            || records[0].data.acl.user[0].windows_perm === null)
                        permAll.hasWindowsACL = false;
                    else
                        permAll.hasWindowsACL = true;

                    console.log(records[0].data.acl.domain_user);
                    if (typeof records[0].data.acl.domain_user === 'undefined'
                            || records[0].data.acl.domain_user === null)
                        domainOptions.hasDomain = false;
                    else
                        domainOptions.hasDomain = true;
                    domainOptions.load();
                    //store.fireEvent('accountPermsLoaded',);
                }
            },
            isDirty: function(formVal) {
                console.log('CHANGES ARE FUCKING HERE');
                var original = this.original;
                console.log(original);
                for (var feature in formVal) {
                    if (formVal[feature] !== original[feature])
                        return true;
                }

                return false;
            }
        },
        // after folderTree inits, it will init accountPerms..
        folderTree: {
            storeId: 'folderTree',
            type: 'tree',
            model: 'DESKTOP.Folder.default.model.FolderTreeModel',
            rootVisible: false,
            autoLoad: false,
            defaultRootProperty: 'data',
            defaultRootText: 'folder_name',
            root: {
                expanded: false
            },
            proxy: {
                type  : 'ajax',
                method: 'get',
                url   : 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_all_folders'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function(store, records, successful) {
                    console.log("folder Tree is loaded");
                    if (!successful)
                        Ext.Msg.alert('Error', 'Cannot load existing folders.');

                    store.fireEvent('folderTreeLoaded', records.length);
                }
            }
        }
    }
});
