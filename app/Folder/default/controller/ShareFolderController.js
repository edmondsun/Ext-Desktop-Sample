Ext.define('DESKTOP.Folder.default.controller.ShareFolderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.foldersharefolder',
    listen: {
        controller: {
            '*': {
                folderCreated    : 'onFolderCreated',
                customPermUpdated: 'onCustomPermUpdated'
            }
        },
        store: {
            '#accountPerms': {
                accountPermsLoaded: 'onAccountPermsLoaded'
            },
            '#folderTree': {
                folderTreeLoaded: 'onFolderTreeLoaded'
            }
        }
    },

    init: function() {
        console.log('ShareFolderController init');
        // global controller variables
        var noDirtyPass = false,            // pass at first time
            includeParentOption = 0;        // for juding folder configs

        // add global 'Create' button
        this.globalButton = [{
            defaultName : 'Create',
            nameIndex   : 'CreateShareFolder',
            handler     : 'onCreateShareFolder'
        }];

        // tmp use
        var me = this;
        this.getStore('folderTree').load({
            callback: function(records, operation, success) {
                console.log('folderTree first time');
                console.log(records);
                if (success && records.length) {
                    me.lookupReference('folderGrid').setSelection(records[0]);
                }
                // TODO: what if fails?
            }
        });
    },

//////////////////////// Folder Configs ////////////////////////////////

    onIncludeParentChange: function(checkBox, newVal, oldVal) {
        var originalIncludeParentOption = this.getStore('accountPerms').proxy.reader.rawData.data.include_parent,
            me = this;

        if (originalIncludeParentOption) {
            if (newVal) {
                me.includeParentOption = 0;
                return;
            }
            Ext.Msg.show({
                title: 'Windows Security',
                message: 'If continue, inheritable permissions from parent objects will not apply on this object.<br>'
                        + 'Press [Add], the original inherited permissions will be a part of explicit permissions of this object<br>'
                        + 'Press [Remove], the original inherited permissions will be eliminated<br>',
                buttons: Ext.Msg.YESNOCANCEL,
                buttonText: {
                    yes: 'Add',
                    no: 'Remove',
                    cancel: 'Cancel'
                },
                fn: function(btn) {
                    if (btn === 'yes')      me.includeParentOption = 2;
                    else if (btn === 'no')  me.includeParentOption = 1;
                    else                    checkBox.setValue(true);
                }
            });
        } else {
            me.includeParentOption = newVal ? 3 : 0;
        }
    },

/////////////////////////// Folder ///////////////////////////////////
    /**
     * Show share folder settings window
     */
    onCreateShareFolder: function() {
        var createWindow = Ext.create('DESKTOP.Folder.default.view.ShareFolderSettings');
        var volumeComboStore = Ext.create('Ext.data.Store', {
                fields: [],
                proxy: {
                    type: 'ajax',
                    method: 'get',
                    url: 'app/Folder/backend/default/ShareFolder.php',
                    extraParams: {
                        op: 'get_all_volumes'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        successProperty: 'success'
                    }
                }
            });

            volumeComboStore.load( function(records, operation, success) {
                if (success && (typeof records === 'undefined')) {
                    Ext.Msg.alert('Error', 'There is no volume. Please create a volume first.');
                    // bring user to volume page
                    return;
                }

                if (!success) {
                    Ext.Msg.alert('Error', 'Cannot load volumes.');
                    return;
                }

                createWindow.show(null, function() {
                    console.log('volumeComboStore loaded.');
                    var volumeCombo = createWindow.lookupReference('volumeCombo');
                    volumeCombo.setStore(volumeComboStore);
                    volumeCombo.select(records[0]);
                    volumeCombo.fireEvent('select', volumeCombo, records[0]);
                });
            });
    },

    /**
     * Edit share folder settings
     */
    onEditShareFolder: function() {
        var me = this,
            editWindow = Ext.create('DESKTOP.Folder.default.view.ShareFolderSettings', {
                title: 'Edit Folder'
            });

        editWindow.lookupReference('settingsForm').load({
            method: 'get',
            url   : 'app/Folder/backend/default/ShareFolder.php',
            params: {
                op: 'get_folder_settings',
                folder_name: this.lookupReference('folderName').getValue()
            },
            success: function (form, action) {
                var settings = Ext.JSON.decode(action.response.responseText);

                if (settings.data.compression)
                    editWindow.lookupReference('compressBox').setValue(true);

                if (settings.data.folder_size)
                    editWindow.lookupReference('sizeBox').setValue(true);

                console.log('settingsForm is');
                console.log(settings);

                editWindow.lookupReference('titleLable').setText('Edit Folder');
                editWindow.lookupReference('volumeCombo').disable();

                editWindow.show( null, function() {
                    me.fireEvent('showFolderSettings', settings.data);
                });
            },
            failure: function (form, action) {
                Ext.Msg.alert('Error', 'Cannot load share folder settings.');
            }
        });
    },

    /**
     * Delete a selected folder
     */
    onDeleteShareFolder: function() {
        var selectedFolder = this.lookupReference('folderGrid').getSelection()[0],
            appWindow = this.getView('ShareFolder').up('#appwindow').controller,
            me = this;

        console.log(appWindow);
        console.log(selectedFolder);

        if (typeof selectedFolder === 'undefined') {
            Ext.Msg.alert('Error', 'No folder is selected.');
            return;
        }

        Ext.Msg.show({
            title: 'Delete Folder',
            message: 'Are you sure to delete ' + selectedFolder.data.folder_name + ' ?',
            closable: false,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: 'Cancel',
                no: 'Confirm'
            },
            fn: function(btn) {
                if (btn === 'yes') {
                    console.log('original Yes is pressed');
                } else {
                    appWindow.showLoadingMask();
                    Ext.Ajax.request({
                        type  : 'ajax',
                        method: 'post',
                        url   : 'app/Folder/backend/default/ShareFolder.php',
                        params: {
                            op: 'delete_folder',
                            pool  : selectedFolder.data.pool,
                            volume: selectedFolder.data.volume,
                            folder: selectedFolder.data.folder
                        },

                        // reload after success
                        success: function (response, opts) {
                            appWindow.getresponse(0, 'ShareFolder');
                            appWindow.hideLoadingMask();
                            me.reloadFolderList(false);
                        },

                        failure: function (response, opts) {
                            var errMsg = Ext.JSON.decode(response.responseText).msg;

                            if (typeof errMsg === 'undefined')
                                errMsg = 'Fail to apply your configuration.';

                            appWindow.getresponse(errMsg, 'ShareFolder');
                            appWindow.hideLoadingMask();
                        }
                    });
                }
            }
        });
    },

    // onRefreshShareFolder: function() {
    //     this.reloadFolderList(false);
    // },

    /**
     * Handle folder expanding events
     */
    onBeforeNodeExpand: function(node) {
        console.log('onBeforeNodeExpand is called!');
        console.log(node);
        if (node.isRoot())
            return;

        var folderTree = this.getStore('folderTree'),
            folderTreeProxy = folderTree.getProxy();

        folderTreeProxy.setExtraParams({
            op: 'get_folder_list',
            abs_path:   node.data.abs_path,
            belongs_to: node.data.belongs_to
        });

        folderTree.load({node: node});
    },

    /**
     * Handle folder selection events
     */
    onBeforeChangeDirectory: function(rowmodel, record, index) {
        console.log('before change directory');

        var me = this;

        if (me.noDirtyPass && this.checkDirty()) {
            Ext.Msg.show({
                title  : 'Save Changes?',
                message: 'You haven\'t saved your configuration. Would you like to change without saving?',
                buttons: Ext.Msg.YESNO,
                fn: function(btn) {
                    if (btn === 'yes') {
                        me.noDirtyPass = false;
                        me.lookupReference('folderGrid').setSelection(record);
                    } else if (btn === 'no') {
                        //selectedFolder.focus();
                    }
                }
            });
            return false;
        }
        return true;
    },

    onChangeDirectory: function(model, selectedRecord) {
        // avoid problem when reloading TreeStore
        if (selectedRecord.length === 0)
            return;

        this.noDirtyPass = true;
        this.reloadPermissions(this.getCurrentFolderInfo(true));
    },

    onActionMenuClick: function(menu, item) {
        console.log('onActionMenuClick');
        console.log(item);
        switch (item.text) {
            case 'Edit':     this.onEditShareFolder();      break;
            case 'Delete':   this.onDeleteShareFolder();    break;
            case 'Refresh':  this.reloadFolderList(false);  break;
            default:
        }
    },

    onActionMenuExpand: function(panel) {
        console.log('onActionMenuExpand');
    },

///////////////////////// DomainType /////////////////////////////////
    /**
     * Load ACLs according to the selected domain
     */
    onDomainTypeSelect: function(combobox, record) {
        var permAll   = this.getStore('permAll'),
            selection = combobox.getValue();
        console.log('change domain type');
        console.log(record);
        permAll.loadAccounts(selection);
    },

///////////////////////// Permission /////////////////////////////////
    /**
     * Handle clicking events on check columns
     */
    onBeforeLinuxPermChange: function(checkBox, rowIndex, checked) {
        var record = this.getStore('permAll').getAt(rowIndex);

        if (checked) {
            switch (checkBox.dataIndex) {
                case 'deny':  record.set('linux_perm', 1);   break;
                case 'ro':    record.set('linux_perm', 2);   break;
                case 'rw':    record.set('linux_perm', 3);   break;
                default:      break;
            }
        } else {
            record.set('linux_perm', 0);
        }
    },

    showCustomPermWindow: function(checkBox, rowIndex, checked) {
        var record = this.getStore('permAll').getAt(rowIndex),
            selectedDomain = this.lookupReference('domainType').getSelection().data,
            // custom
            customWindow = Ext.create('DESKTOP.Folder.default.view.CustomWindow'),
            customDomain = customWindow.lookupReference('domainType'),
            acctRowIndex = customWindow.lookupReference('acctRowIndex'),
            userName = customWindow.lookupReference('userName');

        console.log('set basic info of custom window');
        userName.setFieldLabel(selectedDomain.text);
        userName.setValue(record.get('name'));
        customDomain.setValue(selectedDomain.value);
        acctRowIndex.setValue(rowIndex);

        console.log('set custom viewmodel');
        var customeViewModel = Ext.create('DESKTOP.Folder.default.model.CustomWindowModel'),
            customPerms = customeViewModel.getStore('customPerms'),
            windows_perm = record.get('windows_perm'),
            schema = customWindow.lookupReference('schema'),
            schemaStore = Ext.create('Ext.data.Store', {
                fields: ['schemaName', 'schemaNumber']
            });

        customPerms.originalPerms = Ext.clone(windows_perm);
        customWindow.setViewModel(customeViewModel);
        schema.bindStore(schemaStore);

        if (windows_perm) {
            var permLength = windows_perm.length,
                dataArr = [];

            for (var idx = 0; idx < permLength; idx++) {
                dataArr.push({
                    schemaName: 'Schema ' + (idx+1),
                    schemaNumber: idx
                });
            }

            customPerms.loadData(windows_perm);
            schemaStore.setData(dataArr);
            schema.select(0);
        } else {
            customWindow.lookupReference('addButton').fireEvent('click');
        }

        customWindow.show();
        console.log('show done');
    },

    reloadFolderList: function(selectedFolder) {
        var folderGrid = this.lookupReference('folderGrid'),
            folderTree = this.getStore('folderTree'),
            folderTreeProxy = folderTree.getProxy(),
            permPanel = this.getView('ShareFolder');

        console.log('reload folder is called');
        console.log(selectedFolder);

        folderTreeProxy.setExtraParams({
            op: 'get_all_folders',
            node: 'root'
        });

        permPanel.getEl().mask('Reloading...', 'x-mask-loading');
        folderTree.load({
            callback: function(records, operation, success) {
                if (success && selectedFolder) {
                    console.log('create done');
                    for (var index in records) {
                        if (records[index].data.folder_name === selectedFolder) {
                            console.log('fuck it is');
                            console.log(selectedFolder);

                            folderGrid.setSelection(records[index]);
                            break;
                        }
                    }
                } else {
                    folderGrid.setSelection(records[0]);
                }
                permPanel.getEl().unmask();
            }
        });
    },

    reloadPermissions: function(settings) {
        var domainType    = this.lookupReference('domainType'),
            customCheck   = this.lookupReference('customCheck'),
            folderConfigs = this.lookupReference('folderConfigs'),
            accountPerms  = this.getStore('accountPerms'),
            accountPermsProxy = accountPerms.getProxy(),
            me = this;

        accountPermsProxy.setExtraParam('settings', settings);
        accountPerms.load( function(records, operation, success) {
            console.log('after reloadPermissions');
            console.log(records[0]);
            folderConfigs.loadRecord(records[0]);

            if ( (typeof records[0].data.acl.user[0].windows_perm === 'undefined') ||
                 (records[0].data.acl.user[0].windows_perm === null) )
            {
                customCheck.hide();
                console.log('customCheck hide');
            } else {
                customCheck.show();
                console.log('customCheck show');
            }

            if ( (records[0].data.belongs_to === records[0].data.folder_name) &&
                 (records[0].data.abs_path.indexOf(records[0].data.folder_name) < 0) )
            {
                me.lookupReference('menu-snapshot').enable();
                me.lookupReference('menu-qslock').enable();
                me.lookupReference('menu-convert').enable();
                me.lookupReference('menu-edit').enable();
                me.lookupReference('menu-delete').enable();
            } else {
                me.lookupReference('menu-snapshot').disable();
                me.lookupReference('menu-qslock').disable();
                me.lookupReference('menu-convert').disable();
                me.lookupReference('menu-edit').disable();
                me.lookupReference('menu-delete').disable();
            }

            domainType.select('user');
            domainType.fireEvent('select', domainType);
        });
    },

///////////////////////// Search /////////////////////////////////

    onSearchFolder: function(textfield) {
        var target = textfield.getValue();
        var folderTree = this.getStore('folderTree');
        var queryStr = null;

        console.log(target);

        if (target.match(/\w+/) === null && target !== '') {
            queryStr = new RegExp('(\\' + target + ')', 'gi');
        } else {
            queryStr = new RegExp('(' + target + ')', 'gi');
        }
        console.log(queryStr);
        folderTree.clearFilter(true);
        folderTree.filterBy( function (record) {
            var name = record.get('folder_name').toString();
            return name.match(queryStr);
        });
    },

    onSearchAccount: function(textfield) {

    },

///////////////////////// Listening Events /////////////////////////////////

    onFolderCreated: function(args) {
        console.log('onFolderCreated!');
        this.reloadFolderList(args.folder_name);
    },

    onCustomPermUpdated: function(args) {
        console.log('onCustomPermUpdated');
        console.log(args);
        var record = this.getStore('permAll').getAt(args.rowIndex);
        console.log(record);
        record.set('windows_perm', args.newPerm);
    },

    onAccountPermsLoaded: function(args) {
        console.log('on receive ');
    },

    onFolderTreeLoaded: function(args) {
        if (args) {
            this.lookupReference('folderConfigs').enable();
            this.lookupReference('permGrid').enable();
        } else {
            this.lookupReference('folderConfigs').disable();
            this.lookupReference('permGrid').disable();
        }
    },
///////////////////////// Private functions /////////////////////////////////

    checkDirty: function() {
        console.log('/////////////////////////////////////////////////////////////////////');
        var folderConfigs = this.lookupReference('folderConfigs').getForm().getFieldValues(),
            accountPerms = this.getStore('accountPerms'),
            permAll = this.getStore('permAll'),
            ret = false;

        console.log(folderConfigs);
        if (folderConfigs)  ret = accountPerms.isDirty(folderConfigs);
        if (!ret)           ret = permAll.isDirty();

        return ret;
    },

    getCurrentFolderInfo: function(jsonFormat) {
        var selectedFolder = this.lookupReference('folderGrid').getSelection()[0],
            ret = {
                'abs_path'   : selectedFolder.data.abs_path,
                'folder_name': selectedFolder.data.folder_name,
                'belongs_to' : selectedFolder.data.belongs_to
            };

        return jsonFormat ? Ext.JSON.encode(ret) : ret;
    },

    getChangedData: function(jsonFormat) {
        var settings = this.lookupReference('folderConfigs').getForm().getFieldValues();

        settings.include_parent = this.includeParentOption;
        Ext.Object.merge(settings, this.getCurrentFolderInfo(false), this.getStore('permAll').getChangedData());

        return jsonFormat ? Ext.JSON.encode(settings) : settings;
    },

    onBeforeCellClick: function() {
        console.log('onBeforeCellClick!');
    },
    onBeforeItemClick: function() {
        console.log('onBeforeItemClick!');
    },

    on_Apply_All: function(form, appWindow) {
        var permAll   = this.getStore('permAll'),
            permPanel = this.getView('ShareFolder'),
            me = this;

        if (me.checkDirty()) {
            var changedData = me.getChangedData(true);

            console.log('appWindow is');
            console.log(appWindow);

            appWindow.showLoadingMask();
            Ext.Ajax.request({
                type  : 'ajax',
                method: 'post',
                url   : 'app/Folder/backend/default/ShareFolder.php',
                params: {
                    op: 'set_folder_acl',
                    settings: changedData
                },
                success: function (response, opts) {
                    appWindow.getresponse(0, 'ShareFolder');
                    appWindow.hideLoadingMask();
                    me.reloadPermissions(me.getCurrentFolderInfo(true));
                },
                failure: function (response, opts) {
                    var errMsg = Ext.JSON.decode(response.responseText).msg;

                    if (typeof errMsg === 'undefined')
                        errMsg = 'Fail to apply your configuration.';

                    appWindow.getresponse(errMsg, 'ShareFolder');
                    appWindow.hideLoadingMask();
                }
            });

        } else {
            Ext.Msg.alert('Alert', 'Nothing has changed.');
        }
    },

    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    }
});
