Ext.define('Admin.plugin.CellEditing', {
    override: 'Ext.grid.plugin.CellEditing',

    getEditor: function (location) {
        var editor = this.callParent([location]);
        if (editor) {
            this.addEditorEvents(editor, location);
        }
        return editor;
    },

    addEditorEvents: function (editor, location) {
        editor.on('beforestartedit', function () {
            var handlerResult = this.getGrid().fireEvent('beforeedit', location);
            if(handlerResult === false) {
                editor.hide();
            }
            return handlerResult;
        }, this, {
            single: true
        });

        editor.on('complete', function () {
            this.getGrid().fireEvent('edit', location);
        }, this, {
            single: true
        });
    }
});