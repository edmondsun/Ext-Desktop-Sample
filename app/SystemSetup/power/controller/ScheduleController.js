Ext.define('DESKTOP.SystemSetup.power.controller.ScheduleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.schedule',
    requires: [
        'Ext.window.MessageBox',
        'DESKTOP.SystemSetup.power.view.ScheduleSetting'
    ],

    /* Show/Hide schedule grid through checkbox */
    enableBox: function (checkboxfield, ischecked) {
        var change = checkboxfield.next('grid');

        if (ischecked)  change.enable();
        else            change.disable();
    },

    /* Add a schedule setting */
    onAdd: function () {
        var createschedule = Ext.create('DESKTOP.SystemSetup.power.view.ScheduleSetting');
        createschedule.show();
    },

    /* Edit an existing schedule setting */
    onEdit: function () {
        var grid = this.lookupReference('pwrschedule').getSelectionModel();
        if (grid.hasSelection()) {
            var schedule = grid.getSelection()[0],
                action = schedule.get('action'),
                type = schedule.get('type'),
                hours = schedule.get('hours'),
                setting = Ext.create('DESKTOP.SystemSetup.power.view.ScheduleSetting', {
                    title: 'Edit Schedule'
                });
            setting.setConfig('index', schedule.get('index'));
            // set action; I was suprised that it can get the original before-rendered value of action
            setting.queryById('scheAction').setValue(action);
            setting.queryById('combo').setValue(type);
            setting.queryById('Hour').setValue(schedule.get('hours'));
            setting.queryById('Min').setValue(schedule.get('minutes'));
            // set type
            switch (type) {
            case 'daily':
                setting.queryById('Weekly').hide();
                setting.queryById('Specific').hide();
                setting.queryById('Daily').show();
                setting.queryById('dayP').setValue(schedule.get('day_period'));
                break;
            case 'weekly':
                setting.queryById('Daily').hide();
                setting.queryById('Specific').hide();
                setting.queryById('Weekly').show();
                setting.queryById('weekP').setValue(schedule.get('week_period'));
                var arr = schedule.get('weekdays');
                var newarr = arr.map(function (item) {
                    return item.toString();
                });
                setting.queryById('weekDays').setValue({
                    'weekdays[]': newarr
                });
                break;
            case 'specific date':
                setting.queryById('Daily').hide();
                setting.queryById('Weekly').hide();
                setting.queryById('Specific').show();
                var dateFormat = schedule.get('months') + '-' + schedule.get('dates');
                setting.queryById('specificDate').setValue(dateFormat);
                break;
            }
            setting.show();
            grid.deselect(schedule);
        } else {
            Ext.Msg.alert("No select", 'No schedule is selected');
        }
    },

    /* Delete the selected schedule */
    onDelete: function (field) {
        var grid = this.lookupReference('pwrschedule').getSelectionModel(),
            index = grid.getSelection()[0].get('index'),
            me = this;
        if (grid.hasSelection()) {
            Ext.Ajax.request({
                url: 'app/SystemSetup/backend/power/Management.php',
                method: 'post',
                params: {
                    op: 'delete_schedule',
                    index: index
                },
                success: function (form, action) {
                    var respText = Ext.util.JSON.decode(form.responseText),
                        msg = respText.msg;
                    Ext.MessageBox.alert('Success', msg);
                    me.getStore('schedulearr').reload();
                },
                failure: function (response, options) {
                    var respText = Ext.util.JSON.decode(response.responseText),
                        msg = respText.msg;
                    Ext.MessageBox.alert('Failed', msg);
                }
            });
        } else {
            Ext.Msg.alert("No select", 'No schedule is selected');
        }
    },

    /* Handle schedule setting events */
    onSettingApply: function (field) {
        var win = field.up('window'),
            form = win.down('form').getForm(),
            todate = form.findField('to_date').getSubmitValue(),
            date = todate.split('-'),
            index = win.getIndex();

        if (form.isValid()) {
            form.submit({
                url: 'app/SystemSetup/backend/power/Management.php',
                waitMsg: 'Saving...',
                params: {
                    op: (win.getTitle() == 'Edit Schedule') ? 'edit_schedule' : 'create_schedule',
                    months: date[0],
                    dates: date[1],
                    schedule_index: index
                },
                success: function (form, action) {
                    Ext.Msg.alert('Success', action.result.msg);
                    Ext.ComponentQuery.query('#Schedule')[0].getViewModel('schedule').getStore('schedulearr').reload();
                    win.close();
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },

    /* Set enable/disable signal of showing grid */
    on_Apply_All: function (form, appWindow) {
        var powerscheduleStore = this.getStore('powerschedule'),
            enableBox = this.lookupReference('enableBox'),
            grid = this.lookupReference('pwrschedule');

        if (form.isValid()) {
            appWindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/power/Management.php',
                params: {
                    op: 'setting'
                },
                success: function (form, action) {
                    enableBox.getValue() ? grid.enable() : grid.disable();
                    appWindow.getresponse(0, 'Schedule');
                    appWindow.hideLoadingMask();
                    powerscheduleStore.reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg
                            ? action.result.msg
                            : 'Fail to apply your configuration.';

                    appWindow.getresponse(ref, 'Schedule');
                    appWindow.hideLoadingMask();
                    powerscheduleStore.reload();
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
