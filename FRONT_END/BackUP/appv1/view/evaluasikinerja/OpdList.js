Ext.define('Admin.view.evaluasikinerja.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'evaluasikinerja-opd-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{opdStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Kode PD',
			dataIndex: 'kode',
			width: 180,cell: {encodeHtml: false},
			
		},
		{
			text: 'Perangkat Daerah',
			dataIndex: 'nama_pd',
			width: 400
		},
		
		
			
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
			
			{xtype: 'textfield',label: 'Cari',width:250,
				listeners: {action: 'cariOPD',clearicontap: 'clearCariOPD'}
			},
			{xtype:'spacer'},
			//{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true, iconCls: 'x-fa fa-print',margin:'0 10 0 10',xmode:'kota',handler: 'formPrint_Show',}, 
			{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},
			//{xtype: 'button',text: 'FS',handler:'fullScreen'},

	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
