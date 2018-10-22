Ext.define('DESKTOP.Folder.default.controller.ShareFolderSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sharefoldersettings',
    listen: {
        controller: {
            '*': {
                showFolderSettings: 'onShowFolderSettings'
            }
        }
    },

    init: function() {
        var oldSettings = null;
        console.log('sharefoldersettings is initiated');
    },

    // record old settings
    onShowFolderSettings: function(args) {
        this.oldSettings = args;
    },
/*
    onVolumeLoadComplete: function(args) {
        console.log('inVolume');
        console.log(args);

        if (this.lookupReference('titleLable').text === 'Create Folder') {
            console.log('is Create Folder!!');
            this.lookupReference('volumeCombo').setValue(args.firstRecord);
        }
    },
*/
    onVolumeComboSelect: function(combobox, record) {
        console.log(record);
        this.lookupReference('pool').setValue(record.data.pool_name);
        this.lookupReference('volDescrip').setText('This folder will share the size of '+ record.data.vol_name +' unless enable Folder size (Quota) on it.');
        this.lookupReference('totalVol').setText('Volume size: ' + record.data.total_gb + ' GB');
        this.lookupReference('usedVol').setText('Used: ' + record.data.used_gb + ' GB');
        this.lookupReference('availVol').setText('Available: ' + record.data.avail_gb + ' GB');
    },

    onEnableFolderSize: function(checkbox, newValue) {
        var sizeField  = this.lookupReference('sizeField'),
            sizeSlider = this.lookupReference('sizeSlider'),
            sizeContainer = this.lookupReference('sizeContainer');

        if (newValue) {
            sizeField.enable();
            sizeSlider.enable();
            sizeContainer.enable();
        } else {
            sizeField.disable();
            sizeSlider.disable();
            sizeContainer.disable();
        }
    },

    onEnableCompression: function(checkbox, newValue) {
        var compressCombobox = this.lookupReference('compression');
        if (newValue)   compressCombobox.enable();
        else            compressCombobox.disable();
    },

    onCancel: function(button) {
        button.up('window').close();
    },

    onConfirm: function(button) {
        var settingsForm = this.lookupReference('settingsForm'),
            settingsWindow = this.getView(),
            folderName = this.lookupReference('folderName').getValue(),
            me = this;

        console.log('ShareFolderSettingsController submit');
        console.log(settingsForm.getValues());

        if (settingsForm.isValid()) {
            if (this.lookupReference('titleLable').text === 'Create Folder') {
            /*
                settingsForm.submit({
                    type  : 'ajax',
                    method: 'post',
                    url   : 'app/Folder/backend/default/ShareFolder.php',
                    waitMsg: 'Creating...',
                    params: {
                        op: 'create_folder'
                    },
                    success: function (form) {
                        console.log('create folder success!');
                        // reload share folder page and select the newly created folder
                        me.fireEvent('folderCreated', {'folder_name': folderName});
                        button.up('window').close();
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert('Error', action.result.msg);
                    }
                });
            */
                settingsWindow.getEl().mask('Applying change...', 'x-mask-loading');
                Ext.Ajax.request({
                    type  : 'ajax',
                    method: 'post',
                    url   : 'app/Folder/backend/default/ShareFolder.php',
                    params: {
                        op: 'create_folder',
                        settings: Ext.JSON.encode(settingsForm.getValues())
                    },
                    success: function (response, opts) {
                        console.log('create folder success!');
                        me.fireEvent('folderCreated', {'folder_name': folderName});
                        settingsWindow.getEl().unmask();
                        button.up('window').close();
                    },
                    failure: function (response, opts) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert('Error', responseText.msg);
                        settingsWindow.getEl().unmask();
                    }
                });
            } else {
                var changedSettings = this.getChangedSettingsForm();

                if (changedSettings === false)
                    Ext.Msg.alert('Alert', 'Nothing has changed.', function() {
                        settingsWindow.getEl().unmask();
                        button.up('window').close();
                    });

                settingsWindow.getEl().mask('Applying change...', 'x-mask-loading');
                Ext.Ajax.request({
                    type  : 'ajax',
                    method: 'post',
                    url   : 'app/Folder/backend/default/ShareFolder.php',
                    params: {
                        op: 'edit_folder',
                        settings: Ext.JSON.encode(changedSettings)
                    },
                    success: function (response, opts) {
                        console.log('edit folder success!');
                        settingsWindow.getEl().unmask();
                        button.up('window').close();
                    },
                    failure: function (response, opts) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert('Error', responseText.msg);
                        settingsWindow.getEl().unmask();
                    }
                });
            }
        }
    },

    getChangedSettingsForm: function() {
        var oldSettings = this.oldSettings,
            newSettings = this.lookupReference('settingsForm').getValues(),
            dirty = false,
            ret = {};

        ret.pool = oldSettings.pool;
        ret.volume = oldSettings.volume;
        ret.folder = oldSettings.folder;
        ret.old_folder_name = oldSettings.folder_name;

        ret.folder_name = (oldSettings.folder_name === newSettings.folder_name)
                    ? oldSettings.folder_name : newSettings.folder_name;

        // if (oldSettings.description != newSettings.description)
        //     ret.description = newSettings.description;

        ret.recycle_bin = (oldSettings.recycle_bin === newSettings.recycle_bin)
                    ? oldSettings.recycle_bin : newSettings.recycle_bin;

        ret.hide_net_drive = (oldSettings.hide_net_drive === newSettings.hide_net_drive)
                    ? oldSettings.hide_net_drive : newSettings.hide_net_drive;

        // changed from reserved to thin
        ret.folder_size = oldSettings.folder_size;
        if (!newSettings.folder_size_box) {
            ret.folder_size = 0;
        } else if (oldSettings.folder_size !== newSettings.folder_size) {
            ret.folder_size = newSettings.folder_size;
        }

        ret.compression = oldSettings.compression;
        if (!newSettings.compression_box) {
            ret.compression = false;
        } else if (oldSettings.compression !== newSettings.compression) {
            ret.compression = newSettings.compression;
        }

        var changed = [];
        for (var item in oldSettings) {
            if (ret[item] !== oldSettings[item]) {
                changed.push(item);
                dirty = true;
            }
        }

        console.log('get dirty values');
        console.log(this.lookupReference('settingsForm').getValues(false, true));

        console.log('GET CHANGED DATA');
        console.log(newSettings);
        console.log(oldSettings);
        console.log(ret);

        if (dirty) {
            ret.changed = changed;
            return ret;
        }

        return false;
    }
});
