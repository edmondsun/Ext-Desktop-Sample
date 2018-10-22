Ext.define('DESKTOP.Folder.default.model.FolderMapModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.foldermap',
    data: {
        Account_acl: {},
        Folder_status: true,
        Acl_Request_stop: false
    },
    stores: {
        allfolders: {
            storeId: 'allfolders',
            fields: [''],
            autoLoad: false,
            needOnLoad: true,
            selController: null,
            selVM: null,
            generatedCount: null,
            md5sum: null,
            lastDat: null,
            mapfinished: false,
            proxy: {
                type: 'ajax',
                method: 'get',
                url: 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_all_folders',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            packFolderInfo: function (record) {
                var ret = {};
                ret.abs_path = record.abs_path;
                ret.folder_name = record.folder_name;
                ret.belongs_to = record.belongs_to;
                return Ext.JSON.encode(ret);
            },
            prepareFolderAcl: function (folders, store) {
                console.log("store.generatedCount", store.generatedCount);
                var domainOptions = Ext.data.StoreManager.lookup('domainOptions');
                var g_FolderCount = store.generatedCount ? store.generatedCount : 0;
                var settings = store.packFolderInfo(folders[g_FolderCount]);
                var aclRequest = function (settings) {
                    Ext.Ajax.request({
                        url: 'app/Folder/backend/default/ShareFolder.php',
                        method: 'GET',
                        async: true,
                        params: {
                            op: 'get_folder_acl',
                            settings: settings
                        },
                        success: aclRequestCallback
                    });
                };
                aclRequest(settings);

                function aclRequestCallback(response) {
                    var res_obj = Ext.JSON.decode(response.responseText);
                    res_obj.data.acl.index = g_FolderCount;
                    console.log("res_obj,data.", res_obj.data.acl);
                    store.selVM.data.Account_acl[res_obj.data.folder_name] = res_obj.data.acl;
                    store.selController.first_generateMapItem(res_obj.data.acl, 'user', g_FolderCount, res_obj.data.folder_name);
                    if (g_FolderCount === 0) {
                        if (!domainOptions.hasDomain) {
                            if (typeof res_obj.data.acl.domain_user === 'undefined' || res_obj.data.acl.domain_user === null)
                                domainOptions.hasDomain = false;
                            else
                                domainOptions.hasDomain = true;
                        }
                        domainOptions.load();
                    }
                    g_FolderCount++;
                    if (g_FolderCount < folders.length && !store.selVM.data.Acl_Request_stop) {
                        aclRequest(store.packFolderInfo(folders[g_FolderCount]));
                    } else {
                        if (g_FolderCount < folders.length && store.selVM.data.Acl_Request_stop) {
                            store.lastData = folders;
                            store.generatedCount = g_FolderCount;
                        } else {
                            store.mapfinished = true;
                            store.selController.getView().down("#searchtoolbar").unmask();
                        }
                        return false;
                    }
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    store.selController.getView().down("#searchtoolbar").mask("Loading");
                    store.md5sum = records[0].data.md5sum;
                    var folders = records[0].data.data;
                    if (records[0].data.data !== null) {
                        if (folders.length !== 0) {
                            store.selVM.set("Folder_status", true);
                            store.generatedCount = 0;
                            store.mapfinished = false;
                            var MapitemContainer = Ext.ComponentQuery.query('#folderACLs')[0];
                            MapitemContainer.removeAll();
                            store.prepareFolderAcl(folders, store);
                        } else {
                            store.selVM.set("Folder_status", false);
                            store.selController.getView().down("#searchtoolbar").unmask();
                        }
                    } else {
                        if (!store.mapfinished) {
                            store.prepareFolderAcl(store.lastData, store);
                        }
                    }
                    if (!successful)
                        Ext.Msg.alert('Error', 'Cannot load existing folders.');
                }
            }
        },
        domainOptions: {
            storeId: 'domainOptions',
            // needOnLoad: true,
            autoLoad: false,
            hasDomain: false,
            selView: null,
            fields: [
                'value',
                'text'
            ],
            proxy: {
                type: 'localstorage'
            },
            listeners: {
                load: function (store, records, successful) {
                    var options = [{
                        value: 'local',
                        name: 'Local'
                    }];
                    if (this.hasDomain) {
                        options.push({
                            value: 'domain',
                            name: 'Domain'
                        });
                    }
                    this.loadData(options);
                    //set local type when store loaded first time
                    this.selView.down("combo").setValue("local");
                }
            }
        }
        // permAll: {
        //     storeId: 'permAll',
        //     autoLoad: false,
        //     hasWindowsACL: false,
        //     current_acl: {},
        //     original_acl: null,
        //     fields: [
        //         'name',
        //         'linux_perm',
        //         'windows_perm', {
        //             name: 'preview',
        //             calculate: function (data) {
        //                 var previewPerm = data.linux_perm;
        //                 console.log("IN CALCULATION");
        //                 console.log(data);
        //                 if (data.windows_perm) {
        //                     if (!previewPerm || previewPerm == 1) {
        //                         previewPerm = 1;
        //                     } else {
        //                         var denyAll = 0,
        //                             allowAll = 0,
        //                             windowsAll = 0,
        //                             windowsFinalPerm = 1,
        //                             set = 1;
        //                         for (var index in data.windows_perm) {
        //                             if (data.windows_perm[index].list_type)
        //                                 denyAll |= data.windows_perm[index].mask;
        //                             else
        //                                 allowAll |= data.windows_perm[index].mask;
        //                         }
        //                         for (var pos = 0; pos < 13; pos++) {
        //                             if (!(set & denyAll) && (set & allowAll))
        //                                 windowsAll |= set;
        //                             set <<= 1;
        //                         }
        //                         // deny -> custom -> read -> write
        //                         if (windowsAll) windowsFinalPerm = 0; // custom
        //                         if (windowsAll == 124) windowsFinalPerm = 2;
        //                         if (windowsAll == 8188 || windowsAll == 8191) windowsFinalPerm = 3;
        //                         if (!windowsFinalPerm)
        //                             previewPerm = 4;
        //                         else if (previewPerm > windowsFinalPerm)
        //                             previewPerm = windowsFinalPerm;
        //                     }
        //                 }
        //                 switch (previewPerm) {
        //                 case 0:
        //                     return '';
        //                 case 1:
        //                     return 'Deny access';
        //                 case 2:
        //                     return 'Read only';
        //                 case 3:
        //                     return 'Read/write';
        //                 default:
        //                     return 'Custom';
        //                 }
        //             }
        //         }
        //     ],
        //     proxy: {
        //         //type: 'pagingmemory'
        //         type: 'localstorage'
        //     },
        //     //pageSize: 5,
        //     loadAccounts: function (domainType) {
        //         //this.proxy.data = this.current_acl[domainType];
        //         this.loadData(this.current_acl[domainType]);
        //         console.log('this.current_acl[domainType]', this.current_acl[domainType]);
        //         //this.load();
        //     },
        //     isDirty: function () {
        //         var originalACL = this.original_acl,
        //             currentACL = this.current_acl;
        //         for (var domainType in currentACL) {
        //             for (var index in currentACL[domainType]) {
        //                 if (currentACL[domainType][index].linux_perm !==
        //                     originalACL[domainType][index].linux_perm)
        //                     return true;
        //             }
        //         }
        //         return false;
        //     },
        //     getChangedData: function () {
        //         var originalACL = this.original_acl,
        //             currentACL = this.current_acl,
        //             linuxPerm = {};
        //         for (var domainType in currentACL) {
        //             linuxPerm[domainType] = [];
        //             for (var index in currentACL[domainType]) {
        //                 var flag = -1;
        //                 // changed permission
        //                 if (currentACL[domainType][index].linux_perm !==
        //                     originalACL[domainType][index].linux_perm) {
        //                     // remove -x
        //                     flag = 1;
        //                     // modify -m
        //                     if (currentACL[domainType][index].linux_perm)
        //                         flag = 2;
        //                     // existing permssion
        //                 } else if (currentACL[domainType][index].linux_perm) {
        //                     flag = 0;
        //                 }
        //                 if (flag >= 0) {
        //                     linuxPerm[domainType].push({
        //                         'name': currentACL[domainType][index].name,
        //                         'perm': currentACL[domainType][index].linux_perm,
        //                         'flag': flag
        //                     });
        //                 }
        //                 // if (currentACL[domainType][index].linux_perm) {
        //                 //     linuxPerm[domainType].push({
        //                 //         'name': currentACL[domainType][index].name,
        //                 //         'perm': currentACL[domainType][index].linux_perm
        //                 //     });
        //                 // }
        //             }
        //         }
        //         /*
        //         if (this.hasWindowsACL)
        //         {
        //             var windowsPerm = {};
        //             for (var domainType in currentACL) {
        //                 windowsPerm[domainType] = [];
        //                 for (var index in currentACL[domainType]) {
        //                     // console.log("compare windows ACL");
        //                     // console.log(currentACL[domainType][index].windows_perm);
        //                     // console.log(originalACL[domainType][index].windows_perm);
        //                     var isDifferent  = false,
        //                         currentPerm  = currentACL[domainType][index].windows_perm,
        //                         originalPerm = originalACL[domainType][index].windows_perm,
        //                         currentType  = typeof currentPerm,
        //                         originalType = typeof originalPerm;
        //                     // object comparison
        //                     if ( currentType == 'object' && currentType == originalType ) {
        //                         for (var itemName in currentPerm)
        //                             if (currentPerm[itemName] != originalPerm[itemName])
        //                                 isDifferent = true;
        //                     }
        //                     if (isDifferent || currentType != originalType) {
        //                         //console.log("not same!");
        //                         var changedPerm = {
        //                             'name': currentACL[domainType][index].name,
        //                             'new' : currentPerm,
        //                             'old' : originalPerm
        //                         };
        //                         windowsPerm[domainType].push(changedPerm);
        //                     }
        //                 }
        //             }
        //             ret['windows_perms'] = windowsPerm;
        //         }
        //     */
        //         return linuxPerm;
        //     }
        // },
        // accountPerms: {
        //     storeId: 'accountPerms',
        //     fields: [''],
        //     original: null,
        //     selVM: null,
        //     totalfoders: 0,
        //     proxy: {
        //         type: 'ajax',
        //         method: 'get',
        //         url: 'app/Folder/backend/default/ShareFolder.php',
        //         extraParams: {
        //             op: 'get_folder_acl'
        //         },
        //         reader: {
        //             type: 'json',
        //             rootProperty: 'data',
        //             successProperty: 'success'
        //         }
        //     },
        //     listeners: {
        //         load: function (store, records, successful) {
        //             var ViewModel = store.selVM.data;
        //             var domainOptions = Ext.data.StoreManager.lookup('domainOptions');
        //             ViewModel.Account_acl[records[0].data.folder_name] = records[0].data.acl;
        //             console.log("accountPermsload", store.loadCount);
        //             if (!domainOptions.hasDomain) {
        //                 if (typeof records[0].data.acl.domain_user === 'undefined' || records[0].data.acl.domain_user === null)
        //                     domainOptions.hasDomain = false;
        //                 else
        //                     domainOptions.hasDomain = true;
        //             }
        //             // if (store.totalfoders == store.loadCount) {
        //             //     domainOptions.load();
        //             // }
        //             // var permAll = Ext.data.StoreManager.lookup('permAll'),
        //             //     domainOptions = Ext.data.StoreManager.lookup('domainOptions');
        //             // // if you want to get original raw data, use:
        //             // //      store.proxy.reader.rawData
        //             // // console.log(records[0]);
        //             // // console.log(records[0].data.linux_perms);
        //             // console.log('rawdata is');
        //             // console.log(store.proxy.reader.rawData);
        //             // store.original = Ext.clone(records[0].data);
        //             // console.log("permAll.current_acl",permAll.current_acl);
        //             // permAll.original_acl = store.original.acl;
        //             //permAll.original_acl = Ext.clone(records[0].data.acl);
        //             // console.log(records[0].data.acl.user[0].windows_perm);
        //             // if (typeof records[0].data.acl.user[0].windows_perm === 'undefined' || records[0].data.acl.user[0].windows_perm === null)
        //             //     permAll.hasWindowsACL = false;
        //             // else
        //             //     permAll.hasWindowsACL = true;
        //             // console.log(records[0].data.acl.domain_user);
        //             // if (typeof records[0].data.acl.domain_user === 'undefined' || records[0].data.acl.domain_user === null)
        //             //     domainOptions.hasDomain = false;
        //             // else
        //             //     domainOptions.hasDomain = true;
        //             // domainOptions.load();
        //             //store.fireEvent('accountPermsLoaded',);
        //             // permAll.loadAccounts("user");
        //         }
        //     }
        // }
    }
});
