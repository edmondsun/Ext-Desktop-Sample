Ext.define('DESKTOP.SystemSetup.maintenance.controller.ImportExportController', {
    extend: 'Ext.app.ViewController',
    requires: [],
    alias: 'controller.importexport',
    doImport: function (field) {
        var form = field.up('form');
        if (form.isValid()) {
            form.submit({
                params: {
                    op: 'import_cfg'
                },
                url: 'app/SystemSetup/backend/maintenance/ImportExport.php',
                waitMsg: 'Uploading...',
                success: function (form, action) {
                    var res_obj = Ext.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Success', res_obj.msg);
                },
                failure: function (form, action) {
                    var res_obj = Ext.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Failed', res_obj.msg);
                }
            });
        }
    },
    doExport: function (field) {
        /*-----------------------------Export for method:POST----------------------------------------------*/
        var form = Ext.create('Ext.form.Panel', { // this wolud be your form
            standardSubmit: true // this is the important part
        });
        form.submit({
            url: 'app/SystemSetup/backend/maintenance/ImportExport.php',
            params: {
                op: 'export_cfg'
            }
        });
        /*-----------------------------Export for method:GET----------------------------------------------*/
        /*var form = Ext.DomHelper.append(document.body, {
        tag:          'iframe',
        method :       'post',
        frameBorder:  0,
        width:        0,
        height:       0,
        css:          'display:none;visibility:hidden;height:0px;',
        src:          '../../../../DESKTOP/backend/ss/maintenance/ImportExport.php?op=export_cfg'
        });
        document.body.appendChild(form);
        // add any other form fields you like here
        form.submit();
        document.body.removeChild(form);*/
    }
});
