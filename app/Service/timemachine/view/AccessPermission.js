Ext.define('DESKTOP.Service.timemachine.view.AccessPermission', {
    extend: 'Ext.form.Panel',
    alias: 'widget.accesspermission',
    requires: [
        'DESKTOP.Service.timemachine.controller.AccessPermissionController',
        'DESKTOP.Service.timemachine.model.AccessPermissionModel'
    ],
    controller: 'accesspermission',
    viewModel: {
        type: 'accesspermission'
    },
    itemId: 'AccessPermission',
    title: "Access Permission",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    bodyPadding: 20,
    fieldDefaults: {
        labelWidth: 180,
        msgTarget: 'side'
    },
    items: [{
        xtype: 'form',
        items: [{
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 100,
                    name: 'credential_type',
                    itemId: 'time_machine_access_type',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', 'type_str'],
                        data: [{
                            "type": 'user',
                            "type_str": 'Local'
                        },{
                        	"type": 'domain_user',
                            "type_str": 'Domain'
                        }]
                    }),
                    valueField: 'type',
                    displayField: 'type_str',
                    queryMode: 'local',
                    submitValue:false,
                    listeners: {
                        select: 'onAccountTypeSelect',
                        render: function (combo) {
                            combo.select('user');
                        }
                    }
                },'->',{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'access_search',
                    emptyText: 'Search user name',
                    enableKeyEvents: true,
                    submitValue:false,
                    listeners: {
                        keyup: 'onSearch'
                    }
                }]
            }]    
        },{
            xtype: 'gridpanel',
            qDefault: true,
            height: 330,
            width: '100%',
            itemId: 'permGrid',
            reference: 'permGrid',
            enableLocking: false,
            border: false,
            bodyBorder: false,
            overflowY: 'scroll',
            enableColumnMove: false,
            viewConfig: {
                loadMask: false,
                emptyText: 'No record',
                disableSelection: false,
                markDirty: false
            },
            bind: {
                store: '{permAll}'
            },
            defaults: {
                sortable: true,
                menuDisabled: true,
                hideable: false
            },
            columns: [{
                text: 'User name',
                dataIndex: 'name',
                menuDisabled: true,
                hideable: false,
                flex: 1
            },{
                text: 'Access permission',
                xtype: 'checkcolumn',
                dataIndex: 'access',
                menuDisabled: true,
                hideable: false,
                flex: 1,
               	listeners: {
                    beforecheckchange: 'onBeforePermChange'
                }
            }]
        }]
    }]
});
