Ext.define('DESKTOP.SystemSetup.notification.view.Mail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mail',
    requires: [
        'DESKTOP.SystemSetup.notification.controller.MailController',
        'DESKTOP.SystemSetup.notification.model.MailModel'
    ],
    controller: 'mail',
    viewModel: {
        type: 'mail'
    },
    itemId: 'Mail',
    title: "Mail",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Mail-from address',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'mailtype',
                xtype: 'combobox',
                qDefault: true,
                bind: {
                    store: '{emailinfo}'
                },
                queryMode: 'remote',
                name: 'mail_type',
                fieldLabel: 'Select e-mail account:',
                valueField: 'provider',
                displayField: 'provider',
                fields: ["provider"],
                editable: false,
                listeners: {
                    change: function (combobox) {
                        var mailtype = combobox.getValue();
                        var form = combobox.up('form');
                        if (mailtype != "custom") {
                            form.down('#smp_server').disable();
                            form.down('#smp_server').hide();
                            form.down('#account').disable();
                            form.down('#account').hide();
                            form.down('#auth_method').disable();
                            form.down('#auth_method').hide();
                            form.down('#password').enable();
                        } else {
                            form.down('#smp_server').enable();
                            form.down('#smp_server').show();
                            if (form.down("#auth_method_combo").getValue() == 0) {
                                form.down('#account').disable();
                                form.down('#password').disable();
                            } else {
                                form.down('#account').enable();
                                form.down('#password').enable();
                            }
                            form.down('#account').show();
                            form.down('#auth_method').enable();
                            form.down('#auth_method').show();
                        }
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'smp_server',
            items: [{
                xtype: 'textfield',
                qDefault: true,
                fieldLabel: 'SMTP server',
                name: 'smtp_server',
                allowBlank: false
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'auth_method',
            items: [{
                xtype: 'combobox',
                itemId: 'auth_method_combo',
                qDefault: true,
                fieldLabel: 'Authentication',
                name: 'auth_method',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['Auth_value'],
                    data: [{
                        "Auth_value": 0,
                        "Auth_str": "Disable"
                    }, {
                        "Auth_value": 1,
                        "Auth_str": "Enable"
                    }, {
                        "Auth_value": 2,
                        "Auth_str": "Enable with SSL"
                    }, {
                        "Auth_value": 3,
                        "Auth_str": "Enable with TLS"
                    }]
                }),
                valueField: 'Auth_value',
                displayField: 'Auth_str',
                queryMode: 'local',
                listeners: [{
                    change: function (combo, newval, oldval) {
                        var form = combo.up().up();
                        var mailtype = form.down("#mailtype");
                        if (newval === 0 && mailtype.getValue() == "custom") {
                            form.down("#account").setDisabled(true);
                            form.down("#password").setDisabled(true);
                        } else {
                            form.down("#account").setDisabled(false);
                            form.down("#password").setDisabled(false);
                        }
                    }
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                qDefault: true,
                fieldLabel: 'E-mail address:',
                itemId: 'email',
                name: 'mail_from',
                vtype: 'email',
                allowBlank: false
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'account',
            items: [{
                xtype: 'textfield',
                qDefault: true,
                fieldLabel: 'Account:',
                name: 'account',
                allowBlank: false
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                qDefault: true,
                itemId: 'password',
                fieldLabel: 'Password:',
                name: 'password',
                inputType: 'password',
                allowBlank: false
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'button',
                qDefault: true,
                text: 'Send test mail',
                listeners: {
                    click: 'Send_test_mail'
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Mail-to address',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'button',
                qDefault: true,
                text: 'Add Mail-to address',
                itemId: 'addmail',
                listeners: {
                    click: 'onCreate'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Delete Mail address',
                itemId: 'deletemail',
                disabled: true,
                listeners: {
                    click: 'onDelete'
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                bind: '{mailtoaddr}',
                itemId: 'mailgrid',
                forceFit: true,
                viewConfig: {
                    markDirty: false
                },
                listeners: {
                    select: function (grid) {
                        var mail_to = this.getSelectionModel().getSelection()[0].get('mail_to');
                        if (mail_to !== '') {
                            this.up('form').down('#deletemail').enable();
                        } else {
                            this.up('form').down('#deletemail').disable();
                        }
                    }
                },
                columns: [{
                    text: 'Mail-to address',
                    dataIndex: 'mail_to',
                    sortable: false,
                    hideable: false,
                    menuDisabled: 'true'
                }, {
                    xtype: 'checkcolumn',
                    text: 'Alerts',
                    dataIndex: 'info',
                    sortable: false,
                    menuDisabled: 'true',
                    renderer: function (val, m, rec) {
                        if (rec.get('mail_to') === '')
                            return '';
                        else
                            return (new Ext.ux.CheckColumn()).renderer(val);
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: 'Warning',
                    dataIndex: 'warning',
                    sortable: false,
                    menuDisabled: 'true',
                    renderer: function (val, m, rec) {
                        if (rec.get('mail_to') === '')
                            return '';
                        else
                            return (new Ext.ux.CheckColumn()).renderer(val);
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: 'Error',
                    dataIndex: 'error',
                    sortable: false,
                    menuDisabled: 'true',
                    renderer: function (val, m, rec) {
                        if (rec.get('mail_to') === '')
                            return '';
                        else
                            return (new Ext.ux.CheckColumn()).renderer(val);
                    }
                }, {
                    xtype: 'checkcolumn',
                    text: 'Backup events',
                    dataIndex: 'backup_event',
                    sortable: false,
                    menuDisabled: 'true',
                    renderer: function (val, m, rec) {
                        if (rec.get('mail_to') === '')
                            return '';
                        else
                            return (new Ext.ux.CheckColumn()).renderer(val);
                    }
                }]
            }]
        }]
    }]
});
/**
 * Ext.ux.IconCombo Extension Class for Ext 4.x Library
 *
 * @author  Daniel Kuhnley
 * @class Ext.ux.IconCombo
 * @extends Ext.form.field.ComboBox
 */
// Ext.define('Ext.ux.IconCombo', {
//     extend : 'Ext.form.field.ComboBox',
//     alias : 'widget.iconcombo',
//     initComponent : function () {
//         Ext.apply(this, {
//             listConfig : {
//                 iconClsField : this.iconClsField,
//                 getInnerTpl : function () {
//                     return '<tpl for=".">'
//                      + '<div class="x-combo-list-item ux-icon-combo-item '
//                      + '{' + this.iconClsField + '}">'
//                      + '{' + this.displayField + '}'
//                      + '</div></tpl>';
//                 },
//                 scope : this
//             },
//             scope : this
//         });
//         // call parent initComponent
//         this.callParent(arguments);
//     }, // end of function initComponent
//     onRender : function (ct, position) {
//         // call parent onRender
//         this.callParent(arguments);
//         // adjust styles
//         this.bodyEl.applyStyles({
//             position : 'relative'
//         });
//         this.el.down('input.x-form-field').addCls('ux-icon-combo-input');
//         // add div for icon
//         this.icon = Ext.core.DomHelper.append(this.el.down('div.x-form-item-body'), {
//                 tag : 'div',
//                 style : 'position:absolute'
//             });
//     }, // end of function onRender
//     setIconCls : function () {
//         if (this.rendered) {
//             var rec = this.store.findRecord(this.valueField, this.getValue());
//             if (rec)
//                 this.icon.className = 'ux-icon-combo-icon ' + rec.get(this.iconClsField);
//         } else {
//             this.on('render', this.setIconCls, this, {
//                 single : true
//             });
//         }
//     }, // end of function setIconCls
//     setValue : function (value) {
//         this.callParent(arguments);
//         this.setIconCls();
//     } // end of function setValue
// });
// end of file
