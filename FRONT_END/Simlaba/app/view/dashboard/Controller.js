
Ext.define('Admin.view.dashboard.Controller', {
	extend: 'Admin.base.ViewController',

	onBarTipRender: function(tooltip, record, item) {
        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
            manufacturer = item.series.getTitle()[fieldIndex],
            percent = record.get(item.field) / this.getYearTotal(record) * 100;

        tooltip.setHtml(manufacturer + ' in ' + record.get('year') + ': ' +
            percent.toFixed(1) + '%');
    },
});
