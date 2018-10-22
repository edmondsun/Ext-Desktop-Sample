Ext.define('DESKTOP.StorageManagement.iscsi.view.GeneralTarget', {
    extend: 'Ext.form.Panel',
    alias: 'widget.targetview',
    requires: [
        'DESKTOP.StorageManagement.iscsi.model.GeneralTargetModel',
        'DESKTOP.StorageManagement.iscsi.controller.GeneralTargetController'
    ],
    controller: 'targetsetting',
    viewModel: {
        type: 'targetsetting'
    },
    itemId: 'generateTargetView',
    hidden: true,
    items: [{
        itemId: 'target',
        xtype: 'form',
        bodyPadding: '5 10 10 10',
        fieldDefaults: {
            labelWidth: 100,
            msgTarget: 'qtip'
        },        
        items: [{
            xtype: 'textfield',
            itemId: 'target_name',
            fieldLabel: 'Target Name',
            valueField: '',
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /^[a-zA-Z0-9-_.]+$/,
            regexText: 'Name contains characters which are not allowed.'
        }, {
            xtype: 'displayfield',
            itemId: 'target_iqn',
            name: 'entity_name',
            fieldLabel: 'IQN'
        }, {
            reference: 'CHAP_ENABLE',
            xtype: 'checkboxfield',
            itemId: 'target_enable_chap',
            boxLabel: 'Enable CHAP',
            listeners: {
                change: 'chap_mode'
            }
        }, {
            xtype: 'container',
            style: {
                marginLeft: '20px'
            },
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    indx: 0,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user1',
                    fieldLabel: 'User1:',
                    reference: 'volumeCombo',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'str',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'str'],
                        data: [{
                            'value': 'local',
                            'str': 'Local'
                        },{
                            'value': 'domain',
                            'str': 'Domain'
                        }]
                    }),
                    listeners: {
                        select: 'onAccountTypeSelect',
                        render: function (combo) {
                            combo.select('local');
                        }
                    },
		            width: 200
                }, {
                    indx: 0,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user1_list',
                    editable: false,
                    name: 'name',
                    valueField: 'name',
                    displayField: 'name',
                    width: 180,
                    style: {
                        marginLeft: '5px'
                    },
                    listeners: {
                        select: 'onAccountFilter'
                    }
                }]
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    indx: 1,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user2',
                    fieldLabel: 'User2:',
                    reference: 'volumeCombo',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'str',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'str'],
                        data: [{
                            'value': 'local',
                            'str': 'Local'
                        },{
                            'value': 'domain',
                            'str': 'Domain'
                        }]
                    }),
                    listeners: {
                        select: 'onAccountTypeSelect',
                        render: function (combo) {
                            combo.select('local');
                        }
                    },
                    width: 200
                }, {
                    indx: 1,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user2_list',
                    editable: false,
                    name: 'name',
                    valueField: 'name',
                    displayField: 'name',
                    width: 180,
                    style: {
                        marginLeft: '5px'
                    },
                    listeners: {
                        select: 'onAccountFilter'
                    }
                }]
            }, {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    indx: 2,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user3',
                    fieldLabel: 'User3:',
                    reference: 'volumeCombo',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'str',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'str'],
                        data: [{
                            'value': 'local',
                            'str': 'Local'
                        },{
                            'value': 'domain',
                            'str': 'Domain'
                        }]
                    }),
                    listeners: {
                        select: 'onAccountTypeSelect',
                        render: function (combo) {
                            combo.select('local');
                        }
                    },
                    width: 200
                }, {
                    indx: 2,
                    editable: false,
                    xtype: 'combobox',
                    itemId: 'target_enable_chap_user3_list',
                    editable: false,
                    name: 'name',
                    valueField: 'name',
                    displayField: 'name',
                    width: 180,
                    style: {
                        marginLeft: '5px'
                    },
                    listeners: {
                        select: 'onAccountFilter'
                    }
                }]
            }]
        }, {
            xtype: 'checkboxfield',
            itemId: 'target_mutual_chap',
            boxLabel: 'Mutual CHAP',
            name: 'mutual_chap',
            listeners: {
                change: 'mutual_mode'
            }
        }, {
            xtype: 'container',
            style: {
                marginLeft: '20px',
                marginRight: '10px'
            },
            items: [{
                xtype: 'textfield',
                itemId: 'mutual_user',
                fieldLabel: 'User name',
                valueField: ''
                // allowBlank: false,
                // msgTarget: 'qtip',
                // maskRe: /^[a-zA-Z0-9-_.]+$/
            },{
                xtype: 'textfield',
                itemId: 'mutual_passwd',
                fieldLabel: 'Password',
                valueField: '',
                inputType: 'password'
            }]
        }]
    }, {
        hidden: true,
        reference: 'select_target_btn',
        buttons: ['->', {
            itemId: 'btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_confirm',
            text: 'Confirm'
        }]
    }, {
        hidden: true,
        reference: 'select_winzard_target_btn',
        buttons: [{
            itemId: 'btn_winzard_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_winzard_back',
            text: 'Back'
        }, {
            itemId: 'btn_winzard_confirm',
            text: 'Confirm'
        }]
    }]
});
