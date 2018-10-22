Ext.define('DESKTOP.SystemSetup.notification.view.Notification', {
    extend: 'Ext.form.Panel',
    alias: 'widget.notification',
    requires: [
        'DESKTOP.SystemSetup.notification.controller.NotificationController',
        'DESKTOP.SystemSetup.notification.model.NotificationModel'
    ],
    controller: 'notify',
    viewModel: {
        type: 'notify'
    },
    itemId: 'Center',
    title: "Notification Center",
    frame: true,
    width : 600,
    //bodyPadding : 30,
    url: 'app/SystemSetup/backend/notification/Notification_center.php',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        //labelWidth : 200,
        msgTarget: 'side'
    },
    trackResetOnLoad: true,
    // defaultType: 'textfield',
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
                text: 'Notification type',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'Choose system notification to appear on the notification center'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxgroup',
                itemId: 'notify_type',
                defaults: {
                    width: 120
                },
                inputValue: 1,
                uncheckedValue: 0,
                items: [{
                    boxLabel: 'Alerts',
                    name: 'info',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Warning',
                    name: 'warning',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Error',
                    name: 'error',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Backup events',
                    name: 'backup_event',
                    inputValue: 1,
                    uncheckedValue: 0
                }]
            }]
        }]
    }]
});
