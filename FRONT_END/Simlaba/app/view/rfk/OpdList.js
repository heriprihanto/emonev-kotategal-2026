Ext.define('Admin.view.rfk.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'opd-rfk-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{opdStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id_sub_pd',
			hidden: true
		},
		{
			text: 'Kode',
			dataIndex: 'kode',
			align: 'right',width: 150,cell: {encodeHtml: false},
			
		},
		{
			text: 'OPD',
			dataIndex: 'nama_pd',
			width: 400
		},
		{
			text: 'Laporan Bulanan',
			columns: [
				{text: 'Jan',dataIndex: 'b1',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Feb',dataIndex: 'b2',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Mar',dataIndex: 'b3',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Apr',dataIndex: 'b4',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Mei',dataIndex: 'b5',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Jun',dataIndex: 'b6',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Jul',dataIndex: 'b7',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Agu',dataIndex: 'b8',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Sep',dataIndex: 'b9',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Okt',dataIndex: 'b10',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Nov',dataIndex: 'b11',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				{text: 'Des',dataIndex: 'b12',cell: {encodeHtml: false},formatter: 'date("d M")',width:80},
				]
		},
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,defaults : {style : {fontSize : '11px'}},
		items : [ 
			{xtype: 'textfield',label: '',width:250,labelAlign:'left',placeholder:'Pencarian ...',
				listeners: {action: 'cariOPD',clearicontap: 'clearOPD'}
			},{xtype: 'spacer'},
			{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},
	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
