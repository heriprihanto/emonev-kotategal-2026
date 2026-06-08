Ext.define('Admin.view.kinerja.TwList',{
	extend: 'Ext.grid.Grid',
	xtype: 'tw-capkin-list',
	fullscreen: true,striped:true,margin: '0 5 0 5',
	requires: [],
	rowNumbers: true,columnLines:true,rowLines:true,
	
	bind: {
		store: '{twStore}',selection: '{selectedOpd}'
	},
	
	columns: [
		
		{
			text: 'id',
			dataIndex: 'id',
			hidden: true
		},
		{
			text: 'Triwulan',
			dataIndex: 'tws',
			width: 250,cell: {encodeHtml: false},
			
		},
		{
			text: 'Tgl Buat',
			dataIndex: 'tgl1',
			width: 180,formatter: 'date("d/m/Y H:i:s")'
		},
		{
			text: 'User',
			dataIndex: 'user1',
			width: 180
		},
		{
			text: 'Tgl Kirim',
			dataIndex: 'tgl2',
			width: 180,formatter: 'date("d/m/Y H:i:s")'
		},
		{
			text: 'Tgl Verifikasi',
			dataIndex: 'tgl3',
			width: 180,formatter: 'date("d/m/Y H:i:s")'
		},
		{
			text: '',
			dataIndex: 'locked',
			width: 180,cell : {encodeHtml : false},
			renderer : function(value, record) {
				var td = record.data;
				let scls='';
				if (td.locked == 1) {
					return '<i class="x-fa fa-lock" aria-hidden="true"></i>';
				} else {
					return '<i class="x-fa fa-unlock" aria-hidden="true"></i>';
				} 
				
				
			}
		},
		
		
		
				
		
	],
	items: [
		{docked: 'top',xtype : 'toolbar',bodyPadding:20,
		defaults : {height : '30px',style : {fontSize : '11px'}},
		items : [ 
			{xtype: 'button',ui : 'soft-red',text: 'Kembali',shadow:true,iconCls: 'x-fa fa-backward',margin:'0 5 0 5',handler: 'onBalik',destIdx:0}, 	
			{xtype: 'button',ui : 'soft-green',text: 'Buat Laporan',shadow:true,iconCls: 'x-fa fa-plus',margin:'0 5 0 5',handler: 'formLapTw_Show',destIdx:0},
			{xtype:'spacer'},
			{xtype: 'button',ui : 'soft-blue',text:'Laporan',shadow:true,handler: 'formPrint_Show',iconCls: 'x-fa fa-print',margin:'0 10 0 10',xmode:'opd'}, 
	]
    }],
	listeners: {
		childtap : 'TwList_itemClick'
	}
});
