Ext.define('DESKTOP.Folder.default.controller.CustomWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.customwindow',
    // listen: {
    //     controller: {
    //         '*': {
    //             //setCustomSettings: 'onSetCustomSettings',
    //             //getCustomSettings: 'onGetCustomSettings'
    //             sendCurrentFolderInfo: 'onReceiveCurrentFolderInfo'
    //         }
    //     }
    // },

    init: function() {
        console.log('controller is inited');
        this.permTypeArr = {
            'read' : 5,
            'write': 6,
            'admin': 2
        };
    },

    onAddSchema: function() {
        var customPerms = this.getStore('customPerms'),
            //customForm  = this.lookupReference('customForm'),
            schema      = this.lookupReference('schema'),
            schemaStore = schema.getStore(),
            newIndex    = schemaStore.getCount();

        console.log('Add new schema');
        customPerms.add({
            'list_type': 0,
            'flag': 4,
            'mask': 0,
            'no_propagate': false,
            'inherited': false
        });

        schemaStore.add({
            schemaName: 'Schema ' + (newIndex+1),
            schemaNumber: newIndex
        });

        schema.select(newIndex);
    },

    onDeleteSchema: function() {
        var schema = this.lookupReference('schema'),
            selection = schema.getSelection();

        console.log('delete schema is called');
        if (selection.get('schemaName').indexOf('X') < 0) {
            var schemaStore = schema.getStore(),
                customForm  = this.lookupReference('customForm'),
                customPerms = this.getStore('customPerms'),
                currentPerm   = customPerms.getAt(selection.get('schemaNumber')),
                currentSchema = schemaStore.getAt(selection.get('schemaNumber'));

            currentSchema.set('schemaName', selection.get('schemaName') + ' X');
            currentPerm.set({
                //'mask': 0,
                'deletion': true
            });
            customForm.loadRecord(currentPerm);
        }
    },

    // onRestoreSchema: function(button) {
    //     var schema = this.lookupReference('schema'),
    //         selection = schema.getSelection();

    //     if (selection.get('schemaName').indexOf('X') >= 0)
    //         currentSchema.set('schemaName', 'Schema ' + (selection.get('schemaNumber') + 1));
    // },

    // whenever schema is changed, store users modification
    onSchemaChange: function(combobox, newValue, oldValue) {
        var customForm  = this.lookupReference('customForm'),
            //noPropagate = this.lookupReference('noPropagate'),
            newPerm = this.getStore('customPerms').getAt(newValue);

        console.log('on schema change is called');
        console.log(oldValue);
        console.log(newPerm);
        if (oldValue !== null)
            this.storeCurrentForm(oldValue);

        customForm.loadRecord(newPerm);
        this.setNoPropagate(newPerm.get('flag'));
    },

    onApplyToSelect: function(combobox, record) {
        console.log('APPLY TO SELECT');
        this.setNoPropagate(record.data.value);
    },

    onCheckGeneralPerm: function(checkbox, newValue, oldValue) {
        console.log('general is called!');
        console.log(newValue);
        var checkBoxName = checkbox.getName(),
            permTypeArr  = this.permTypeArr;

        for (var permTypeName in permTypeArr) {
            if (checkBoxName.indexOf(permTypeName) >= 0)
            {
                var groupBox = this.lookupReference('group-' + permTypeName);
                groupBox.setValue({
                    'perm': newValue
                });
            }
        }
    },

    onCheckGroupChange: function(checkboxgroup, newValue, oldValue) {
        var groupBoxName = checkboxgroup.getName(),
            permTypeArr  = this.permTypeArr,
            no_checked   = (typeof newValue.perm === 'undefined');

        for (var permTypeName in permTypeArr) {
            if (groupBoxName.indexOf(permTypeName) >= 0 && !no_checked)
            {
                var generalBox = this.lookupReference('check-' + permTypeName);
                // console.log('newValue / oldValue');
                // console.log(newValue);
                // console.log(oldValue);
                if (newValue.perm.length === permTypeArr[permTypeName]) {
                    generalBox.setValue(true);
                    //console.log('call true done');
                    break;
                }
                //console.log('pass');
                if (typeof oldValue.perm !== 'undefined' &&
                    oldValue.perm.length === permTypeArr[permTypeName])
                {
                    generalBox.setValue(false);
                    checkboxgroup.setValue(newValue);
                    //console.log('call false done');
                }
            }
        }
    },

    setNoPropagate: function(flagVal) {
        console.log('Custom: set no propagate');
        console.log(flagVal);
        var noPropagate = this.lookupReference('noPropagate');
        if (flagVal === 4){
            noPropagate.setValue(false);
            noPropagate.disable();
        } else {
            var selection = this.lookupReference('schema').getSelection(),
                currentPerm = this.getStore('customPerms').getAt(selection.get('schemaNumber'));

            noPropagate.enable();
            noPropagate.setValue(currentPerm.get('no_propagate'));
        }
    },

    storeCurrentForm: function(schemaNumber) {
        var customFormValues = this.lookupReference('customForm').getValues(),
            customPerms = this.getStore('customPerms'),
            currentPerm = customPerms.getAt(customFormValues.schema),
            newMask = 0;
        console.log('Custom: store current form');
        console.log(customFormValues);
        // if shcemaNumber is set, use that!
        if (schemaNumber >= 0)
            currentPerm = customPerms.getAt(schemaNumber);

        switch (typeof customFormValues.perm) {
            case 'number':
                newMask = 1 << (customFormValues.perm-2);
                break;
            case 'object':
                for (var idx in customFormValues.perm)
                    newMask |= 1 << (customFormValues.perm[idx]-2);
                break;
            default:
                newMask = 0;
                break;
        }

        currentPerm.set({
            'no_propagate': customFormValues.no_propagate,
            'list_type'   : customFormValues.list_type,
            'flag'        : customFormValues.flag,
            'mask'        : newMask
        });
    },

    onCancel: function(button) {
        button.up('window').close();
    },

    onOK: function() {
        this.storeCurrentForm(-1);
        console.log('Custom: on OK');
        var obj = {
            'rowIndex': this.lookupReference('acctRowIndex').getValue(),
            'newPerm' : this.getStore('customPerms').getUpdatingData()
        };
        console.log(obj);
        this.fireEvent('customPermUpdated', obj);
        this.getView().close();
    }
});
