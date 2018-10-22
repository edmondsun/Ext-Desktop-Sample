Ext.define('DESKTOP.Folder.default.view.CustomWindow', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    itemId: 'CustomWindow',
    requires: [
        'DESKTOP.Folder.default.controller.CustomWindowController'
    ],
    controller: 'customwindow',
    title: 'Custom Permissions',
    titleAlign: 'center',
    closable: false,
    closeAction: 'destroy',
    width: 500,
    //height: 480,
    modal: true,
    resizable: false,
    items: [
    {
        xtype: 'form',
        reference: 'customForm',
        items: [
        {
            xtype: 'displayfield',
            qDefault: true,
            fieldLabel: 'User/Group',
            name: 'userName',
            reference: 'userName',
            submitValue: true
        }, {
            xtype: 'displayfield',
            qDefault: true,
            name: 'domainType',
            reference: 'domainType',
            hidden: true,
            submitValue: true
        }, {
            xtype: 'displayfield',
            qDefault: true,
            name: 'acctRowIndex',
            reference: 'acctRowIndex',
            hidden: true,
            submitValue: true
        }, {
            xtype: 'container',
            qDefault: true,
            layout: 'hbox',
            items: [
            {
                xtype: 'combobox',
                qDefault: true,
                fieldLabel: 'Schema',
                name: 'schema',
                reference: 'schema',
                editable: false,
                forceSelection: true,
                queryMode: 'local',
                displayField: 'schemaName',
                valueField: 'schemaNumber',
                listeners: {
                    change: 'onSchemaChange'
                    //select: 'onSchemaSelect'
                }
            },
        /*
            {
                xtype: 'button',
                text: 'Reset',
                listeners: {
                    //click: 'onRestoreSchema'
                }
            },
        */
            {
                xtype: 'button',
                qDefault: true,
                text: 'Delete',
                listeners: {
                    click: 'onDeleteSchema'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                reference: 'addButton',
                text: 'Add',
                listeners: {
                    click: 'onAddSchema'
                }
            }]
        }, {
            xtype: 'displayfield',
            qDefault: true,
            name: 'inherited',
            fieldLabel: 'Inherit from'
        }, {
            xtype: 'combobox',
            qDefault: true,
            fieldLabel: 'Type',
            name: 'list_type',
            reference: 'listType',
            editable: false,
            forceSelection: true,
            queryMode: 'local',
            displayField: 'listType',
            valueField: 'value',
            store: Ext.create('Ext.data.Store', {
                fields: ['listType', 'value'],
                data: [
                {   listType: 'Allow',
                    value: 0
                },{
                    listType: 'Denied',
                    value: 1
                }]
            })
        }, {
            xtype: 'combobox',
            qDefault: true,
            name: 'flag',
            reference: 'applyTo',
            fieldLabel: 'Apply to',
            editable: false,
            forceSelection: true,
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            store: Ext.create('Ext.data.Store', {
                autoLoad: false,
                fields: ['text', 'value'],
                data: [
                {   text: 'Files only',
                    value: 1
                },{
                    text: 'Subfolders only',
                    value: 2
                },{
                    text: 'Subfolders and files only',
                    value: 3
                },{
                    text: 'This folder only',
                    value: 4
                },{
                    text: 'This folder and files',
                    value: 5
                },{
                    text: 'This folder and subfolders',
                    value: 6
                },{
                    text: 'This folder subfolders and files',
                    value: 7
                }]
            }),
            listeners: {
                select: 'onApplyToSelect'
            }
        }, {
            xtype: 'checkbox',
            qDefault: true,
            name: 'no_propagate',
            reference: 'noPropagate',
            boxLabel: 'Apply the permissions only on the objects and(or) the containers of this folder.',
            inputValue: true,
            uncheckedValue: false
        }, {
            xtype: 'checkboxgroup',
            qDefault: true,
            reference: 'group-all',
            vertical: true,
            columns: 3,
            items: [
            {
                xtype: 'checkbox',
                qDefault: true,
                boxLabel: 'Read',
                reference: 'check-read',
                name: 'check-read',
                listeners: {
                    change: 'onCheckGeneralPerm'
                }
            },{
                xtype: 'checkboxgroup',
                qDefault: true,
                name: 'group-read',
                reference: 'group-read',
                columns: 1,
                defaults: {
                    name: 'perm'
                },
                items:[
                {
                    boxLabel: 'Traverse folders/Execute files',
                    // reference: 'check-3',
                    inputValue: 4
                }, {
                    boxLabel: 'List folders/Read data',
                    // reference: 'check-4',
                    inputValue: 5
                }, {
                    boxLabel: 'Read attributes',
                    // reference: 'check-5',
                    inputValue: 6
                }, {
                    boxLabel: 'Read extended attributes',
                    // reference: 'check-6',
                    inputValue: 7
                }, {
                    boxLabel: 'Read permissions',
                    // reference: 'check-7',
                    inputValue: 8
                }],
                listeners: {
                    change: 'onCheckGroupChange'
                }
            }, {
                xtype: 'checkbox',
                qDefault: true,
                boxLabel: 'Write',
                reference: 'check-write',
                name: 'check-write',
                listeners: {
                    change: 'onCheckGeneralPerm'
                }
            },{
                xtype: 'checkboxgroup',
                qDefault: true,
                name: 'group-write',
                reference: 'group-write',
                columns: 1,
                defaults: {
                    name: 'perm'
                },
                items:[
                {
                    boxLabel: 'Create files/Write data',
                    // reference: 'check-8',
                    inputValue: 9
                }, {
                    boxLabel: 'Create folders/Append data',
                    // reference: 'check-9',
                    inputValue: 10
                }, {
                    boxLabel: 'Write attributes',
                    // reference: 'check-10',
                    inputValue: 11
                }, {
                    boxLabel: 'Write extended attributes',
                    // reference: 'check-11',
                    inputValue: 12
                }, {
                    boxLabel: 'Delete subfolders and files',
                    // reference: 'check-12',
                    inputValue: 13
                }, {
                    boxLabel: 'Delete',
                    // reference: 'check-13',
                    inputValue: 14
                }],
                listeners: {
                    change: 'onCheckGroupChange'
                }
            }, {
                xtype: 'checkbox',
                qDefault: true,
                boxLabel: 'Administration',
                reference: 'check-admin',
                name: 'check-admin',
                listeners: {
                    change: 'onCheckGeneralPerm'
                }
            },{
                xtype: 'checkboxgroup',
                qDefault: true,
                name: 'group-admin',
                reference: 'group-admin',
                columns: 1,
                defaults: {
                    name: 'perm'
                },
                items:[
                {
                    boxLabel: 'Change permissions',
                    // reference: 'check-1',
                    inputValue: 2
                }, {
                    boxLabel: 'Take ownership',
                    // reference: 'check-2',
                    inputValue: 3
                }],
                listeners: {
                    change: 'onCheckGroupChange'
                }
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        listeners: {
            click: 'onCancel'
        }
    }, {
        text: 'OK',
        qDefault: true,
        buttonType: 'primary',
        listeners: {
            click: 'onOK'
        }
    }]
});
