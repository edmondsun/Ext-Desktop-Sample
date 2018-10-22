Ext.define('DESKTOP.Folder.default.controller.CreateShareFolderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.createshare',

    listen: {
        store: {
            '#volumeAll': {
                volumeLoadComplete: 'onVolumeLoadComplete'
            }
        }
    },

    onVolumeLoadComplete: function(args) {
        console.log("inVolume");
        console.log(args);

        if (this.lookupReference('titleLable').text == 'Create Folder') {
            var volumeCombo = this.lookupReference('volumeCombo');
            volumeCombo.select(args['firstRecord']);
        }
    },

    onEnableFolderSize: function(checkbox, newValue, oldValue) {
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

    onEnableCompression: function(checkbox, newValue, oldValue) {
        var compressCombo = this.lookupReference('compression');
        newValue ? compressCombo.enable() : compressCombo.disable();
    },

    onCancel: function(button) {
        button.up('window').close();
    },

    onConfirm: function(button, event) {
        var settingForm = this.lookupReference('settingForm'),
            folder_name = this.lookupReference('folder_name'),
            me = this;
        
        console.log(settingForm);

        if (settingForm.isValid()) {
            settingForm.submit({
                type: 'ajax',
                method: 'post',
                url: 'app/Folder/backend/default/ShareFolder.php',
                params: {
                    op: 'create_folder'
                },
                success: function (form) {
                    console.log('create folder success!');
                    var obj = {
                        'folder_name': folder_name
                    };

                    me.fireEvent('folderCreated', obj);
                    button.up('window').close();
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Error', action.result.msg);
                    button.up('window').close(); // should reset to defaults
                }
            });
        }
    }
});
