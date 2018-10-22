/**
 * @class Ext.ux.upload.Basic
 * @extends Ext.util.Observable
 *
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('DESKTOP.FileManager.uploader.UploaderBasic', {
    extend: 'Ext.util.Observable',
    autoStart: true,
    autoRemoveUploaded: true,
    statusQueuedText: 'Ready to upload',
    statusUploadingText: 'Uploading ({0}%)',
    statusFailedText: 'Error',
    statusDoneText: 'Complete',
    statusInvalidSizeText: 'File too large',
    statusInvalidExtensionText: 'Invalid file type',
    // requires: ['DESKTOP.FileManager.uploader.UploaderModel'],
    configs: {
        uploader: {
            runtimes: '',
            url: '',
            browse_button: null,
            container: null,
            max_file_size: '128mb',
            resize: '',
            flash_swf_url: '',
            silverlight_xap_url: '',
            filters: [],
            //chunk_size: '1mb', // @see http://www.plupload.com/punbb/viewtopic.php?id=1259
            chunk_size: null,
            unique_names: true,
            multipart: true,
            multipart_params: {},
            multi_selection: true,
            drop_element: null,
            required_features: null
        }
    },
    constructor: function (owner, config) {
        var me = this;
        me.owner = owner;
        me.success = [];
        me.failed = [];
        Ext.apply(me, config.listeners);
        me.uploaderConfig = Ext.apply(me, config.uploader, me.configs.uploader);
        Ext.define('Ext.ux.upload.Model', {
            extend: 'Ext.data.Model',
            fields: ['id',
                'loaded',
                'name',
                'size',
                'percent',
                'status',
                'msg',
                'md5',
                'isLock',
                'stime',
                'rtime',
                'speed'
            ]
        });
        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'Ext.ux.upload.Model',
            storeId: 'upload_store',
            autoLoad: true,
            async: false,
            sorters: {
                property: 'id',
                direction: 'ASC'
            },
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
                load: me.onStoreLoad,
                remove: me.onStoreRemove,
                update: me.onStoreUpdate,
                scope: me
            }
        });
        me.actions = {
            textStatus: Ext.create('Ext.Action', {
                text: '<i>uploader not initialized</i>'
            }),
            add: Ext.create('Ext.Action', {
                text: config.addButtonText || 'Add files',
                iconCls: config.addButtonCls,
                disabled: false
            }),
            start: Ext.create('Ext.Action', {
                text: config.uploadButtonText || 'Restart',
                disabled: true,
                iconCls: config.uploadButtonCls,
                handler: me.restart,
                scope: me
            }),
            cancel: Ext.create('Ext.Action', {
                text: config.cancelButtonText || 'Cancel',
                disabled: true,
                iconCls: config.cancelButtonCls,
                handler: me.cancel,
                scope: me
            }),
            removeUploaded: Ext.create('Ext.Action', {
                text: config.deleteUploadedText || 'Remove uploaded',
                disabled: true,
                handler: me.removeUploaded,
                scope: me
            }),
            removeAll: Ext.create('Ext.Action', {
                text: config.deleteAllText || 'Remove all',
                disabled: true,
                handler: me.removeAll,
                scope: me
            }),
            remove: Ext.create('Ext.Action', {
                text: config.deleteText || 'Remove',
                disabled: false,
                handler: me.remove,
                scope: me
            })
        };
        me.callParent();
        // me.initialize();
    },
    /**
     * @private
     */
    initialize: function () {
        var me = this;
        if (!me.initialized) {
            me.initialized = true;
            me.initializeUploader();
        }
    },
    /**
     * Destroys this object.
     */
    destroy: function () {
        this.clearListeners();
    },
    setUploadPath: function (path) {
        this.uploadpath = path;
    },
    // removeAll: function () {
    //     this.store.data.each(function (record) {
    //         this.removeFile(record.get('id'));
    //     }, this);
    // },
    remove: function (btn, file) {
        var me = this,
            selection = btn.up('#gridUploader').getSelectionModel().getSelection();
        if (typeof (selection) !== 'undefined') {
            selection.forEach(function (record) {
                var id = record.get('id');
                if (record.get('from_folder') === 1) {
                    var items = record.get('items');
                    Ext.each(items, function (obj) {
                        console.log(obj);
                        me.removeUploaderFile(obj.id);
                    });
                    me.removeStoreFile(id);
                } else {
                    me.removeStoreFile(id);
                    me.removeUploaderFile(id);
                }
            }, me);
        }
    },
    removeUploaded: function () {
        this.store.data.each(function (record) {
            if (record && record.get('status') == 5) {
                this.removeStoreFile(record.get('id'));
            }
        }, this);
    },
    removeStoreFile: function (id) {
        var me = this,
            store_file = me.store.getData(),
            remove_file;
        store_file.each(function (obj) {
            if (obj.id === id) {
                remove_file = obj;
            }
        });
        Ext.Ajax.request({
            url: 'app/FileManager/backend/FileUpload.php',
            method: 'POST',
            async: false,
            params: {
                op: 'remove_task',
                fileMd5: remove_file.data.md5,
                fileId: remove_file.data.id
            },
            success: function (response) {
                me.store.remove(remove_file);
            },
            failure: function (response) {}
        });
        // me.removeUploaderFile(id, remove_file);
        // if (typeof (uploader_file) !== 'undefined' && uploader_file.status === 2) {
        //     // For chunk case
        //     me.uploader.stop();
        //     me.uploader.removeFile(uploader_file);
        //     me.uploader.refresh();
        //     me.uploader.start();
        // } else if (uploader_file) {
        //     me.uploader.removeFile(uploader_file);
        // } else {
        //     me.store.remove(remove_file);
        // }
    },
    removeUploaderFile: function (id) {
        var me = this,
            uploader_file = me.uploader.getFile(id);
        if (typeof (uploader_file) !== 'undefined' && uploader_file.status === 2) {
            // For chunk case
            me.uploader.stop();
            me.uploader.removeFile(uploader_file);
            me.uploader.refresh();
            me.uploader.start();
        } else if (uploader_file) {
            me.uploader.removeFile(uploader_file);
        }
    },
    // addFile: function (file) {
    // },
    cancel: function () {
        var me = this;
        me.uploader.stop();
        me.actions.start.setDisabled(me.store.data.length === 0);
    },
    start: function () {
        var me = this;
        me.fireEvent('beforestart', me);
        if (me.multipart_params) {
            me.uploader.settings.multipart_params = me.multipart_params;
        }
        me.actions.start.setDisabled(true);
        me.uploader.start();
    },
    restart: function (btn, file) {
        var me = this;
        var selection = btn.up('#gridUploader').getSelectionModel().getSelection();
        me.fireEvent('beforestart', me);
        if (me.multipart_params) {
            me.uploader.settings.multipart_params = me.multipart_params;
        }
        if (typeof (selection) !== 'undefined') {
            Ext.each(selection, function (obj) {
                obj.data.status = 1;
            });
        } else {
            this.store.data.each(function (record) {
                if (record.get('status') === 4) {
                    record.data.status = 1;
                }
            });
        }
        // me.registTask();
        me.actions.start.setDisabled(true);
        Ext.defer(function () {
            me.start();
        }, 300);
    },
    // registTask: function () {
    //     var me = this;
    //     var vm = Ext.ComponentQuery.query('#appwindow')[0].getViewModel();
    //     var registArray = [];
    //     file_dir = vm.get('curPath') + '/';
    //     me.store.data.each(function (record) {
    //         if (record.get('status') !== 5 && record.get('status') !== 4 && record.get('status') !== 2) {
    //             var tmp = {};
    //             var file_path = file_dir + record.get('name');
    //             record.data.md5 = md5(file_path);
    //             // tmp.name = record.get('name');
    //             // tmp.size = record.get('size');
    //             // tmp.id = record.get('id');
    //             // tmp.status = record.get('status');
    //             // tmp.check_lock = record.get('check_lock');
    //             // tmp.loaded = record.get('loaded');
    //             // tmp.msg = record.get('msg');
    //             // tmp.path = record.get('path');
    //             // tmp.percent = record.get('percent');
    //             // tmp.rtime = record.get('rtime');
    //             // tmp.server_error = record.get('server_error');
    //             // tmp.speed = record.get('speed');
    //             // tmp.stime = record.get('stime');
    //             // tmp.target_name = record.get('target_name');
    //             // tmp.percent = record.get('percent');
    //             registArray.push(record.data);
    //         }
    //     }, this);
    //     registArray = Ext.JSON.encode(registArray);
    //     Ext.Ajax.request({
    //         url: 'app/FileManager/backend/FileUpload.php',
    //         method: 'POST',
    //         params: {
    //             op: 'regist_task',
    //             tasks: registArray
    //         },
    //         success: function (response) {
    //             // var res = Ext.decode(response.responseText);
    //             // var data = res.data;
    //             // Ext.each(data, function (obj) {
    //             //     me.store.data.each(function (record) {
    //             //         if (obj.id === record.get('id')) {
    //             //             record.data.isLock = obj.is_lock;
    //             //         }
    //             //     }, this);
    //             // });
    //         },
    //         failure: function (response) {}
    //     });
    // },
    regist_task: function (files, uploader) {
        var tasks = [],
            me = this,
            md5_path,
            folder;
        Ext.each(files, function (file) {
            if (file.originPath !== "") {
                folder = file.originPath.split('/')[0];
                file.from_folder = 1;
                file.md5 = md5(folder + file.key);
                file.top_folder = folder;
            } else {
                md5_path = file.targetDir + file.name;
                file.from_folder = 0;
                file.md5 = md5(md5_path);
            }
            tasks.push(file);
        });
        tasks = Ext.JSON.encode(tasks);
        Ext.Ajax.request({
            url: 'app/FileManager/backend/FileUpload.php',
            async: false,
            method: 'POST',
            params: {
                op: 'regist_task',
                tasks: tasks
            },
            success: function (response) {
                if (me.fireEvent('filesadded', me, files) !== false) {
                    if (me.autoStart && uploader.state != 2) {
                        Ext.defer(function () {
                            me.start();
                        }, 300);
                    }
                }
            },
            failure: function (response) {}
        });
    },
    initializeUploader: function () {
        var me = this;
        if (!me.uploaderConfig.runtimes) {
            var runtimes = ['html5'];
            me.uploaderConfig.flash_swf_url && runtimes.push('flash');
            me.uploaderConfig.silverlight_xap_url && runtimes.push('silverlight');
            runtimes.push('html4');
            me.uploaderConfig.runtimes = runtimes.join(',');
        }
        me.uploader = Ext.create('plupload.Uploader', me.uploaderConfig);
        Ext.each(['Init',
            'ChunkUploaded',
            'FilesAdded',
            'FilesRemoved',
            'FileUploaded',
            'PostInit',
            'QueueChanged',
            'Refresh',
            'StateChanged',
            'BeforeUpload',
            'UploadFile',
            'UploadProgress',
            'Error',
            'CreateFolder'
        ], function (v) {
            me.uploader.bind(v, eval("me._" + v), me);
        }, me);
        me.uploader.init();
    },
    updateProgress: function () {
        // var me = this,
        //     t = me.uploader.total,
        //     speed = Ext.util.Format.fileSize(t.bytesPerSec),
        //     total = me.store.data.length,
        //     failed = me.failed.length,
        //     success = me.success.length,
        //     sent = failed + success,
        //     queued = total - success - failed,
        //     percent = t.percent;
        // me.fireEvent('updateprogress', me, total, percent, sent, success, failed, queued, speed);
    },
    updateStore: function (v) {
        var me = this,
            data = me.store.getById(v.id);
        if (!v.msg) {
            v.msg = '';
        }
        if (data) {
            data.data = v;
            data.commit();
        } else {
            me.store.loadData([v], true);
        }
    },
    onStoreLoad: function (store, record, operation) {
        var me = this,
            tasks = [];
        if (store.data.length) {
            me.actions.start.setDisabled(false);
            me.actions.removeUploaded.setDisabled(false);
            me.actions.removeAll.setDisabled(false);
            me.actions.remove.setDisabled(false);
        }
        if (typeof (store.get_status) !== 'undefined') {
            clearInterval(store.get_status);
        }
        store.get_status = setInterval(function () {
            store.load();
        }, 3000);
        // this.updateProgress();
    },
    onStoreRemove: function (store, record, operation) {
        var me = this;
        if (!store.data.length) {
            me.actions.start.setDisabled(true);
            me.actions.removeUploaded.setDisabled(true);
            me.actions.removeAll.setDisabled(true);
            me.actions.remove.setDisabled(true);
            me.uploader.total.reset();
            me.fireEvent('storeempty', me);
        }
        var id = record[0].get('id');
        Ext.each(me.success, function (v) {
            if (v && v.id == id)
                Ext.Array.remove(me.success, v);
        }, me);
        Ext.each(me.failed, function (v) {
            if (v && v.id == id)
                Ext.Array.remove(me.failed, v);
        }, me);
        // me.updateProgress();
    },
    onStoreUpdate: function (store, record, operation) {
        var data = record.data;
        var ctime = new Date().getTime();
        var speed_size = Math.floor(data.loaded / (ctime - data.stime)) * 1024;
        var rest_time = Math.floor((data.size - data.loaded) / speed_size);
        var t = new Date(1970, 0, 1);
        if (speed_size === 0)
            t.setSeconds(0);
        else
            t.setSeconds(rest_time);
        record.data = this.fileMsg(record.data);
        record.data.speed = filesize(speed_size) + "/sec.";
        record.data.rtime = t.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        // console.log(store.getData());
        // console.log(record.data.status);
        // store.getById(record.id)=record;
        // this.updateProgress();
    },
    fileMsg: function (file) {
        var me = this;
        if (file.status && file.server_error != 1) {
            switch (file.status) {
            case 1:
                file.msg = me.statusQueuedText;
                break;
            case 2:
                file.msg = Ext.String.format(me.statusUploadingText, file.percent);
                break;
            case 4:
                file.msg = file.msg || me.statusFailedText;
                break;
            case 5:
                file.msg = me.statusDoneText;
                break;
            }
        }
        return file;
    },
    /**
     * Plupload EVENTS
     */
    _Init: function (uploader, data) {
        this.runtime = data.runtime;
        this.owner.enable(true); // button aktiv schalten
        this.fireEvent('uploadready', this);
    },
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    _BeforeUpload: function (uploader, file) {
        console.log('file', file);
        var me = this;
        var fileInfo = [];
        var task_info = {};
        task_info.targetDir = file.targetDir;
        task_info.name = file.name;
        task_info.id = file.id;
        task_info.md5 = file.md5;
        task_info.size = file.size;
        // task_info.stime = new Date().getTime();
        // task_info.status = file.status;
        task_info.originPath = file.originPath;
        task_info.from_folder = file.from_folder;
        fileInfo.push(task_info);
        uploader.settings.multipart_params.op = "upload_file";
        uploader.settings.multipart_params.fileInfo = Ext.JSON.encode(fileInfo);
        Ext.Ajax.request({
            url: 'app/FileManager/backend/FileUpload.php',
            method: 'GET',
            async: false,
            params: {
                op: 'check_lock',
                fileMd5: file.md5,
                fileId: file.id,
                fileFromfolder: file.from_folder
            },
            success: function (response) {
                var res = Ext.decode(response.responseText);
                var data = res.data;
                if (data.is_lock === 1) {
                    uploader.stop();
                    file.status = 4;
                    file.msg = '<span style="color: red">File occupied.</span>';
                    uploader.refresh();
                    uploader.start();
                }
            },
            failure: function (response) {}
        });
        // }
    },
    _ChunkUploaded: function (uploader, file, status) {
        var response = Ext.JSON.decode(status.response);
        var me = this;
        if (response.success === false) {
            uploader.stop();
            me.failed.push(file);
            file.status = 4;
            file.msg = '<span style=\"color: red\">' + response.msg + '<\/span>';
            uploader.refresh();
            uploader.start();
        }
    },
    _FilesAdded: function (uploader, files) {
        console.log('_FilesAdded');
        /* Regist tasks */
        var me = this;
        var vm = Ext.ComponentQuery.query('#appwindow')[0].getViewModel();
        file_path = vm.get('curPath') + '/';
        if (me.uploaderConfig.multi_selection !== true) {
            if (me.store.data.length === 1)
            //if(uploader.files.length == 1)
                return false;
            files = [files[0]];
            uploader.files = [files[0]];
        }
        /* Control button behavior*/
        me.actions.removeUploaded.setDisabled(false);
        me.actions.removeAll.setDisabled(false);
        me.actions.remove.setDisabled(false);
        me.actions.start.setDisabled(uploader.state == 2);
        me.fireEvent('filesadded', me, files);
        me.regist_task(files, uploader);
    },
    _FilesRemoved: function (uploader, files) {
        Ext.each(files, function (file) {
            this.store.remove(this.store.getById(file.id));
        }, this);
    },
    _FileUploaded: function (uploader, file, status) {
        // var me = this,
        //     response = Ext.JSON.decode(status.response),
        //     fileInfo = [];
        // if (response.success === true) {
        //     file.server_error = 0;
        //     me.success.push(file);
        //     me.fireEvent('fileuploaded', me, file, response);
        // } else {
        //     if (response.msg) {
        //         file.msg = '<span style="color: red">' + response.msg + '</span>';
        //     }
        //     file.server_error = 1;
        //     me.failed.push(file);
        //     me.fireEvent('uploaderror', me, Ext.apply(status, {
        //         file: file
        //     }));
        // }
        // if (file.status === 5)
        //     file.msg = '<span style="color: green">Complete</span>';
        // if (file.status === 4)
        //     file.msg = '<span style="color: red">File occupied.</span>';
        // fileInfo.push(file);
        // fileInfo = Ext.JSON.encode(fileInfo);
        // Ext.Ajax.request({
        //     url: 'app/FileManager/backend/FileManager.php',
        //     method: 'post',
        //     params: {
        //         op: 'update_task',
        //         taskInfo: fileInfo
        //     },
        //     success: function (response) {
        //         // var res = Ext.decode(response.responseText);
        //         // var data = res.data;
        //         // Ext.each(data, function (obj) {
        //         //     me.store.data.each(function (record) {
        //         //         if (obj.id === record.get('id')) {
        //         //             record.data.isLock = obj.is_lock;
        //         //         }
        //         //     }, this);
        //         // });
        //     },
        //     failure: function (response) {}
        // });
        // this.updateStore(file);
    },
    _PostInit: function (uploader) {},
    _QueueChanged: function (uploader) {},
    _Refresh: function (uploader) {
        Ext.each(uploader.files, function (v) {
            // this.updateStore(v);
        }, this);
    },
    _StateChanged: function (uploader) {
        if (uploader.state == 2) {
            this.fireEvent('uploadstarted', this);
            this.actions.cancel.setDisabled(false);
            this.actions.start.setDisabled(true);
        } else {
            this.fireEvent('uploadcomplete', this, this.success, this.failed);
            if (this.autoRemoveUploaded)
                this.removeUploaded();
            this.actions.cancel.setDisabled(true);
            this.actions.start.setDisabled(this.store.data.length === 0);
        }
    },
    _UploadFile: function (uploader, file) {
        // if (file.size <= 1048576)
        //     uploader.settings.chunk_size = 1048576;
        // else if (1048576 < file.size && file.size <= 1048576 * 16)
        //     uploader.settings.chunk_size = file.size;
        // else {
        //     uploader.settings.chunk_size = 1048576 * 16;
        // }
    },
    _UploadProgress: function (uploader, file) {
        var me = this,
            name = file.name,
            size = file.size,
            percent = file.percent;
        me.fireEvent('uploadprogress', me, file, name, size, percent);
        if (file.server_error)
            file.status = 4;
        // me.updateStore(file);
    },
    _Error: function (uploader, data) {
        if (data.file) {
            data.file.status = 4;
            if (data.code == -600) {
                data.file.msg = Ext.String.format('<span style="color: red">{0}</span>', this.statusInvalidSizeText);
            } else if (data.code == -700) {
                data.file.msg = Ext.String.format('<span style="color: red">{0}</span>', this.statusInvalidExtensionText);
            } else {
                data.file.msg = Ext.String.format('<span style="color: red">{2} ({0}: {1})</span>', data.code, data.details,
                    data.message);
            }
            this.failed.push(data.file);
            // this.updateStore(data.file);
        }
        this.fireEvent('uploaderror', this, data);
    },
    _CreateFolder: function (uploader, folders) {
        var folderArr = [];
        var vm = Ext.ComponentQuery.query('#appwindow')[0].getViewModel();
        var curPath = vm.get('curPath');
        for (var i = 0, len = folders.length; i < len; i++) {
            folderArr.push(curPath + folders[i].fullPath);
        }
        folderArr = Ext.JSON.encode(folderArr);
        Ext.Ajax.request({
            url: 'app/FileManager/backend/FileUpload.php',
            method: 'POST',
            async: false,
            params: {
                op: 'create_folder',
                folderPath: folderArr
            },
            success: function (response) {},
            failure: function (response) {}
        });
    }
});
