Ext.define('DESKTOP.FileManager.FileManagerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.appwindow',
    data: {
        currentPath: '',
        dataView: true,
        gridView: false,
        gridViewDetail: false,
        pathRecord: [],
        pathTree: [],
        defaultPath: '',
        curPath: '',
        fileChoice: ''
    },
    stores: {
        menuTree: {
            storeId: 'menuTree',
            type: 'tree',
            rootVisible: false,
            autoLoad: true,
            view: null,
            fields: [''],
            defaultRootProperty: 'tree',
            proxy: {
                type: 'ajax',
                method: 'GET',
                url: 'app/FileManager/backend/NavigationBarList.php',
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            root: {
                expanded: false
            },
            listeners: {
                load: function (store, record, success) {
                    // store.view.down('#trees').bindStore(this);
                    store.view.down('#trees').getSelectionModel().select(store.getNodeById(store.root.firstChild.firstChild.id));
                    store.view.getController().menuClick(store.view.down('#trees'), store.root.firstChild.firstChild);
                }
            }
        },
        uploadTask: {
            storeId: 'uploadTask',
            autoLoad: true,
            fields: [''],
            proxy: {
                type: 'ajax',
                url: 'app/FileManager/backend/FileUpload.php',
                method: 'GET',
                extraParams: {
                    op: 'get_upload_task'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            listeners: {
                load: function (store, record, success) {
                    console.log(record);
                    console.log(store);
                }
            }
        },
        // folderList: {
        //     storeId: 'folderList',
        //     autoLoad: false,
        //     view: null,
        //     selfVM: null,
        //     fields: [''],
        //     proxy: {
        //         type: 'ajax',
        //         method: 'get',
        //         url: 'app/FileManager/backend/FileManager.php',
        //         // extraParams: {
        //         //     op: 'get_folder_list'
        //         // },
        //         reader: {
        //             type: 'json',
        //             successProperty: 'success'
        //         }
        //     },
        //     listeners: {
        //         load: function (store, records, successful) {
        //             store.loadData(records[0].data.data.data);
        //             store.selfVM.set('currentPath', records[0].data.data.path);
        //         }
        //     }
        // },
        folderView: {
            storeId: 'folderView',
            fields: [{
                name: 'size',
                type: 'string',
                convert: function (value) {
                    return filesize(value);
                }
            }, {
                name: 'mtime',
                type: 'string',
                convert: function (value) {
                    return date('Y-m-d H:i:s', value);
                }
            }, {
                name: 'atime',
                type: 'string',
                convert: function (value) {
                    return date('Y-m-d H:i:s', value);
                }
            }, {
                name: 'ctime',
                type: 'string',
                convert: function (value) {
                    return date('Y-m-d H:i:s', value);
                }
            }],
            autoLoad: false,
            selfVM: null,
            view: null,
            sorters: {
                property: 'type',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: 'app/FileManager/backend/ViewBrowserList.php',
                extraParams: {
                    op: 'file_list_property'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            listeners: {
                load: 'storeLoad'
            }
        }
    }
});
