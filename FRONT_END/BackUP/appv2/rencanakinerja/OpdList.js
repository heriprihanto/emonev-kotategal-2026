Ext.define('Admin.view.rencanakinerja.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'opd-rencanacapkin-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	columnLines:true,rowLines:true,
	
	bind: {
		store: '{opdStore}',selection: '{selectedOpd}'
	},
	rowNumbers: {
		text: 'No.',width:50
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
			text: 'Perangkat Daerah',
			dataIndex: 'nama_pd',
			width: '40%',cell : {encodeHtml : false},
			renderer: function (value, record) {
				var td = record.data;
				if (Number(td.is_pd) == 1) {
					return `<b>${value}</b>`;
				} else {
					return '<span style="padding-left:25px">' + value + '</span>';
				}
			}
		},
		{
			text: 'Pagu Anggaran',
			dataIndex: 'anggaran',editable:true,
			width: 150,align: 'right',renderer: Ext.util.Format.numberRenderer('0,0.00')
		},
		
		{
			text: 'Jumlah',
			columns: [
				{
					text: 'Indikator Kinerja',
					dataIndex: 'jml_indikator',editable:true,
					width: 100,align: 'right'
				},
				{
					text: 'Program',
					dataIndex: 'jml_program',editable:true,
					width: 100,align: 'right'
				},
				{
					text: 'Kegiatan',
					dataIndex: 'jml_keg',editable:true,
					width: 100,align: 'right'
				},
				{
					text: 'Sub Kegiatan',
					dataIndex: 'jml_subkeg',editable:true,
					width: 100,align: 'right'
				},
				
			]
		},
		{
			text: 'Status',
			dataIndex: 'status',cell: {encodeHtml: false},
			width: 120,
			renderer : 'renderChecklist'
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
