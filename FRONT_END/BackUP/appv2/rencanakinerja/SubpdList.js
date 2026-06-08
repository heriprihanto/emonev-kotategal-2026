Ext.define('Admin.view.rencanakinerja.SubpdList', {
	extend: 'Ext.grid.Grid',
	xtype: 'subpd-rencanacapkin-list',
	fullscreen: true, striped: true, margin: '0 5 0 5',
	requires: [],
	rowNumbers: true, columnLines: true, rowLines: true,

	bind: {
		store: '{subPdStore}', selection: '{selectedOpd}'
	},

	columns: [

		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Kode Sub PD',
			dataIndex: 'kode',
			width: 180, cell: { encodeHtml: false },

		},
		{
			text: 'Perangkat Daerah / Sub Perangkat Daerah',
			dataIndex: 'nama_pd',
			width: 400
		},
		{
			text: 'Status',
			columns : [
				{text: 'OPD', dataIndex: 'v1',align:'center',cell: {encodeHtml: false},
				renderer:function (value,record) {
					if (parseInt(value) > 0) {return '<i class="x-fa fa-check" style="color:green"></i>';} else {return '<i class="x-fa fa-times" style="color:red"></i>';}
				}},	
				{text: 'BAPPERIDA', dataIndex: 'v2',align:'center',cell: {encodeHtml: false},
				renderer:function (value,record) {
					if (parseInt(value) > 0) {return '<i class="x-fa fa-check" style="color:green"></i>';} else {return '<i class="x-fa fa-times" style="color:red"></i>';}
				}},		
			]
		},


	],

	items: [
		{
			docked: 'top',
			items: [
				{
					html: '<div class="alert alert-success" id="psub-pd-x986ypriey3452as"> </div>'
				}]
		},
		{
			docked: 'top',
			xtype: 'toolbar',
			defaults: {
				height: '30px',
				style: {
					fontSize: '11px'
				}
			},
			items: [
				{ xtype: 'button', ui: 'soft-red', text: 'Kembali', shadow: true, iconCls: 'x-fa fa-backward', margin: '0 5 0 5', handler: 'onBalik', destIdx: 0 },
				//{xtype: 'button',ui : 'action',text: 'Tambah',iconCls: 'x-fa fa-plus',margin:'0 5 0 5',handler: 'tambahIndikatorProgram',destIdx:1}, 
				//{xtype: 'button',ui : 'confirm',text: 'Permasalahan dan Upaya',iconCls: 'x-fa fa-minus',margin:'0 5 0 5',handler: 'openFormMasalahProgram'},	
			]
		}],

	listeners: {
		childtap: 'SubOpdList_itemClick'
	}
});
