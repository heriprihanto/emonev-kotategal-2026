Ext.define('Admin.view.renstra.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'renstra-opd-list',
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
			width: '40%'
		},
		
		/*
		
		{
			text: 'Status Laporan',
			columns: [
				{text: 'Tw I',dataIndex: 'vtw1',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Tw II',dataIndex: 'vtw2',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Tw III',dataIndex: 'vtw3',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Tw IV',dataIndex: 'vtw4',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
			]
		},
		
		*/		
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
			
			
			{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true, iconCls: 'x-fa fa-print',margin:'0 10 0 10',xmode:'kota',handler: 'formPrint_Show',}, 
			//{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},
			//{xtype: 'button',text: 'FS',handler:'fullScreen'},
			{xtype:'spacer'},
			
			{xtype: 'textfield',width:250,placeholder:'Pencarian ...',
				listeners: {action: 'cariOPD',clearicontap: 'clearCariOPD'}
			},
	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
