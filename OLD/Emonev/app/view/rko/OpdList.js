Ext.define('Admin.view.rko.OpdList',{
	extend: 'Ext.grid.Grid',
	xtype: 'opd-rko-list',
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
			align: 'right',width: 200,cell: {encodeHtml: false},
			
		},
		{
			text: 'OPD',
			dataIndex: 'nama_pd',
			width: '50%'
		},
		
		{
			text: 'Anggaran',
			dataIndex: 'anggaran',align: 'right',renderer: Ext.util.Format.numberRenderer('0,0'),width: 160
		}, 
		{
			text: 'Jumlah',columns: [
				{text: '<font size=1>Subkeg</font>',dataIndex: 'jm_sub',width: 100},
				{text: '<font size=1>Paket Pek.</font>',dataIndex: 'jm_pek',width: 100},
			]
		},
		
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		items : [ 
			{xtype: 'textfield',label: '',width:250,reference:'x_text_cari_opd_sakip',labelAlign:'left',placeholder:'Pencarian ...',
				listeners: {action: 'cariOPD',clearicontap: 'clearOPD'}
			},
			/*
			{xtype: 'progress',shadow: true,
				width: '75%', ui: 'marketing',text: 'Progres Pemaketan Pekerjaan (75%)',value: 0.5
			},
			*/
			{xtype: 'spacer'},
			{xtype: 'button',text: '',handler:'fullScreen',iconCls: 'x-fa fa-expand',},

	]
    }],
	listeners: {
		childtap : 'OpdList_itemClick'
	}
});
