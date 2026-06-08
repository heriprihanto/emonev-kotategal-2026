Ext.define('Admin.view.dak.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'opd-dak-list',
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
		
		
		{
			text: 'Laporan Triwulan',
			columns: [
				{text: 'Jan',dataIndex: 'vo_1',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Feb',dataIndex: 'vo_2',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Mar',dataIndex: 'vo_3',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Apr',dataIndex: 'vo_4',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Mei',dataIndex: 'vo_5',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Jun',dataIndex: 'vo_6',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Jul',dataIndex: 'vo_7',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Agu',dataIndex: 'vo_8',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Sep',dataIndex: 'vo_9',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Okt',dataIndex: 'vo_10',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Nov',dataIndex: 'vo_11',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
				{text: 'Des',dataIndex: 'vo_12',width: 80,cell : {encodeHtml : false},renderer : 'renderChecklist'},
			]
		},
		
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
			{xtype: 'textfield',label: 'Cari',width:250,
				listeners: {action: 'cariOPD',clearicontap: 'clearCariOPD'}
			},
			{xtype:'spacer'},
			{xtype: 'button',ui : 'soft-blue',shadow:true,text: 'Laporan',iconCls: 'x-fa fa-print',margin:'0 5 0 5',
				handler: 'formPrint_Show',mode:'admin'
			},
			{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},
			//{xtype: 'button',text: 'FS',handler:'fullScreen'},

	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
