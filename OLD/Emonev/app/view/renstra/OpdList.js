Ext.define('Admin.view.renstra.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'renstra-list-opd',
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
			text: 'Kode',
			dataIndex: 'kode',
			width: 180,cell: {encodeHtml: false},
			
		},
		{
			text: 'OPD',
			dataIndex: 'nama_pd',
			width: '50%'
		},
		
		/*
		{
			text: 'Tahapan',
			columns: [
				{text: 'Ranwal',dataIndex: 'tw1'},
				{text: 'Rancangan',dataIndex: 'tw1'},
				{text: 'Rankir',dataIndex: 'tw1'},
				{text: 'Penetapan',dataIndex: 'tw1'},
			]
		},
		*/
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
			{xtype: 'textfield',label: 'Cari',width:250,reference:'x_text_cari_opd_sakip',
				listeners: {action: 'cariOPD',clearicontap: 'clearOPD'}
			},
			
			//{xtype: 'button',text: 'FS',handler:'fullScreen'},

	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
