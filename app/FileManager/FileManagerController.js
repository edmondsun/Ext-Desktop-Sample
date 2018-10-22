Ext.define('DESKTOP.FileManager.FileManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.appwindow',
    requires: [
        'DESKTOP.FileManager.UploadConfirm'
    ],
    init: function () {
        this.getStore('menuTree').view = this.getView();
        this.getStore('folderView').selfVM = this.getViewModel();
        this.getStore('folderView').view = this.getView();
        this.globalButton = [{
            defaultName: "Reload",
            nameIndex: "Reload",
            handler: "onReload"
        }, {
            defaultName: "Upload",
            nameIndex: "Upload",
            handler: "onUpload"
        }, {
            defaultName: "Create",
            nameIndex: "Create",
            handler: "onCreate"
        }, {
            defaultName: "My connect",
            nameIndex: "My connect",
            handler: "onMyconnect"
        }, {
            defaultName: "Preference",
            nameIndex: "Preference",
            handler: "onPreference"
        }];
        this.copy_move_obj = {
            sourcePath: '',
            sourceTitle: []
        };
        this.actionType = '';
    },
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    },
    menuClick: function (menu, record, item, index, e, eOpts) {
        var defaultPath = record.data.path.replace('UserHome', '');
        var pathTree = this.getViewModel().get('pathTree');
        if (record.data.text === "Home") {
            this.getStore('folderView').proxy.extraParams = {
                op: 'file_list_property',
                sourcePath: record.data.path
            };
            this.getViewModel().set('curPath', record.data.path);
            this.getViewModel().set('defaultPath', defaultPath);
            pathTree.push({
                path: record.data.path,
                expand: []
            });
            this.getViewModel().set('pathTree', pathTree);
            this.getStore('folderView').load();
        }
    },
    griddbclick: function (grid, record, item, index, e, eOpts) {
        var vm = this.getViewModel();
        var querypath = vm.get('curPath') + '/' + record.data.title;
        var gridStore = grid.getStore();
        if (record.data.type == "Folder") {
            gridStore.proxy.extraParams = {
                op: 'file_list_property',
                sourcePath: querypath
            };
            vm.set('curPath', querypath);
            gridStore.load();
        }
    },
    gridContainerclick: function (grid) {
        grid.getSelectionModel().deselectAll();
    },
    dataViewdbclick: function (view, record, item) {
        var folderRec = view.store;
        var menuItem = [];
        var vm = this.getViewModel();
        var queryPath = vm.get('curPath') + '/' + record.data.title;
        var tmpPath = vm.get('pathRecord');
        if (record.data.type === 'Folder') {
            folderRec.proxy.extraParams = {
                op: 'file_list_property',
                sourcePath: queryPath
            };
            tmpPath.push(queryPath);
            vm.set('curPath', queryPath);
            vm.set('pathRecord', tmpPath);
            folderRec.load();
        }
    },
    containerRightclick: function (container, event, eOpts) {
        var me = this;
        event.stopEvent();
        var curPath = me.getViewModel().get('curPath');
        var params = {};
        menu = me.menu;
        // prevent default right click behaviour
        if (!menu) {
            menu = Ext.create('Ext.menu.Menu', {
                // controller: 'appwindow',
                items: [{
                    text: 'Paste',
                    handler: function () {
                        switch (me.actionType) {
                        case 'Cut':
                            params = {
                                op: 'move_dir_file',
                                sourceName: Ext.JSON.encode(me.copy_move_obj.sourceTitle),
                                sourcePath: me.copy_move_obj.sourcePath,
                                destPath: curPath
                            };
                            break;
                        case 'Copy':
                            params = {
                                op: 'copy_dir_file',
                                sourceName: Ext.JSON.encode(me.copy_move_obj.sourceTitle),
                                sourcePath: me.copy_move_obj.sourcePath,
                                destPath: curPath
                            };
                            break;
                        default:
                            break;
                        }
                        Ext.Ajax.request({
                            url: 'app/FileManager/backend/FileMvCp.php',
                            method: 'POST',
                            params: params,
                            success: function (response) {
                                console.log('response', response);
                                if (me.actionType == 'Cut') {
                                    me.copy_move_obj = {
                                        sourcePath: [],
                                        sourceTitle: []
                                    };
                                }
                                me.getStore('folderView').reload();
                            }
                        });
                    }
                }]
            });
        }
        // menu.contextRecord = recor;
        menu.showAt(event.getXY());
    },
    rightclick: function (view, record, item, index, event) {
        event.stopEvent();
        var checkSelect = view.getSelectionModel().getSelection();
        if (checkSelect.length === 0) {
            view.setSelection(record);
        }
        var me = this;
        var curPath = me.getViewModel().get('curPath');
        var selectItems = view.getSelectionModel().getSelection();
        var path;
        var op = '';
        var params = {};
        if (record.data.type === 'Folder' || selectItems.length >= 2) {
            var files = [];
            Ext.each(selectItems, function (obj) {
                files.push(obj.data.title);
            });
            params.op = 'download_multifile';
            params.sourcePath = curPath;
            params.sourceName = Ext.JSON.encode(files);
        } else {
            params.op = 'download_singlefile';
            params.sourcePath = curPath + '/' + selectItems[0].data.title;
        }
        menu = me.menu;
        // prevent default right click behaviour
        if (!menu) {
            menu = Ext.create('Ext.menu.Menu', {
                // controller: 'appwindow',
                items: [{
                    text: 'Copy',
                    handler: function () {
                        me.actionType = 'Copy';
                        me.copy_move_obj = {
                            sourcePath: '',
                            sourceTitle: []
                        };
                        if (selectItems.length > 2) {
                            Ext.each(selectItems, function (arr, index) {
                                if (index <= selectItems.length - 1) {
                                    me.copy_move_obj.sourcePath = curPath;
                                    me.copy_move_obj.sourceTitle.push(arr.data.title);
                                }
                            });
                        } else {
                            me.copy_move_obj.sourcePath = curPath;
                            me.copy_move_obj.sourceTitle.push(record.data.title);
                        }
                    }
                }, {
                    text: 'Cut',
                    handler: function () {
                        me.actionType = 'Cut';
                        me.copy_move_obj = {
                            sourcePath: '',
                            sourceTitle: []
                        };
                        if (selectItems.length > 2) {
                            Ext.each(selectItems, function (arr, index) {
                                if (index <= selectItems.length - 1) {
                                    me.copy_move_obj.sourcePath = curPath;
                                    me.copy_move_obj.sourceTitle.push(arr.data.title);
                                }
                            });
                        } else {
                            me.copy_move_obj.sourcePath = curPath;
                            me.copy_move_obj.sourceTitle.push(record.data.title);
                        }
                    }
                }, {
                    text: 'Remove',
                    handler: function () {
                        var sourceName = [];
                        if (selectItems.length > 2) {
                            Ext.each(selectItems, function (arr, index) {
                                if (index <= selectItems.length - 1) {
                                    sourceName.push(arr.data.title);
                                }
                            });
                        } else {
                            sourceName.push(record.data.title);
                        }
                        Ext.Ajax.request({
                            url: 'app/FileManager/backend/FileDelete.php',
                            method: 'POST',
                            params: {
                                op: 'delete_dir_file',
                                sourceName: Ext.JSON.encode(sourceName),
                                sourcePath: curPath
                            },
                            success: function (response) {
                                var res_obj = Ext.JSON.decode(response.responseText);
                                console.log("res_obj", res_obj);
                                if (res_obj.success) {
                                    me.getStore('folderView').reload();
                                } else {
                                    Ext.Msg.alert('Failure', res_obj.msg);
                                }
                            }
                        });
                    }
                }, {
                    text: 'Download',
                    handler: function (me) {
                        var form = Ext.create('Ext.form.Panel', { // this wolud be your form
                            standardSubmit: true // this is the important part
                        });
                        form.submit({
                            url: 'app/FileManager/backend/FileDownload.php',
                            type: 'POST',
                            params: params
                        });
                    }
                }, {
                    text: 'Property',
                    handler: function () {}
                }, {
                    text: 'Rename',
                    handler: function () {
                        var win = Ext.create('DESKTOP.ux.qcustomize.window.SubWindow', {
                            closeAction: 'destroy',
                            title: 'Create Folder',
                            modal: true,
                            items: [{
                                xtype: 'textfield',
                                qDefault: true,
                                fieldLabel: 'Folder Name',
                                allowBlank: false
                            }],
                            buttons: ['->', {
                                text: 'Cancel',
                                qDefault: true,
                                listeners: {
                                    click: function () {
                                        this.up('window').close();
                                    }
                                }
                            }, {
                                text: 'Confirm',
                                qDefault: true,
                                itemId: 'confirm',
                                buttonType: 'primary',
                                listeners: {
                                    click: function () {
                                        var win = this.up('window');
                                        var foldername = win.down('textfield').getValue();
                                        Ext.Ajax.request({
                                            url: 'app/FileManager/backend/FileRename.php',
                                            method: 'POST',
                                            params: {
                                                op: 'rename_dir_file',
                                                oldName: selectItems[0].data.title,
                                                newName: foldername,
                                                sourcePath: curPath
                                            },
                                            success: function (response) {
                                                var res_obj = Ext.JSON.decode(response.responseText);
                                                console.log("res_obj", res_obj);
                                                if (res_obj.success) {
                                                    me.getStore('folderView').reload();
                                                    win.close();
                                                } else {
                                                    Ext.Msg.alert('Failure', res_obj.msg);
                                                }
                                            }
                                        });
                                    }
                                }
                            }]
                        });
                        win.show();
                    }
                }]
            });
        }
        // menu.contextRecord = recor;
        menu.showAt(event.getXY());
    },
    changeMainView: function (view, button, isPressed) {
        var vm = this.getViewModel();
        switch (button.itemId) {
        case 'dataViewbtn':
            vm.set('dataView', true);
            vm.set('gridView', false);
            vm.set('gridViewDetail', false);
            break;
        case 'gridViewbtn':
            vm.set('dataView', false);
            vm.set('gridView', true);
            vm.set('gridViewDetail', false);
            break;
        case 'gridViewDetailbtn':
            vm.set('dataView', false);
            vm.set('gridView', false);
            vm.set('gridViewDetail', true);
            break;
        }
    },
    storeLoad: function (store, records, success) {
        if (success) {
            var view = store.view;
            var vm = store.selfVM;
            var pathTree = vm.get('pathTree');
            var curPath = vm.get('curPath');
            var defaultPath = vm.get('defaultPath');
            var pathArr = curPath.replace(defaultPath, '');
            var tmpPath = defaultPath;
            pathArr = pathArr.split('/');
            var tmpExpand = [];
            var isNew = true;
            view.down('#path').removeAll();
            Ext.each(records, function (obj) {
                if (obj.data.type === 'Folder') {
                    tmpExpand.push(obj.data.title);
                }
            });
            Ext.each(pathTree, function (obj) {
                if (obj.path === curPath) {
                    obj.expand = tmpExpand;
                    isNew = false;
                }
            });
            if (isNew) {
                pathTree.push({
                    path: curPath,
                    expand: tmpExpand
                });
            }
            vm.set('pathTree', pathTree);
            // for (var i = 0; i < pathArr.length; i++) {
            Ext.each(pathArr, function (path, i) {
                if (tmpPath[tmpPath.length - 1] != "/") {
                    tmpPath += "/";
                }
                tmpPath += pathArr[i];
                var expand = [];
                Ext.each(pathTree, function (obj) {
                    if (obj.path === tmpPath)
                        expand = obj.expand;
                });
                var linkBtn = Ext.create('Ext.button.Split', {
                    text: pathArr[i],
                    curPath: tmpPath,
                    expand: expand,
                    // menu: new Ext.menu.Menu({
                    //     items: menuItem
                    // }),
                    listeners: {
                        click: function (me) {
                            var vm = me.up('#appwindow').getViewModel();
                            var pathRecord = vm.get('pathRecord');
                            /*  Save path record  */
                            if (pathRecord[pathRecord.length - 1] !== me.curPath)
                                pathRecord.push(me.curPath);
                            vm.set('pathRecord', pathRecord);
                            vm.set('curPath', me.curPath);
                            me.up('#appwindow').down('#ima').store.proxy.extraParams = {
                                op: 'file_list_property',
                                sourcePath: me.curPath
                            };
                            me.up('#appwindow').down('#ima').store.load();
                        },
                        arrowclick: function (me, event) {
                            if (!me.menuZ && me.expand.length > 0) {
                                var menuItem = [];
                                Ext.each(me.expand, function (obj, index) {
                                    var tmpMenu = {};
                                    tmpMenu.text = obj;
                                    tmpMenu.path = me.curPath + '/' + obj;
                                    tmpMenu.handler = function (me) {
                                        var main = Ext.ComponentQuery.query('#appwindow')[0];
                                        var vm = main.getViewModel();
                                        var pathRecord = vm.get('pathRecord');
                                        /*  Save path record  */
                                        if (pathRecord[pathRecord.length - 1] !== tmpMenu.path)
                                            pathRecord.push(tmpMenu.path);
                                        vm.set('pathRecord', pathRecord);
                                        vm.set('curPath', tmpMenu.path);
                                        main.down('#ima').store.proxy.extraParams = {
                                            op: 'file_list_property',
                                            sourcePath: tmpMenu.path
                                        };
                                        main.down('#ima').store.load();
                                    };
                                    menuItem.push(tmpMenu);
                                });
                                var folderMenu = new Ext.menu.Menu({
                                    items: menuItem
                                });
                                me.setMenu(folderMenu);
                                me.showMenu();
                            }
                        }
                    }
                });
                view.down('#path').insert(-1, linkBtn);
            });
        }
    },
    onUpload: function (me) {
        var vm = me.up('#appwindow').getViewModel();
        var choice = vm.get('fileChoice');
        if (choice === '') {
            var setting = Ext.create('DESKTOP.FileManager.UploadConfirm');
            setting.show();
        } else {
            this.fileUpload();
        }
    },
    fileUpload: function (option) {
        var vm = Ext.ComponentQuery.query('#appwindow')[0].getViewModel();
        var choice = vm.get('fileChoice');
        var path;
        var main = this.getView();
        var dataview = main.down('#ima');
        var selection = dataview.getSelectionModel().getSelection()[0];
        if (typeof (selection) !== 'undefined' && selection.data.type === 'Folder') {
            path = vm.get('curPath') + '/' + selection.data.title;
        } else {
            path = vm.get('curPath');
        }
        path = "/www/dev_jack";
        main.down('#uploadform').submit({
            params: {
                op: 'upload_singlefile',
                file_path: path
            },
            success: function (form, action) {
                var ref = 0;
                var msg = action.result.msg;
                var dataview = Ext.ComponentQuery.query('#ima')[0];
                Ext.Msg.alert('Success', 'Upload success');
                dataview.getStore().load();
            },
            failure: function (form, action) {
                var msg = action.result.msg;
                var dataview = Ext.ComponentQuery.query('#ima')[0];
                Ext.Msg.alert('Fail', msg);
                dataview.getStore().load();
            }
        });
    },
    onCreateDir: function () {
        var me = this;
        var curPath = me.getViewModel().get('curPath');
        var win = Ext.create('DESKTOP.ux.qcustomize.window.SubWindow', {
            closeAction: 'destroy',
            title: 'Create Folder',
            modal: true,
            items: [{
                xtype: 'textfield',
                qDefault: true,
                fieldLabel: 'Folder Name',
                allowBlank: false
            }],
            buttons: ['->', {
                text: 'Cancel',
                qDefault: true,
                listeners: {
                    click: function () {
                        this.up('window').close();
                    }
                }
            }, {
                text: 'Confirm',
                qDefault: true,
                itemId: 'confirm',
                buttonType: 'primary',
                listeners: {
                    click: function () {
                        var win = this.up('window');
                        var foldername = win.down('textfield').getValue();
                        Ext.Ajax.request({
                            url: 'app/FileManager/backend/FileCreateDir.php',
                            method: 'POST',
                            params: {
                                op: 'create_dir',
                                sourcePath: curPath,
                                sourceName: foldername
                            },
                            success: function (response) {
                                var res_obj = Ext.JSON.decode(response.responseText);
                                if (res_obj.success) {
                                    me.getStore('folderView').reload();
                                    win.close();
                                } else {
                                    Ext.Msg.alert('Failure', res_obj.msg);
                                }
                            }
                        });
                    }
                }
            }]
        });
        win.show();
    },
    toggleDisplay: function () {
        var me = this,
            meView = me.getView(),
            changeState = false,
            topDownIndex,
            isActived = false;
        // console.log("meView.isMinimized", meView, meView.isMinimized)
        if (meView.isMasked()) {
            return false;
        }
        if (meView.isMinimized) {
            meView.show();
            changeState = true;
        } else {
            topDownIndex = 0;
            Ext.WindowManager.eachTopDown(function (cmp) {
                if (topDownIndex <= 1) {
                    if (cmp.id == meView.id) {
                        isActived = true;
                        return false;
                    }
                } else {
                    return false;
                }
                // console.log(cmp);
                topDownIndex++;
            });
            if (isActived) {
                meView.hide();
                changeState = true;
            } else {
                Ext.WindowManager.bringToFront(meView.id);
            }
        }
        if (changeState) {
            meView.isMinimized = !meView.isMinimized;
        }
    },
    /* mask this window if status of process is running. */
    showLoadingMask: function (iconActive) {
        iconActive = typeof iconActive !== "undefined" ? iconActive : true;
        var me = this,
            meView = me.getView();
        if (iconActive) {
            meView.mask("Loading", "loadingx");
        } else {
            meView.mask();
        }
    },
    /* unmask this window if status of process is done. */
    hideLoadingMask: function () {
        var me = this,
            meView = me.getView();
        meView.unmask();
    },
    toolClose: function (event, toolEl, panel) {
        /* Remove extId from DESKTOP_APP[appKey].extId after close window. (dynamic extId for window) */
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop'),
            dockContainer = Ext.getCmp('dockContainer'),
            qsan_app_obj = DESKTOP_APP[meView.appKey],
            remove_id = qsan_app_obj.extId.indexOf(meView.id),
            remove_id_desktop = desktop.windowOpened.indexOf(meView.id);
        if (remove_id > -1) {
            qsan_app_obj.extId.splice(remove_id, 1);
            desktop.windowOpened.splice(remove_id_desktop, 1);
        }
        dockContainer.getController().dockRemoveItem(meView);
        meView.close();
    },
    toolMinimize: function (event, toolEl, panel) {
        var me = this,
            meView = me.getView();
        meView.isMinimized = true;
        meView.hide();
    },
    adjustPosition: function (containerEl, windowEl, desktop, newWin) {
        newWin = typeof newWin != "undefined" ? newWin : true;
        var limit_container = {
                "top": 0,
                "right": containerEl.getWidth(),
                "bottom": containerEl.getHeight(),
                "left": 0
            },
            limit_window = {
                "top": windowEl.y,
                "right": windowEl.x + windowEl.getWidth(),
                "bottom": windowEl.y + windowEl.getHeight(),
                "left": windowEl.x,
                "height": windowEl.getHeight(),
                "headerBottom": windowEl.x + Ext.get(windowEl.id + '_header').getHeight()
            },
            windowLastPosition = desktop.windowLastPosition.slice(0),
            x = windowEl.x,
            y = windowEl.y;
        if (newWin) {
            if (limit_window.right > limit_container.right) {
                x = 0;
                y = 0;
            } else {
                if (limit_window.bottom > limit_container.bottom) {
                    y = 0;
                }
            }
        }
        return [x, y];
    }
});
