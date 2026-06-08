Ext.define('Admin.view.mri.cee.CeeF1bList',{
	extend: 'Ext.grid.Grid',
	xtype: 'mri-cee-f1b-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{opdStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'No',
			dataIndex: 'id',
			hidden: true
		},

		{
			text: 'Sumber Data',
			dataIndex: 'sumber_data',
			width: 400
		},
		{
			text: 'Kelemahan',
			dataIndex: 'kelemahan',
			width: 400
		},
		{
			text: 'Kekuatan',
			dataIndex: 'kekuatan',
			width: 400
		},
		{
			text: 'Klasifikasi',
			dataIndex: 'klasifikasi',
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
			{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true, iconCls: 'x-fa fa-print',margin:'0 10 0 10',xmode:'kota',handler: 'formPrint_Show',}, 
			{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},
			//{xtype: 'button',text: 'FS',handler:'fullScreen'},

	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
