Ext.define('DESKTOP.Desktop.controller.Shortcut', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.shortcut',
    adjustPosition: function () {
        var shortcutContainer = Ext.getCmp('shortcutContainer');
        var windowContainer = Ext.getCmp('windowContainer');
        var animate = {
            duration: 100
        };
        if (windowContainer.getHeight() > shortcutContainer.getHeight()) {
            shortcutContainer.anchorTo(Ext.getCmp('windowContainer'), 'c-c', [0, 0], animate);
        } else {
            shortcutContainer.anchorTo(Ext.getCmp('windowContainer'), 't-t', [0, 0], animate);
        }
    },
    shortcut: function (type, item) {
        var output = null;
        switch (type) {
        case 'createMenu':
            output = createMenu(item);
            break;
        case '':
            break;
        default:
            break;
        }
        return output;

        function createMenu(item) {
            var menu = Ext.create('Ext.menu.Menu', {
                style: 'border-radius:7px;font-size: 13px;',
                plain: true,
                autoShow: true,
                items: [{
                    text: 'About App',
                    handler: function (item) {
                        about(item);
                    }
                }, '-', {
                    text: 'Add to the Dock',
                    handler: function (item) {
                        addToDock(item);
                    }
                }, {
                    text: 'Open',
                    handler: function (item) {
                        open(item);
                    }
                }, {
                    text: 'Remove',
                    handler: function (item) {
                        remove(item);
                    }
                }]
            });
            return menu;
        }
        /* TODO: call fn() from allApp Controller, open a window */
        function about() {}
        /* TODO: call fn() from allApp Controller, add item from dock.json */
        function addToDock() {}
        /* TODO: call fn() from appwindow Controller, open a window */
        function open() {}
        /* TODO: call fn() from allApp Controller, remove item from shortcut.json */
        function remove() {}
    }
});
